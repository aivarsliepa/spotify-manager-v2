import type { PropsWithChildren } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid min-h-screen grid-cols-[256px_1fr] grid-rows-[64px_1fr]">
      <Header></Header>
      <SideNav></SideNav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
