import { BellRing } from "lucide-react";
import Image from "next/image";
import React from "react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between">
      <a href="/">
        <Image src={"/logo.png"} alt="Logo" width={120} height={50} />
      </a>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="flex items-center gap-5">
        <BellRing className="cursor-pointer" />
        <Image
          src={"/profileIcon.png"}
          alt="Profile Icon"
          height={30}
          width={30}
          className="rounded-full cursor-pointer shadow-md"
        />
      </div>
    </div>
  );
};

export default Header;
