import AuthHero from "@/components/auth/AuthHero";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen w-full flex gap-6 overflow-hidden p-8">
      <AuthHero />
      <div className="w-1/2 ">{children}</div>
    </div>
  );
};

export default Layout;
