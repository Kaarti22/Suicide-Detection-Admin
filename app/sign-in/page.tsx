"use client";

import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword, userCredential, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(email, password);
      if (!response?.user) {
        console.log("Email or password is incorrect. Check and try again.");
      } else {
        const userId = response.user.uid;
        sessionStorage.setItem("user", userId);
        setEmail("");
        setPassword("");
        router.push(`/dashboard/${userId}`);
      }
    } catch (error) {
      console.error("Error signing in user", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 flex flex-col gap-4 items-center">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignIn} disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        <Separator />
        <p className="text-sm text-white">
          Don't have an account?{" "}
          <Button
            size={"sm"}
            variant={"link"}
            onClick={() => router.push(`/sign-up`)}
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
