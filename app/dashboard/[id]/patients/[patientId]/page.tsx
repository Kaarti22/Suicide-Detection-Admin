"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import axios from "axios";
import { Timestamp } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "./_components/DataTable";
import { Vital } from "@/lib/types";

interface Patient {
  address: string;
  age: number;
  assignedDoctor: string;
  bloodGroup: string;
  bgHigh: boolean;
  bgLow: boolean;
  dateOfJoining: Timestamp;
  email: string;
  firstName: string;
  gender: string;
  height: number;
  id: string;
  lastName: string;
  mobileNumber: string;
  profileImage: string;
  socialMediaHandle: string;
  sugar: boolean;
  weight: number;
}

interface PostAPIResponse {
  id: string;
  patientId: string;
  postId: string;
  content: string;
  imageUrl: string;
  textSentiment: {
    label: string;
    score: number;
  };
  imageSentiment: {
    final_image_sentiment: string;
    image_sentiment: { label: string; score: number }[];
  };
  finalSentiment: string;
  userHandle: string;
  timestamp: Timestamp;
}

interface PostForTable {
  id: string;
  patientId: string;
  postId: string;
  content: string;
  imageUrl: string;
  textSentiment: string;
  imageSentiment: string;
  finalSentiment: string;
  userHandle: string;
  timestamp: Timestamp;
}

import { vitalColumns, postColumns } from "./_components/columns";
import VitalLineChart from "./_components/VitalLineChart";

const PatientPage = () => {
  const params = useParams();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [posts, setPosts] = useState<PostForTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientData = async () => {
      try {
        const patientResponse = await axios.get(`/api/patients/${patientId}`);
        setPatient(patientResponse.data);

        const vitalsResponse = await axios.get(
          `/api/patients/${patientId}/vitals`
        );
        setVitals(vitalsResponse.data);

        const postsResponse = await axios.get(
          `/api/patients/${patientId}/posts`
        );
        const postsData: PostAPIResponse[] = postsResponse.data;

        const formattedPosts: PostForTable[] = postsData.map((post) => ({
          id: post.id,
          patientId: post.patientId,
          postId: post.postId,
          content: post.content,
          imageUrl: post.imageUrl,
          textSentiment: post.textSentiment.label,
          imageSentiment: post.imageSentiment.final_image_sentiment,
          finalSentiment: post.finalSentiment,
          userHandle: post.userHandle,
          timestamp: post.timestamp,
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to fetch patient details");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  console.log(vitals);

  if (loading) return <p>Loading patient details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!patient) return <p>No patient data found.</p>;

  return (
    <div className="my-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Patient Details</h2>
      <Separator />
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between shadow-lg rounded-lg bg-white gap-6">
        <div className="flex items-center gap-4">
          <Image
            src={patient.profileImage || "/patient.png"}
            alt="Patient Profile Image"
            width={100}
            height={100}
            className="rounded-xl shadow-md object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-gray-500 text-sm">
              {patient.gender}, {patient.age} years
            </p>
            <p className="text-gray-500 text-sm">
              Blood Group: {patient.bloodGroup}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span>
              Joined:{" "}
              {new Date(patient.dateOfJoining.seconds * 1000).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            <span>{patient.address}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2 text-lg">Health Info</h3>
          <p>Sugar: {patient.sugar ? "Yes" : "No"}</p>
          <p>BP High: {patient.bgHigh ? "Yes" : "No"}</p>
          <p>BP Low: {patient.bgLow ? "Yes" : "No"}</p>
          <p>Height: {patient.height} cm</p>
          <p>Weight: {patient.weight} kg</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2 text-lg">Contact Info</h3>
          <p>Email: {patient.email}</p>
          <p>Mobile: {patient.mobileNumber}</p>
          <p>Social Handle: @{patient.socialMediaHandle || "N/A"}</p>
        </div>
      </div>

      <Tabs defaultValue="vitals" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vitals">Vitals Data</TabsTrigger>
          <TabsTrigger value="social">Social Media Data</TabsTrigger>
        </TabsList>
        <TabsContent value="vitals" className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Temperature over time
              </h3>
              <VitalLineChart
                data={vitals}
                dataKey="temperature"
                color="#f97316"
                unit="°C"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Heart Rate Over Time
              </h3>
              <VitalLineChart
                data={vitals}
                dataKey="heartRate"
                color="#3b82f6"
                unit="bpm"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">SpO₂ Over Time</h3>
              <VitalLineChart
                data={vitals}
                dataKey="SpO2"
                color="#10b981"
                unit="%"
              />
            </div>
          </div>
          <DataTable data={vitals} columns={vitalColumns} />
        </TabsContent>
        <TabsContent value="social">
          <DataTable data={posts} columns={postColumns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPage;
