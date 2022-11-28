import { type NextPage } from "next";
import { useRouter } from "next/router";
import { memo } from "react";
import SongLabels from "../../components/songs/labels/SongLabels";

import { trpc } from "../../utils/trpc";

const SongPage: NextPage = () => {
  const {
    query: { songId },
  } = useRouter();

  const { data } = trpc.songs.getById.useQuery({ id: songId as string }, { enabled: !!songId });

  if (!data || typeof songId !== "string") {
    return <>Loading...</>;
  }

  const { song } = data;
  const artists = song.artists.join(", ");

  return (
    <div className="flex h-full gap-4">
      <img src={song.image} alt={song.name} className="h-full object-contain" width={400} height={400} />
      <div className="self-center">
        <h4>{song.name}</h4>
        <h5>{artists}</h5>
        <SongLabels selectedLabels={song.labels} songId={songId} />
      </div>
    </div>
  );
};

export default memo(SongPage);
