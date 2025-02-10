"use client";

import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [createUserWithEmailAndPassword, userCredential, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(email, password);
      if (!response?.user) {
        console.log("Email or password already exists. Check and try again.");
        return;
      }

      const userId = response.user.uid;
      const displayName = `${firstName} ${lastName}`;

      await updateProfile(response.user, { displayName });

      await setDoc(doc(db, "doctors", userId), {
        id: userId,
        profileImage: "",
        firstName,
        lastName,
        displayName,
        designation,
        phoneNumber,
        emailAddress: email,
      });

      sessionStorage.setItem("user", userId);

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setDesignation("");
      setPhoneNumber("");

      router.push(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96 flex flex-col gap-4 items-center">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>

        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Separator />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignUp} disabled={loading} className="w-full">
          {loading ? "Signing up..." : "Sign up"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        <Separator/>
        <p className="text-sm text-white">Already have an account? <Button size={"sm"} variant={"link"} onClick={() => router.push(`/sign-in`)}>Sign in</Button></p>
      </div>
    </div>
  );
};

export default SignUp;
