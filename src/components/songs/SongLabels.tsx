import type { Label, Song } from "@prisma/client";
import { memo } from "react";

interface Props {
  song: Song;
  labels: Label[];
}

const SongLabels = ({ song, labels }: Props) => {
  return <>labels: todo</>;
};

export default memo(SongLabels);
