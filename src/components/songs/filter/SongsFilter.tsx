import { memo, useCallback } from "react";

import { FunnelIcon } from "@heroicons/react/24/outline";
import AppPopover from "../../AppPopover";
import FilterPanel from "./FilterPanel";

const SongsFilter = () => {
  const renderButton = useCallback(
    () => (
      <div className="flex rounded-md p-2 hover:bg-slate-200">
        <FunnelIcon className="h-6 w-6" />
        <span>Filter</span>
      </div>
    ),
    [],
  );
  const renderPanel = useCallback(() => <FilterPanel />, []);

  return <AppPopover button={renderButton} panel={renderPanel} />;
};

export default memo(SongsFilter);
