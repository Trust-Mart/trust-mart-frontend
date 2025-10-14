"use client";
import { useRouter } from "next/navigation";
import React from "react";

type props = {
  setActiveView: React.Dispatch<React.SetStateAction<"options" | "signup">>;
};

const EmailSignup = ({ setActiveView }: props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 mt-6">
      <div
        onClick={() => setActiveView("options")}
        className="size-10 bg-grey-200 rounded cursor-pointer font-semibold flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>

      <form action="" className="mt-6 flex flex-col gap-4 w-[90%]">
        <div className="flex flex-col gap-1.5 relative">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-grey-800"
          >
            Email <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full border border-grey-500 rounded text-sm px-3 py-2.5 bg-transparent transition-all ease-linear duration-300 focus:outline-none focus:bg-primary/10"
          />
          <span className="absolute right-3 top-11 -translate-y-1/2">
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
          </span>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-grey-800"
          >
            Username <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="w-full border border-grey-500 rounded text-sm px-3 py-2.5 bg-transparent transition-all ease-linear duration-300 focus:outline-none focus:bg-primary/10"
          />
          <span className="absolute right-3 top-11 -translate-y-1/2">
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
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-grey-800"
          >
            Password <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="text"
            id="password"
            placeholder="Password"
            className="w-full border border-grey-500 rounded text-sm px-3 py-2.5 bg-transparent transition-all ease-linear duration-300 focus:outline-none focus:bg-primary/10"
          />
          <span className="absolute right-3 top-11 -translate-y-1/2">
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </span>
        </div>

        <button
          onClick={() => router.push("/verify")}
          type="button"
          className="bg-primary text-white px-4 rounded-md h-[45px]  font-medium flex gap-3 cursor-pointer items-center justify-center hover:bg-primary/80 transition-all ease-linear duration-300"
        >
          Continue{" "}
        </button>
      </form>
    </div>
  );
};

export default EmailSignup;
