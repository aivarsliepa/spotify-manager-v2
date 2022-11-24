import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const SyncPage: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return <>sync</>;
};

export default SyncPage;
