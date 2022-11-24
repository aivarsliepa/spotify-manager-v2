import type { Prisma } from "@prisma/client";
import fetch from "node-fetch";
import { wait } from "../utils/time";
import { spotifyPlaylistToPlaylistInput, spotifyTrackToSongInput } from "./db/factories";
import { keyIsNotEmpty } from "../utils/guards";
import { createUrlWithParams } from "../utils/url";

import { prisma } from "./db/client";

const apiConfig = {
  // tracks: "https://api.spotify.com/v1/tracks",
  token: "https://accounts.spotify.com/api/token",
  myTracks: {
    url: "https://api.spotify.com/v1/me/tracks",
    params: {
      limit: "50",
    },
  },
  myPlaylists: {
    url: "https://api.spotify.com/v1/me/playlists",
    params: {
      limit: "50",
    },
  },
  play: "https://api.spotify.com/v1/me/player/play",
  playlistTracks: {
    buildURL: (playlistId: string) => `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    params: {
      limit: "100",
      market: "from_token",
      fields: "total,limit,items(track(images,linked_from,id,name,uri,album(images),artists(name)))",
    },
  },
};

async function fetchWithRetry<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // too many requests code
  const retryAfter = Number(res.headers.get("Retry-After"));
  if (res.status === 429 && !Number.isNaN(retryAfter)) {
    await wait(retryAfter);
    return await fetchWithRetry(url, token);
  } else if (res.status !== 200) {
    console.log(res.status);
    throw Error(res.statusText);
  }

  return (await res.json()) as T;
}

export async function fetchUserSavedTracks(token: string) {
  const { url, params } = apiConfig.myTracks;
  const responses = await fetchAllFromAPI<SpotifyApi.UsersSavedTracksResponse>(url, token, params);
  return responses.map((response) => response.items.map((item) => spotifyTrackToSongInput(item.track))).flat();
}

export async function fetchPlaylistData(token: string) {
  const { url, params } = apiConfig.myPlaylists;
  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(url, token, params);
  return playlistResponses.map((playlistReponse) => playlistReponse.items.map(spotifyPlaylistToPlaylistInput)).flat();
}

export async function playSongs(token: string, uris: string[]): Promise<void> {
  // const res =
  await fetch(apiConfig.play, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({ uris }),
  });

  // TODO: error handling !
  // const resBody = await res.json();
  // console.log(res.status);
  // console.log(res.statusText);
  // console.log(resBody);
}

export async function fetchAllFromAPI<T extends { total: number; limit: number }>(
  apiUrl: string,
  token: string,
  params: Record<string, string> = {},
): Promise<T[]> {
  // need to make first request to see the total number of items -> `response.body.total`
  const url = createUrlWithParams(apiUrl, { ...params });
  const firstRequestBody = await fetchWithRetry<T>(url, token);

  // prepare requests for the rest of the playlists
  const urls: string[] = [];
  for (let i = firstRequestBody.limit; i < firstRequestBody.total; i += firstRequestBody.limit) {
    urls.push(createUrlWithParams(apiUrl, { offset: i.toString(), ...params }));
  }

  const requests = urls.map((url) => fetchWithRetry<T>(url, token));
  const restOfRequests = await Promise.all(requests);

  return [firstRequestBody, ...restOfRequests];
}

export async function fetchPlaylistSongsByPlaylistId(token: string, playlistId: string) {
  const url = apiConfig.playlistTracks.buildURL(playlistId);
  const responses = await fetchAllFromAPI<SpotifyApi.PlaylistTrackResponse>(url, token, apiConfig.playlistTracks.params);

  return responses
    .map((reponse) => reponse.items)
    .flat()
    .filter(keyIsNotEmpty("track"))
    .map((item) => spotifyTrackToSongInput(item.track));
}

export async function getAccessToken(userId: string) {
  const { access_token } = await prisma.account.findFirstOrThrow({
    where: { userId, provider: "spotify" },
    select: { access_token: true },
  });

  return access_token;
}

// TODO: 1. what if auth token is expires while syncing ?
// 2. return summary of sync
export async function synchronizeWithSpotify(userId: string) {
  const token = await getAccessToken(userId);
  if (!token) {
    return;
  }

  const savedSongs = new Map<string, Prisma.SongCreateInput>();
  const allSongs = new Map<string, Prisma.SongCreateInput>();
  const playlistSongs = new Map<string, Prisma.SongCreateInput[]>();

  // 1. get all playlists
  const playlists = await fetchPlaylistData(token);

  // 2. get saved tracks
  const savedTracks = await fetchUserSavedTracks(token);

  savedTracks.forEach((song) => {
    savedSongs.set(song.spotifyId, song);
    allSongs.set(song.spotifyId, song);
  });

  // 3. fetch songs for playlists and add playlist id to user.songs[].playlists
  await Promise.all(
    playlists.map(async (playlist) => {
      const playlistTracks = await fetchPlaylistSongsByPlaylistId(token, playlist.spotifyId);
      playlistSongs.set(playlist.spotifyId, playlistTracks);

      for (const track of playlistTracks) {
        allSongs.set(track.spotifyId, track);
      }
    }),
  );

  // 4. create songs
  await prisma.song.createMany({ skipDuplicates: true, data: [...allSongs.values()] });

  // 5. create user related data and relations
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { playlists: { deleteMany: {} } } }),
    prisma.user.update({
      where: { id: userId },
      data: {
        playlists: {
          createMany: {
            data: playlists,
          },
        },
      },
    }),
    ...Array.from(allSongs.values()).map((song) => {
      const data = { isSaved: savedSongs.has(song.spotifyId), songSpotifyId: song.spotifyId, userId };
      return prisma.songsOnUsers.upsert({
        where: { userId_songSpotifyId: { userId, songSpotifyId: song.spotifyId } },
        update: data,
        create: data,
      });
    }),
    ...Array.from(playlistSongs.entries()).map(([playlistId, songs]) => {
      return prisma.playlist.update({
        where: { spotifyId: playlistId },
        data: {
          songs: {
            set: songs.map((song) => ({ spotifyId: song.spotifyId })),
          },
        },
      });
    }),
  ]);
}
