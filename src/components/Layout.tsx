import type { PropsWithChildren } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid">
      <Header></Header>
      <SideNav></SideNav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
