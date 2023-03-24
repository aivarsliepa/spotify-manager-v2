import { type NextPage } from "next";
import { useMemo } from "react";
import LinkListItem from "../components/LinkListItem";

import { trpc } from "../utils/trpc";

const LabelsPage: NextPage = () => {
  const { data } = trpc.labels.getAll.useQuery();

  const labels = useMemo(() => {
    return data?.map((label) => {
      return <LinkListItem href={`/songs?labels=${label.id}`} text={label.name} key={label.id} />;
    });
  }, [data]);

  return (
    <div>
      <div className="flex flex-col">{labels}</div>
    </div>
  );
};

export default LabelsPage;
