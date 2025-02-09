"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Header from "../dashboard/_components/Header";

interface PatientsLayoutProps {
  children: ReactNode;
}

const PatientsLayout: React.FC<PatientsLayoutProps> = ({ children }) => {
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

  return (
    <div className="p-6">
      <Header />
      {children}
    </div>
  );
};

export default PatientsLayout;
