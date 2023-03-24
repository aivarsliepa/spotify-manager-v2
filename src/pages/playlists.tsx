import { type NextPage } from "next";
import { useMemo } from "react";
import LinkListItem from "../components/LinkListItem";

import { trpc } from "../utils/trpc";

const PlaylistsPage: NextPage = () => {
  const { data } = trpc.playlists.getAll.useQuery();

  const playlists = useMemo(() => {
    return data?.map((playlist) => {
      return (
        <LinkListItem
          href={`/songs?playlists=${playlist.spotifyId}`}
          text={playlist.name}
          key={playlist.spotifyId}
          img={{ alt: playlist.name, src: playlist.image }}
        />
      );
    });
  }, [data]);

  return (
    <div>
      <div className="flex flex-col">{playlists}</div>
    </div>
  );
};

export default PlaylistsPage;
