import { Popover, Transition } from "@headlessui/react";
import { Fragment, memo } from "react";

type Props = {
  button: () => JSX.Element;
  panel: () => JSX.Element;
};

// TODO: mobile
const AppPopover = ({ button, panel }: Props) => {
  return (
    <Popover className="relative flex">
      <Popover.Button>{button()}</Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute top-1/2 z-10 mt-3 transform px-4 sm:px-0">{panel()}</Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default memo(AppPopover);
