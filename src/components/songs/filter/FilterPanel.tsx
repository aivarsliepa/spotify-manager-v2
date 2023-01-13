import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { trpc } from "../../../utils/trpc";

const FilterPanel = () => {
  const router = useRouter();
  // const { pid } = router.query

  console.log({ query: router.query });

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("label", "test");
    params.append("label", "test2");

    router.push(`/songs?${params.toString()}`, undefined, { shallow: true });
  }, []);

  const { data: labelData } = trpc.labels.getAll.useQuery();

  if (!labelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-h-[300px] overflow-y-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="relative flex flex-col gap-8 bg-white p-7">test</div>
    </div>
  );
};

export default memo(FilterPanel);
