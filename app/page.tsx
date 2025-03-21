"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem("user");
    setUserSession(session);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      router.push(`/dashboard/${user.uid}`);
    } else if (userSession) {
      router.push(`/dashboard/${userSession}`);
    } else {
      router.push(`/sign-in`);
    }
  }, [user, userSession, router]);

  return <div>Loading...</div>;
};

export default page;
