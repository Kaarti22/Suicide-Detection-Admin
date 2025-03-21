"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDoctor, setUpdatedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await axios.get(`/api/doctors/${doctorId}`);
        setDoctor(doctorResponse.data);
        setUpdatedDoctor(doctorResponse.data);
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

      setUpdatedDoctor((prevDoctor) =>
        prevDoctor ? { ...prevDoctor, profileImage: imageUrl } : null
      );
    } catch (err) {
      console.error("Error uploading image: ", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedDoctor((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setUpdatedDoctor(doctor);
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!doctorId || !updatedDoctor) return;

    try {
      await axios.patch(`/api/doctors/${doctorId}`, updatedDoctor);
      setDoctor(updatedDoctor);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile: ", err);
      setError("Failed to save changes");
    }
  };

  if (!doctorId)
    return <p className="text-red-500">Error: Doctor ID not found</p>;
  if (loading) return <p>Loading doctor details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!doctor) return <p>No doctor data found.</p>;

  return (
    <div className="my-6 flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      <Separator />

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {updatedDoctor?.profileImage ? (
            <Image
              src={updatedDoctor.profileImage}
              alt="Profile Image"
              width={120}
              height={120}
              className="rounded-full border shadow-md"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Profile Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded-lg cursor-pointer w-full"
            disabled={!isEditing}
          />
          <span className="text-xs text-gray-500">Max 4MB, JPG/PNG/SVG</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "firstName",
          "lastName",
          "displayName",
          "designation",
          "phoneNumber",
          "emailAddress",
        ].map((field) => (
          <div key={field}>
            <label className="text-sm font-semibold capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <Input
              type={field === "emailAddress" ? "email" : "text"}
              name={field}
              value={updatedDoctor ? updatedDoctor[field as keyof Doctor] : ""}
              onChange={handleInputChange}
              className="border p-2 rounded-lg w-full"
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        {isEditing ? (
          <>
            <Button variant={"ghost"} onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>Save Changes</Button>
          </>
        ) : (
          <Button onClick={handleEditClick}>Edit Profile</Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
