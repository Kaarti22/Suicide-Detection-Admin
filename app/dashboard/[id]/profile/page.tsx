"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import UploadImage from "./_components/UploadImage";

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

  const handleImageChange = async (newImageUrl: string) => {
    if (!doctor) return;

    try {
      console.log("Updating database with image:", newImageUrl);

      const response = await axios.patch(`/api/doctors/${doctorId}`, {
        profileImage: newImageUrl,
      });

      console.log("Database update response:", response.data);

      setDoctor((prevDoctor) =>
        prevDoctor ? { ...prevDoctor, profileImage: newImageUrl } : null
      );
    } catch (err) {
      console.error("Error updating profile image: ", err);
      setError("Failed to update profile image");
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

      <UploadImage
        doctorId={doctorId}
        currentImage={doctor.profileImage}
        onImageChange={handleImageChange}
      />
    </div>
  );
};

export default Profile;
