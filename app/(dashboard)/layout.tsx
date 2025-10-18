import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";
import HeaderBar from "@/components/dashboard/HeaderBar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen w-full flex  overflow-hidden ">
      <Sidebar />

      <div className="grow h-full overflow-y-auto bg-white">
        <HeaderBar />
        <div className="h-full w-full pt-6 pb-10 px-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
