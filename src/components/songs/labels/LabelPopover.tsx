import { Popover, Transition } from "@headlessui/react";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/20/solid";
import { memo, useMemo, useState } from "react";
import type { Label } from "@prisma/client";
import { Fragment } from "react";
import { trpc } from "../../../utils/trpc";

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
          <div
            key={label.id}
            className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            onClick={() => {
              if (selectedLabelSet.has(label.id)) {
                disconnectSong.mutate({ songId, name: label.name });
              } else {
                connectToSong.mutate({ songId, name: label.name });
              }
            }}
          >
            <input type="checkbox" checked={selectedLabelSet.has(label.id)} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{label.name}</p>
            </div>
          </div>
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

// TODO: mobile
const LabelPopover = ({ selectedLabels, songId }: Props) => {
  return (
    <Popover className="relative flex">
      <Popover.Button>
        <PencilSquareIcon className="h-8 w-8 rounded-full p-1 hover:bg-slate-300 " />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute top-1/2 z-10 mt-3 transform px-4 sm:px-0">
          <LabelPicker selectedLabels={selectedLabels} songId={songId} />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default memo(LabelPopover);
