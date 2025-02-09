"use client";

import { useParams } from "next/navigation";
import React from "react";
import patients from "@/constants/patientCards.json";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

const PatientPage = () => {
  const params = useParams();
  const patientId = params.id;
  const patient = patients.find((p) => p.id === patientId);

  return (
    <div className="my-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Patient Details</h2>
      <Separator />
      <div className="p-6 flex items-center justify-between shadow-lg rounded-lg">
        <div className="flex items-center gap-4">
          <Image
            src={patient?.profileImage || ""}
            alt="Patient's profile image"
            width={70}
            height={100}
            className="rounded-lg shadow-sm"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-blue-400 text-sm">#{patient?.id}</p>
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
            {patient?.dateOfJoining}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5" />
            {patient?.address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
