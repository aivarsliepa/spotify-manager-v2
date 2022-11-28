import type { Label } from "@prisma/client";
import { memo } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { trpc } from "../../../utils/trpc";

type Props = {
  songId: string;
  label: Label;
};

const SongLabel = ({ label, songId }: Props) => {
  const trpcUtils = trpc.useContext();
  const disconnectSong = trpc.labels.disconnectSong.useMutation({
    onSettled: () => {
      trpcUtils.songs.getById.invalidate({ id: songId });
    },
  });

  const onDelete = () => {
    disconnectSong.mutate({ songId, name: label.name });
  };

  return (
    <div tabIndex={0} className="flex cursor-pointer gap-2 rounded-3xl border border-black py-1 px-3 hover:bg-slate-300 focus:bg-slate-300">
      <span>{label.name}</span>
      <XMarkIcon
        tabIndex={0}
        className="h-5 w-5 self-center rounded-full hover:bg-red-300 focus:bg-red-300"
        color="red"
        onClick={onDelete}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onDelete();
          }
        }}
      />
    </div>
  );
};

export default memo(SongLabel);
