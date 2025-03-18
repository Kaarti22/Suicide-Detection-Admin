"use client";

import React from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadImageProps {
  doctorId: string;
  currentImage?: string;
  onImageChange: (url: string) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({
  doctorId,
  currentImage,
  onImageChange,
}) => {
  const handleUpload = (result: any) => {
    console.log("uploaded");
    if (result.event !== "success") return;

    const imageUrl = result.info.secure_url;
    if (!imageUrl) {
      console.error("Image URL is undefined");
      return;
    }

    console.log("Uploaded Image URL:", imageUrl);
    onImageChange(imageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {currentImage ? (
        <Image src={currentImage} alt="Profile" height={32} width={32} />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <CldUploadWidget uploadPreset="suicide-detection" onUploadAdded={handleUpload}>
        {({ open }) => <Button onClick={() => open()}>Change Image</Button>}
      </CldUploadWidget>
    </div>
  );
};

export default UploadImage;
