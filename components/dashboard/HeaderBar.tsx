"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function HeaderBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const pageTitle = React.useMemo(() => {
    if (!pathname) return "";
    const seg = pathname.split("/").filter(Boolean)[0] || "dashboard";
    if (seg === "dashboard") return "Dashboard";
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  }, [pathname]);

  const reputation = 200; 

  return (
    <div className="flex px-10 py-3 border-b border-grey-200 items-center justify-between sticky top-0 bg-white z-10">
      <div className="text-[18px] text-grey-700 font-medium">{pageTitle}</div>

        <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-grey-300 text-sm">
          {/* <ShieldCheck className="size-4 text-green-600" /> */}
          {/* <span className="font-medium">Reputation score</span> */}
          {/* <span className="text-grey-700">{reputation}</span>
          <span aria-label="fire" role="img">🔥</span> */}
        </div>
        <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
        <div className="size-10 bg-grey-200 rounded-full flex items-center justify-center"></div>
      </div>
    </div>
  );
}


