"use client";

import { auth } from "@/app/firebase/config";
import { useParams, useRouter } from "next/navigation";
import Header from "../_components/Header";

const UserDashboard = () => {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold">Welcome, User {userId}!</h1>
      <p className="text-gray-600 mt-2">This is your personalized dashboard.</p>
      <button
        onClick={() => {
          auth.signOut();
          sessionStorage.removeItem("user");
          router.push("/sign-in");
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default UserDashboard;
