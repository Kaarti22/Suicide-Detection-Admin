"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import axios from "axios";
import { Timestamp } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "./_components/DataTable";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  dateOfJoining: Timestamp;
  profileImage?: string;
  address: string;
}

interface Vital {
  id: string;
  patientId: string;
  bloodRate: number;
  SpO2: number;
  temperature: number;
  prediction: boolean;
  timestamp: Timestamp;
};

const PatientPage = () => {
  const router = useRouter();
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
        const patientResponse = await axios.get(`/api/patients/${patientId}`)
        setPatient(patientResponse.data);

        const vitalsResponse = await axios.get(`/api/patients/${patientId}/vitals`);
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
  if(error) return <p className="text-red-500">{error}</p>
  if(!patient) return <p>No patient data found.</p>

  return (
    <div className="my-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Patient Details</h2>
      <Separator />
      <div className="p-6 flex items-center justify-between shadow-lg rounded-lg">
        <div className="flex items-center gap-4">
          <Image
            src={patient?.profileImage || "/patient.png"}
            alt="Patient's profile image"
            width={70}
            height={100}
            className="rounded-lg shadow-sm"
          />
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold">{patient?.name}</h2>
            <div className="flex h-5 items-center space-x-2 text-sm">
              <div>Age: {patient?.age}</div>
              <Separator orientation="vertical" />
              <div>{patient?.gender}</div>
              <Separator orientation="vertical" />
              <div>{patient?.bloodGroup}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5" />
            {new Date(patient.dateOfJoining.seconds * 1000).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5" />
            {patient?.address}
          </div>
        </div>
      </div>
      <Tabs defaultValue="vitals" className="w-auto">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vitals">Vitals Data</TabsTrigger>
            <TabsTrigger value="social">Social Media Data</TabsTrigger>
        </TabsList>
        <TabsContent value="vitals">
            <DataTable vitals={vitals}/>
        </TabsContent>
        <TabsContent value="social">
            
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPage;
