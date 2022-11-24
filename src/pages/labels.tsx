import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const LabelsPage: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return <>labels</>;
};

export default LabelsPage;
