"use client";
import EmailSignup from "@/components/auth/EmailSignup";
import GoogleAuthIcon from "@/components/icons/GoogleIcon";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Signup = () => {
  const [activeView, setActiveView] = useState<"options" | "signup">("options");
  return (
    <div className="h-full flex flex-col justify-center mx-auto  max-w-[500px] ">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={80}
        height={80}
        className="relative -left-4"
      />
      <h1 className="text-[26px] font-bold tracking-tighter mb-1">
        Create an account
      </h1>
      <p className="text-sm text-gray-500">
        Create. Verify. Buy. Sell with confidence, all in one place.
      </p>
      {activeView === "options" && (
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={() => setActiveView("signup")}
            className="bg-primary text-white px-4 rounded-md h-[45px]  font-medium flex gap-3 cursor-pointer items-center justify-center hover:bg-primary/80 transition-all ease-linear duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            Continue with Email{" "}
          </button>

          <button className="h-[43px] cursor-pointer w-full flex gap-2 items-center justify-center border border-grey-500 font-medium text-grey-800 rounded-md hover:bg-grey-300 hover:text-primary transition-all ease-linear duration-300">
            <GoogleAuthIcon />
            Continue with Google
          </button>
          <button className="h-[43px] cursor-pointer w-full flex gap-2 items-center justify-center border border-grey-500 font-medium text-grey-800 rounded-md hover:bg-grey-300 hover:text-primary transition-all ease-linear duration-300">
            <Image
              src="/images/apple.png"
              alt="Apple"
              width={20}
              height={20}
              className="object-cover"
            />
            Continue with Apple
          </button>
        </div>
      )}

      {activeView === "signup" && <EmailSignup setActiveView={setActiveView} />}
      <p className="text-sm mt-6 text-grey-800">
        Already registered on trustmart?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
