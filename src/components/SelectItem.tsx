import type { PropsWithChildren } from "react";
import { memo } from "react";

type Props = PropsWithChildren<{
  onClick: () => void;
}>;

const SelectItem = ({ children, onClick }: Props) => {
  return (
    <div
      className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default memo(SelectItem);
