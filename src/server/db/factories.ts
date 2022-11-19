import type { Prisma } from "@prisma/client";

export const spotifyTrackToSongInput = (track: SpotifyApi.TrackObjectFull): Prisma.SongCreateInput => {
  const artists = track.artists.map((artist) => artist.name);

  return {
    artists,
    spotifyId: track.linked_from?.id ?? track.id,
    name: track.name,
    uri: track.uri,
    image: track.album.images[0]?.url ?? "",
  };
};

export const spotifyPlaylistToPlaylistInput = ({
  name,
  id,
  images,
}: SpotifyApi.PlaylistObjectSimplified): Omit<Prisma.PlaylistCreateInput, "user"> => ({
  name,
  spotifyId: id,
  image: images[0]?.url ?? "",
});
