"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Header from "./_components/Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem("user");
    setUserSession(session);

    if (!user && !session) {
      router.push(`/sign-in`);
    }
  }, [user, router]);

  if (!user && !userSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
