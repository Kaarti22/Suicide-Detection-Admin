"use client";

import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sendPasswordResetEmail } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [signInWithEmailAndPassword, , loading] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(email, password);
      if (!response?.user) {
        setMessage("Email or password is incorrect. Check and try again.");
        return;
      }

      if (!response.user.emailVerified) {
        setMessage("Please verify your email before signing in.");
        return;
      }

      const userId = response.user.uid;
      sessionStorage.setItem("user", userId);
      setEmail("");
      setPassword("");

      router.push(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Error signing in user: ", error);
      setMessage("Error signing in. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email", error);
      setMessage("Failed to send password reset email. Please try again.");
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
        {message && <p className="text-red-500 text-center mt-2">{message}</p>}
        <Button variant={"link"} size={"sm"} onClick={handleForgotPassword}>
          Forgot Password?
        </Button>

        {resetEmailSent && (
          <p className="text-green-500 mt-2 text-sm text-center">
            Check your email for reset instructions.
          </p>
        )}

        <Separator />
        <p className="text-sm text-white">
          Don&apos;t have an account?{" "}
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
