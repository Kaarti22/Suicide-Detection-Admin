"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  designation: string;
  emailAddress: string;
  phoneNumber: string;
  profileImage: string;
}

const Profile = () => {
  const params = useParams();
  const doctorId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await axios.get(`/api/doctors/${doctorId}`);
        setDoctor(doctorResponse.data);
      } catch (err) {
        console.error("Error fetching doctor's data: ", err);
        setError("Failed to fetch doctor's data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !doctorId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    try {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = uploadResponse.data.secure_url;
      console.log("Cloudinary upload successful. URL: ", imageUrl);

      await axios.patch(`/api/doctors/${doctorId}`, { profileImage: imageUrl });

      setDoctor((prevDoctor) =>
        prevDoctor ? { ...prevDoctor, profileImage: imageUrl } : null
      );
    } catch (err) {
      console.error("Error uploading image: ", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (!doctorId)
    return <p className="text-red-500">Error: Doctor ID not found</p>;
  if (loading) return <p>Loading doctor details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!doctor) return <p>No doctor data found.</p>;

  return (
    <div className="my-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Profile's settings</h2>
      <Separator />

      <div className="flex flex-col items-center gap-4">
        {doctor.profileImage && (
          <Image
            src={doctor.profileImage}
            alt="Profile Image"
            width={150}
            height={150}
            className="rounded-full border"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded-lg cursor-pointer"
        />

        {uploading && <p>Uploading...</p>}
      </div>
    </div>
  );
};

export default Profile;
