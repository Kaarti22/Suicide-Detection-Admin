"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getAuth, signOut } from "firebase/auth";
import { BellRing } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const auth = getAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      router.push(`/sign-in`);
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="Logo" width={120} height={50} />
      </Link>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="flex items-center gap-5">
        <BellRing className="cursor-pointer" />
        <Popover>
          <PopoverTrigger>
            <Image
              src={"/profileIcon.png"}
              alt="Profile Icon"
              height={30}
              width={30}
              className="rounded-full cursor-pointer shadow-md"
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto flex flex-col justify-center gap-2">
            <Button
              variant={"ghost"}
              onClick={() => router.push(`/dashboard/${id}/profile`)}
            >
              Profile settings
            </Button>
            <Separator />
            <Button variant={"destructive"} onClick={handleLogout}>
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
