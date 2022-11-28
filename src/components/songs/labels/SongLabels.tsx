import type { Label } from "@prisma/client";
import { memo } from "react";
import LabelPopover from "./LabelPopover";
import SongLabel from "./SongLabel";

interface Props {
  selectedLabels: Label[];
  songId: string;
}

const SongLabels = ({ selectedLabels, songId }: Props) => {
  return (
    <div className="flex gap-2">
      <LabelPopover selectedLabels={selectedLabels} songId={songId} />
      {selectedLabels.map((label) => (
        <SongLabel key={label.id} label={label} songId={songId} />
      ))}
    </div>
  );
};

export default memo(SongLabels);
