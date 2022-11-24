import Link from "next/link";

const SideNav = () => {
  return (
    <nav className="col-start-1 row-span-2 row-start-1 flex flex-col gap-4 py-4 pl-7 pr-4">
      <Link href="/songs">Songs</Link>
      <Link href="/labels">Labels</Link>
      <Link href="/playlists">Playlists</Link>
      <Link href="/sync">Sync</Link>
    </nav>
  );
};

export default SideNav;
