import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen w-full flex  overflow-hidden bg-[rgba(226,227,229,0.48)]">
      <Sidebar />

      <div className="grow h-full overflow-y-auto bg-white">
        <div className="flex px-10 py-3 border-b border-grey-200 items-center justify-between sticky top-0 bg-white z-10">
          <div></div>

          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-4 py-2 text-sm rounded-xl">
              Become a seller
            </button>
            <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
            <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
          </div>
        </div>
        <div className="h-full w-full pt-6 pb-10 px-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
