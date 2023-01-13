import { PencilSquareIcon, PlusIcon } from "@heroicons/react/20/solid";
import { memo, useCallback, useMemo, useState } from "react";
import type { Label } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import AppPopover from "../../AppPopover";
import SelectItem from "../../SelectItem";

type Props = {
  songId: string;
  selectedLabels: Label[];
};

const LabelPicker = ({ selectedLabels, songId }: Props) => {
  const [labelInput, setLabelInput] = useState("");
  const labelInputTrimmed = labelInput.trim();

  const { data } = trpc.labels.getAll.useQuery();
  const trpcUtils = trpc.useContext();
  const invalidate = () => {
    trpcUtils.songs.getById.invalidate({ id: songId });
    trpcUtils.labels.getAll.invalidate();
  };

  const connectToSong = trpc.labels.connectToSong.useMutation({
    onSettled: invalidate,
  });
  const disconnectSong = trpc.labels.disconnectSong.useMutation({
    onSettled: invalidate,
  });

  const createAndConnectToSong = trpc.labels.createAndConnectToSong.useMutation({
    onSettled: () => {
      invalidate();
      setLabelInput("");
    },
  });

  const createNewLabel = () => {
    createAndConnectToSong.mutate({ name: labelInputTrimmed, songId });
  };

  const selectedLabelSet = useMemo(() => {
    return new Set(selectedLabels.map((label) => label.id));
  }, [selectedLabels]);

  const inputEqualsToLabel = useMemo(() => {
    return data?.some((label) => label.name === labelInputTrimmed);
  }, [data, labelInputTrimmed]);

  const labels = useMemo(() => {
    if (!data) {
      return [];
    }

    return data
      .filter((label) => label.name.includes(labelInputTrimmed))
      .map((label) => {
        return (
          <SelectItem
            key={label.id}
            onClick={() => {
              if (selectedLabelSet.has(label.id)) {
                disconnectSong.mutate({ songId, name: label.name });
              } else {
                connectToSong.mutate({ songId, name: label.name });
              }
            }}
          >
            <input type="checkbox" checked={selectedLabelSet.has(label.id)} readOnly />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{label.name}</p>
            </div>
          </SelectItem>
        );
      });
  }, [connectToSong, data, disconnectSong, labelInputTrimmed, selectedLabelSet, songId]);

  return (
    <div className="max-h-[300px] overflow-y-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="relative flex flex-col gap-8 bg-white p-7">
        <input type="text" placeholder="Enter label name" value={labelInput} onChange={(e) => setLabelInput(e.target.value)} />
        {labels}
        {labelInputTrimmed && !inputEqualsToLabel && (
          <div
            tabIndex={0}
            onClick={createNewLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createNewLabel();
              }
            }}
            className="-m-3 flex cursor-pointer items-center gap-2 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            <PlusIcon className="h-5 min-h-[20px] w-5 min-w-[20px]" />
            <span>create {`"${labelInputTrimmed}"`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const LabelPopover = ({ selectedLabels, songId }: Props) => {
  const renderButton = useCallback(() => <PencilSquareIcon className="h-8 w-8 rounded-full p-1 hover:bg-slate-300 " />, []);
  const renderPanel = useCallback(() => <LabelPicker selectedLabels={selectedLabels} songId={songId} />, [selectedLabels, songId]);

  return <AppPopover button={renderButton} panel={renderPanel} />;
};

export default memo(LabelPopover);
