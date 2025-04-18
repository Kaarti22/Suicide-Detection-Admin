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

interface Vital {
  id: string;
  patientId: string;
  bloodRate: number;
  SpO2: number;
  temperature: number;
  prediction: boolean;
  timestamp: Timestamp;
}

const PatientPage = () => {
  const params = useParams();
  const patientId = params.patientId;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const fetchPatientAndVitals = async () => {
      try {
        const patientResponse = await axios.get(`/api/patients/${patientId}`);
        setPatient(patientResponse.data);

        const vitalsResponse = await axios.get(
          `/api/patients/${patientId}/vitals`
        );
        setVitals(vitalsResponse.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch patient or vitals data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientAndVitals();
  }, [patientId]);

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
            src={patient?.profileImage || "/patient.png"}
            alt="Patient's profile image"
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
        <TabsContent value="vitals">
          <DataTable vitals={vitals} />
        </TabsContent>
        <TabsContent value="social">
          <p className="text-gray-500">Social Media analysis will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPage;
