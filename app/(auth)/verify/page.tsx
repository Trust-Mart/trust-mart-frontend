import OtpInput from "@/components/reusables/OtpInput";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Verify = () => {
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
        <div className=" flex">
          <OtpInput />
        </div>
        <button className="bg-primary text-white px-4 mt-6 rounded-md h-[45px] text-sm  font-medium flex gap-3 cursor-pointer items-center justify-center hover:bg-primary/80 transition-all ease-linear duration-300 ">
          Verify
        </button>
      </div>

      <p className="text-[15px] text-grey-800 mt-6">
        Didn't receive the code?{" "}
        <Link href="/verify" className="font-medium text-primary">
          Resend code
        </Link>
      </p>
    </div>
  );
};

export default Verify;
