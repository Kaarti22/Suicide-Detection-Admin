"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Verify Your Email</h1>
      <p className="mb-4 text-center">
        A verification email has been sent to your inbox. Please verify your
        email before logging in.
      </p>
      <Button onClick={() => router.push(`/sign-in`)}>Go to Sign In</Button>
    </div>
  );
};

export default VerifyEmail;
