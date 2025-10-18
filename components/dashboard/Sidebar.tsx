"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { clearAccessToken } from "@/services/auth/tokenProvider";
import {
  Home,
  Store,
  ShoppingBag,
  ShoppingCart,
  Settings,
  LogOut,
  CreditCard,
  Lock,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navs: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="size-4" /> },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: <Store className="size-4" />,
  },
  {
    label: "Purchases",
    href: "/purchases",
    icon: <ShoppingBag className="size-4" />,
  },
  {
    label: "My Store",
    href: "/store",
    icon: <ShoppingCart className="size-4" />,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: <CreditCard className="size-4" />,
  },
  {
    label: "Escrows",
    href: "/escrows",
    icon: <Lock className="size-4" />,
  },
];

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-[14px] transition-colors ${
        active ? "bg-white/10 text-white" : "text-grey-200 hover:bg-white/5"
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);

  function handleLogout() {
    clearAccessToken();
    clear();
    router.push("/login");
  }

  return (
    <aside className="hidden relative lg:block z-20 w-[218px] h-full max-h-full overflow-y-auto bg-[#040605] border-grey-400 px-4 py-5 transform-x-0 transition-transform duration-300 ease-in-out">
      <div className="flex items-center mb-8">
        <Image
          src="/images/logo-white.png"
          alt="logo"
          width={50}
          height={50}
          className="relative "
        />
        <p className="text-lg font-semibold pt-2 text-white">Trustmart</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[14px] text-grey-400">Menu</p>
        <nav className="mt-2 flex flex-col gap-1">
          {navs.map((n) => (
            <SidebarLink
              key={n.href}
              item={n}
              active={pathname?.startsWith(n.href) ?? false}
            />
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="relative h-[150px] w-full overflow-hidden rounded-xl mb-6">
          <Image
            src="https://www.myridima.com/imgs/headercurvebg.webp"
            alt="promote-seller"
            fill
            className="object-cover z-20"
            priority
          />
          <div className="absolute inset-0 bg-primary/50"></div>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div className="text-white text-[17px] leading-snug">
              Start Selling your products, Securely with Trustmart
            </div>
            <Link
              href="/store"
              className="self-start bg-white text-grey-900 text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-grey-100 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <SidebarLink
            item={{
              label: "Settings",
              href: "/settings",
              icon: <Settings className="size-4" />,
            }}
            active={pathname === "/settings"}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </div>

      <span className="absolute left-[47px] top-[200px] opacity-40 hidden">
        {/* Decorative star placeholder retained if needed */}
      </span>
    </aside>
  );
}
