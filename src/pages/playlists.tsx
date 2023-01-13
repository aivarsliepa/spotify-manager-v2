import { type NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";

import { trpc } from "../utils/trpc";

const PlaylistsPage: NextPage = () => {
  const { data, isLoading } = trpc.playlists.getAll.useQuery();

  const playlists = useMemo(() => {
    return data?.map((playlist) => {
      return (
        <div className="flex h-14 items-center gap-4 py-1 px-4 hover:bg-slate-200" key={playlist.spotifyId}>
          <div className="flex h-full gap-4">
            <img src={playlist.image} alt={playlist.name} className="h-full object-cover" width={48} height={48} />
            <div className="self-center">{playlist.name}</div>
          </div>
          <Link href={`/songs?playlists=${playlist.spotifyId}`}>
            <button className="bg-slate-200">Songs</button>
          </Link>
        </div>
      );
    });
  }, [data]);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col">{playlists}</div>
    </div>
  );
};

export default PlaylistsPage;
