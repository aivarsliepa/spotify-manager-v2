import type { Song } from "@prisma/client";
import Link from "next/link";
import { memo } from "react";

const SongListItem = ({ song }: { song: Song }) => {
  const artists = song.artists.join(", ");

  return (
    <div className="flex h-14 items-center gap-4 py-1 px-4 hover:bg-slate-600">
      <input type="checkbox" className="self-center" />
      <div className="flex h-full gap-4">
        <img src={song.image} alt={song.name} className="h-full" />
        <div className="self-center">
          {song.name} - {artists}
        </div>
      </div>
      <Link href={`/songs/${song.spotifyId}`}>
        <button className="bg-slate-200">Details</button>
      </Link>
    </div>
  );
};

export default memo(SongListItem);
