"use client";
import GoogleAuthIcon from "@/components/icons/GoogleIcon";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/services/api/authApi";
import { setAccessToken } from "@/services/auth/tokenProvider";
import { useAuthStore } from "@/stores/authStore";
import usersApi from "@/services/api/usersApi";
import { useRouter } from "next/navigation";
import type { HttpError } from "@/services/http/httpClient";

const Login = () => {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [formValues, setFormValues] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; submit?: string }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await authApi.login({ identifier: formValues.identifier, password: formValues.password });
      const token = res.data.token;
      setAccessToken(token);
      setToken(token);
      const loginUser = res.data.user;
      setUser({
        id: loginUser.id,
        email: loginUser.email,
        username: loginUser.username,
        roles: loginUser.roles,
        walletAddress: null,
        smartAccountAddress: loginUser.smartAccountAddress ?? null,
        smartAccountBalance: loginUser.smartAccountBalance ?? null,
      });
      // fetch full details
      try {
        const me = await usersApi.me();
        const u = me.data.user;
        setUser({
          id: u.id,
          email: u.email,
          username: u.username ?? null,
          roles: u.roles,
          walletAddress: u.walletAddress ?? null,
          smartAccountAddress: u.smartAccountAddress ?? null,
          smartAccountBalance: u.smartAccountBalance ?? null,
        });
      } catch {}
      return true;
    },
    onSuccess: () => router.push("/dashboard"),
    onError: (error: unknown) => {
      const err = (error as HttpError) || ({} as HttpError);
      const data = (err.data as any) || {};
      const fieldErrors = data.errors || {};
      const identifierMsg = fieldErrors.identifier || fieldErrors.email;
      const passwordMsg = fieldErrors.password;
      setErrors((prev) => ({
        ...prev,
        identifier: identifierMsg ?? prev.identifier,
        password: passwordMsg ?? prev.password,
        submit: !identifierMsg && !passwordMsg ? (err.message || "Request failed") : undefined,
      }));
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  }

  function validate(): boolean {
    const next: { identifier?: string; password?: string } = {};
    if (!formValues.identifier) next.identifier = "Email or username is required";
    if (!formValues.password) next.password = "Password is required";
    setErrors((prev) => ({ ...prev, ...next, submit: undefined }));
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    mutate();
  }

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
        Welcome Back,
      </h1>
      <p className="text-sm text-gray-500">
        Sign in to your account to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 w-[90%]">
        <div className="flex flex-col gap-1.5 relative">
          <label
            htmlFor="identifier"
            className="text-sm font-semibold text-grey-800"
          >
            Email or Username <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="text"
            id="identifier"
            placeholder="Email or Username"
            value={formValues.identifier}
            onChange={handleChange}
            autoComplete="username"
            className="w-full border border-grey-500 rounded text-sm px-3 py-2.5 bg-transparent transition-all ease-linear duration-300 focus:outline-none focus:bg-primary/10"
          />
          {errors.identifier ? (
            <span className="text-xs text-red-500 mt-1">{errors.identifier}</span>
          ) : null}
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

        <div className="">
          <div className="flex flex-col gap-1.5 relative">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-grey-800"
            >
              Password <span className="text-red-500">*</span>{" "}
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full border border-grey-500 rounded text-sm px-3 py-2.5 bg-transparent transition-all ease-linear duration-300 focus:outline-none focus:bg-primary/10"
            />
            {errors.password ? (
              <span className="text-xs text-red-500 mt-1">{errors.password}</span>
            ) : null}
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

          <p className="text-sm text-primary mt-2 flex justify-end">
            Forgot password?
          </p>
        </div>

        {errors.submit ? (
          <div className="text-sm text-red-600">{errors.submit}</div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white px-4 mt-2 rounded-md h-[45px]  font-medium flex gap-3 cursor-pointer items-center justify-center hover:bg-primary/80 transition-all ease-linear duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Continue"}
        </button>
      </form>

      <div className="w-[90%] flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-grey-300"></span>
        <span className="text-xs uppercase tracking-wide text-grey-600">
          or
        </span>
        <span className="h-px flex-1 bg-grey-300"></span>
      </div>

      <div className="flex flex-col gap-3 w-[90%]">
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
        <p className="text-[15px] text-grey-800 mt-3">
        New to trustmart?{" "}
        <Link href="/signup" className="font-medium text-primary">
          Create an account
        </Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
