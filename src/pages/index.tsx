import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"></main>
    </>
  );
};

export default Home;
