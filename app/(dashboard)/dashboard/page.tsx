"use client";
import DashboardOverviewCard from "@/components/dashboard/overview/DashboardOverviewCard";
import Image from "next/image";
import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { Copy, Wallet, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import usersApi from "@/services/api/usersApi";
// Facebook SDK will be loaded dynamically

// Add Facebook SDK types
declare global {
  interface Window {
    FB: any;
  }
}

const Dashbaord = () => {
  const user = useAuthStore((s) => s.user);
  const { data: meData, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["meUser"],
    queryFn: () => usersApi.me(),
  });
  const apiUser = meData?.data.user;
  const balanceValueRaw = (apiUser as any)?.smartAccountBalance ?? (apiUser as any)?.walletBalance ?? 0;
  const balanceValue = typeof balanceValueRaw === "number" ? balanceValueRaw : Number(balanceValueRaw || 0);
  const displayName = user?.username || user?.email || "there";
  const maskAddress = (addr?: string | null) => {
    if (!addr) return "—";
    const trimmed = addr.trim();
    if (trimmed.length <= 12) return trimmed;
    return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`;
  };
  return (
    <div className="bg-white h-full w-full">
      <div className="flex">
        <div>
          <p className="text-xs text-grey-500">Thursday, October 16th</p>
          <p className="text-[22px] font-semibold">Hello, {displayName} 👋</p>
        </div>
      </div>
      <div className="flex gap-8 mt-6">
        <div className=" border border-grey-300 shadow-xs rounded-2xl w-[50%] p-6 flex gap-2 items-center">
          <div className="flex w-full flex-col gap-1">
            <p className="text-sm text-grey-500 font-medium">Total Balance</p>
            <div className="flex items-center justify-between w-full">
              {isBalanceLoading ? (
                <div className="h-6 w-28 bg-grey-200 rounded animate-pulse" />
              ) : (
              <p className="text-[25px] font-bold ">
                  <span className="font-sans">$</span>{balanceValue.toFixed(2)}
              </p>
              )}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer text-grey-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-grey-800 text-sm">
              <span className="size-6 rounded-full bg-grey-200 relative overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dlbjdsad5/image/upload/v1713775722/profileDocument/uibrnc90c2ibezmsgc2n.jpg"
                  alt="naira"
                  fill
                  className="object-contain"
                />
              </span>
              <p>250,000</p>
            </div>
          </div>
        </div>
        <div className=" w-[50%] bg-black overflow-hidden rounded-2xl relative flex flex-col py-6 px-6">
          {/* <div className="absolute left-0 -top-8  h-full opacity-50">
            <Image src="https://cdn.prod.website-files.com/6591aa504d6df02a5fe93341/668442ab1461922beef8b839_Clip%20path%20group.svg" alt="dashboard-bg" height={100} width={100} className="object-cover" />
          </div> */}
          <div className="">
            <h2 className="text-[16px] font-bold text-white leading-tight mb-4">
              How we use AI Powered vetting <br />
              and blockchain payments
              <br /> for safer trades
            </h2>
            <span className="px-6 py-2 bg-white text-black rounded-full text-xs font-medium">
              Learn more
            </span>
          </div>
          <div className="absolute right-0 -bottom-1 opacity-50 ">
            <Image
              src="https://cdn.prod.website-files.com/6591aa504d6df02a5fe93341/668442ab1461922beef8b839_Clip%20path%20group.svg"
              alt="dashboard-bg"
              height={150}
              width={150}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8 mt-8 h-auto">
        <div className="w-1/2 grid grid-cols-2 gap-4">
        <DashboardOverviewCard
          title="Active escrow"
          amount="600.50"
          percent={10}
          bgStyle="bg-[#E6F2F1]"
        />
        <DashboardOverviewCard
          title="Active escrow"
          amount="600.50"
          percent={10}
          bgStyle="bg-[#DDF7FF]"
        />
        <DashboardOverviewCard
          title="Active escrow"
          amount="600.50"
          percent={10}
          bgStyle="bg-[#D8FFE3]"
        />
        <DashboardOverviewCard
          title="Active escrow"
          amount="600.50"
          percent={10}
          bgStyle="bg-[#F9FFE3]"
        />
        </div>
        <div className="w-1/2  bg-white rounded-xl shadow-xs border border-grey-300 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-grey-800 flex items-center gap-2">
                Account Info
              </p>
              {/* <p className="text-sm text-grey-600 mt-1">
                Quick overview of your account
              </p> */}
            </div>
            <button
              onClick={() => toast.info("Opening full details soon")}
              className="text-xs px-3 py-1.5 rounded-md border border-grey-300 hover:bg-grey-100 transition-colors flex items-center gap-1"
            >
              <Info className="size-3" /> View details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] uppercase tracking-wide text-grey-500">
                Smart Wallet
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium break-all max-w-[220px]">
                  {maskAddress(user?.smartAccountAddress)}
                </span>
                {user?.smartAccountAddress ? (
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        user.smartAccountAddress as string
                      );
                      toast.success("Address copied");
                    }}
                    className="p-1 rounded hover:bg-grey-100"
                    aria-label="Copy smart wallet address"
                  >
                    <Copy className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[12px] uppercase tracking-wide text-grey-500">
                Reputation
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">200</span>
                <ShieldCheck className="size-4 text-green-600" />
              </div>
            </div>
            </div>

            <div className="col-span-2 mt-4">
              <span className="text-[12px] uppercase tracking-wide text-grey-500">Social accounts</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { name: "Instagram", icon: "https://cdn.pixabay.com/photo/2021/06/15/12/14/instagram-6338393_1280.png" },
                  { name: "X (Twitter)", icon: "https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000" },
                  { name: "Facebook", icon: "https://img.icons8.com/?size=100&id=13912&format=png&color=000000" },
                ].map((item) => (
                  <div key={item.name} className="flex gap-3 items-center justify-between border border-grey-300 rounded-lg p-2 bg-white">
                    <div className="flex items-center gap-2">
                      <span className="relative size-6 overflow-hidden rounded">
                        <Image src={item.icon} alt={item.name} fill className="object-contain" />
                      </span>
                      <span className="text-sm text-grey-800">{item.name}</span>
                    </div>
                    {item.name === "Facebook" ? (
                      <button
                        onClick={async () => {
                          try {
                            if (!window.FB) {
                              await new Promise((resolve) => {
                                const script = document.createElement('script');
                                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                                script.onload = () => {
                                  window.FB.init({
                                    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                                    cookie: true,
                                    xfbml: true,
                                    version: 'v18.0'
                                  });
                                  resolve(true);
                                };
                                document.head.appendChild(script);
                              });
                            }

                            window.FB.login((response: any) => {
                              console.log('Full Facebook response:', response);
                              console.log('Auth response:', response.authResponse);
                              
                              if (response.authResponse) {
                                window.FB.api('/me', { fields: 'id,name,picture' }, (userInfo: any) => {
                                  console.log('User profile info:', userInfo);
                                  
                                  fetch('/api/connect/facebook', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      accessToken: response.authResponse.accessToken,
                                      userID: response.authResponse.userID,
                                      userInfo: userInfo
                                    })
                                  }).then(() => {
                                    toast.success('Facebook connected!');
                                  }).catch(() => {
                                    toast.error('Failed to save connection');
                                  });
                                });
                              } else {
                                toast.error('Facebook login cancelled');
                              }
                            }, { scope: 'public_profile' });
                          } catch (e: any) {
                            toast.error(e?.message || "Failed to connect Facebook");
                          }
                        }}
                        className="text-xs px-2 py-1 rounded-full border border-grey-300 hover:bg-grey-100"
                      >
                        Connect
                      </button>
                    ) : item.name === "Instagram" ? (
                      <button
                        onClick={async () => {
                          try {
                            console.log("Instagram connect clicked");
                            // Instagram OAuth - direct Instagram API
                            const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
                            const redirectUri = `${window.location.origin}/oauth/instagram/callback`;
                            const scope = 'instagram_basic';
                            
                            console.log("Instagram Client ID:", clientId);
                            console.log("Redirect URI:", redirectUri);
                            console.log("Scope:", scope);
                            
                            if (!clientId) {
                              toast.error("Instagram App ID not configured");
                              return;
                            }

                           
                            
                            // Use Instagram OAuth endpoint with proper parameters
                            const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=instagram_connect`;
                            
                            console.log("Full Auth URL:", authUrl);
                            window.open(authUrl, '_blank');
                          } catch (e: any) {
                            console.error("Instagram connect error:", e);
                            toast.error(e?.message || "Failed to connect Instagram");
                          }
                        }}
                        className="text-xs px-2 cursor-pointer  py-1 rounded-full border border-grey-300 hover:bg-grey-100"
                      >
                        Connect
                      </button>
                    ) : (
                      <button className="text-xs px-2 py-1 rounded-full border border-grey-300 hover:bg-grey-100">Connect</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text font-semibold "> Top Vendors (Trust Score)</p>

          <p className="text-sm text-primary flex items-center gap-2">
            View all
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </p>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-4 mb-8">
          {[
            { name: "Nana's Kitchen", img: "/images/Img1.jpg", score: 92 },
            { name: "Lagos Gadget Hub", img: "/images/Img2.png", score: 87 },
            { name: "Abuja Fashion Co.", img: "/images/Img3.jpg", score: 90 },
            { name: "Port Harcourt Mart", img: "/images/logo2.png", score: 85 },
          ].map((v) => (
            <div key={v.name} className="border border-grey-300 rounded-xl overflow-hidden bg-white group">
              <div className="relative h-[160px]">
                <Image
                  src={v.img}
                  alt={v.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur">
                  {v.score}% Trust
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-grey-900 truncate">{v.name}</p>
                <p className="text-xs text-grey-600 mt-0.5">Nigeria</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashbaord;
