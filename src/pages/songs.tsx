import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const SongsPage: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return <>songs</>;
};

export default SongsPage;
