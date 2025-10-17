import StarIcon from "@/components/icons/StarIcon";
import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen w-full flex  overflow-hidden bg-[rgba(226,227,229,0.48)]">
      <aside className="hidden relative lg:block z-20 w-[218px] h-full max-h-full overflow-y-auto border-grey-400 px-4 py-5 transform-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex items-center mb-8">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="relative "
          />

          <p className="text-lg font-semibold pt-2">Trustmart</p>

        </div>

        <div className="flex flex-col gap-2"> 
          <p className="text-sm text-grey-500">Menu</p>
        </div>
        <span className="absolute left-[47px] top-[200px] opacity-40">
          {" "}
          <StarIcon />
        </span>
      </aside>

      <div className="grow h-full overflow-y-auto bg-white">
        <div className="flex px-10 py-4 border-b border-grey-200 items-center justify-between">
          <div></div>

          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-4 py-2 text-sm rounded-xl">
              Become a seller
            </button>
            <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
            <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
          </div>
        </div>
        <div className="h-full w-full py-6 px-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
