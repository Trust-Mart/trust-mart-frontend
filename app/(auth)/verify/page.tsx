"use client";
import OtpInput from "@/components/reusables/OtpInput";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/services/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/services/auth/tokenProvider";
import { useAuthStore } from "@/stores/authStore";
import usersApi from "@/services/api/usersApi";
import type { AuthUser } from "@/stores/authStore";

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ otp?: string; submit?: string }>({});

  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await authApi.verifyEmail({ email: emailParam, otp });
      console.log(res);
      const token = res.data.token;
      setAccessToken(token);
      setToken(token);
      const meResp = await usersApi.me();
      const apiUser = meResp.data.user;
      const userForStore: AuthUser = {
        id: apiUser.id,
        email: apiUser.email,
        username: apiUser.username ?? null,
        roles: apiUser.roles,
        walletAddress: apiUser.walletAddress ?? null,
        smartAccountAddress: apiUser.smartAccountAddress ?? null,
        smartAccountBalance: apiUser.smartAccountBalance ?? null,
      };
      setUser(userForStore);
      return true;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: () => {
      setErrors((prev) => ({
        ...prev,
        submit: "Verification failed. Check code and try again.",
      }));
    },
  });

  function validate(): boolean {
    const nextErrors: { otp?: string; submit?: string } = {};
    if (!emailParam)
      nextErrors.submit = "Missing email in link. Please sign up again.";
    if (!otp || otp.length !== 6) nextErrors.otp = "Enter 6-digit code";
    setErrors((prev) => ({ ...prev, ...nextErrors, submit: undefined }));
    return Object.keys(nextErrors).length === 0;
  }

  function handleVerify() {
    if (!validate()) return;
    mutate();
  }

  return (
    <div className="h-full flex flex-col justify-center mx-auto  max-w-[480px] ">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={80}
        height={80}
        className="relative -left-4"
      />
      <h1 className="text-[26px] font-bold tracking-tighter mb-1">
        Verify your email
      </h1>
      <p className="text-sm text-gray-500 w-[90%]">
        We've sent a verification code to your email. Please enter it below to
        verify your account.
      </p>

      <div className="mt-8 flex flex-col w-[85%]">
        <div className="mt-1 text-sm text-grey-700">
          {emailParam ? (
            <span>
              Code sent to <span className="font-medium">{emailParam}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col">
          <div className="flex">
            <OtpInput onChange={setOtp} />
          </div>
          {errors.otp ? (
            <span className="text-xs text-red-500 mt-2">{errors.otp}</span>
          ) : null}
        </div>

        {errors.submit ? (
          <div className="text-sm text-red-600 mt-4">{errors.submit}</div>
        ) : null}

        <button
          onClick={handleVerify}
          disabled={isPending}
          className="bg-primary text-white px-4 mt-6 rounded-md h-[45px] text-sm  font-medium flex gap-3 cursor-pointer items-center justify-center hover:bg-primary/80 transition-all ease-linear duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Verifying..." : "Verify"}
        </button>
      </div>

      <p className="text-[15px] text-grey-800 mt-6">
        Didn't receive the code?{" "}
        <Link
          href={`/verify?email=${encodeURIComponent(emailParam)}`}
          className="font-medium text-primary"
        >
          Resend code
        </Link>
      </p>
    </div>
  );
};

export default Verify;
