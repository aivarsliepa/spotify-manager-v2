import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="mr-10 flex items-center justify-between py-2 px-6">
      <input type="text" placeholder="maybe searchbox in the future" className="min-w-[30rem] rounded border border-black" />
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </header>
  );
};

export default Header;
