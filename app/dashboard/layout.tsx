"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");

  useEffect(() => {
    if (!user && !userSession) {
      router.push(`/sign-in`);
    }
  }, [user, userSession, router]);

  if (!user && !userSession) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
