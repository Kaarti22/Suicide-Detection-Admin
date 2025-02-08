"use client";

import { useParams, useRouter } from "next/navigation";
import DateRangePicker from "../_components/DateRangePicker";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import patientCards from "@/constants/patientCards.json";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

const UserDashboard = () => {
  const params = useParams();
  const userId = params.id;
  const router = useRouter();

  return (
    <div className="my-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Patients</h2>
        <div className="flex items-center justify-between">
          <Input type="search" placeholder="Search..." className="w-[35%]" />
          <DateRangePicker />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {patientCards.map((patient) => (
          <Card key={patient.id} className="p-6 shadow-lg cursor-pointer" onClick={() => router.push(`/dashboard/${userId}/patients/${patient.id}`)}>
            <CardContent className="px-0">
              <div className="flex items-center gap-4">
                <Image
                  src={patient.profileImage}
                  alt="patient profile image"
                  width={70}
                  height={100}
                  className="rounded-lg shadow-sm"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-blue-400 text-sm">#{patient.id}</p>
                  <h2 className="font-semibold">{patient.name}</h2>
                  <div className="flex h-5 items-center space-x-2 text-sm">
                    <div>Age: {patient.age}</div>
                    <Separator orientation="vertical" />
                    <div>{patient.gender}</div>
                    <Separator orientation="vertical" />
                    <div>{patient.bloodGroup}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-blue-100 rounded-3xl">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock />
                  {patient.dateOfJoining}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin />
                  {patient.address}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
