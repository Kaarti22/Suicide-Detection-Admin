"use client";

import { useRouter } from "next/navigation";
import DateRangePicker from "../_components/DateRangePicker";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { DateRange } from "react-day-picker";

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

const UserDashboard = () => {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("/api/patients")
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load patients data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filter patients based on date range and search query
  const filteredPatients = patients.filter((patient) => {
    const matchesDateRange =
      !dateRange?.from ||
      !dateRange?.to ||
      (new Date(patient.dateOfJoining.seconds * 1000) >= dateRange.from &&
        new Date(patient.dateOfJoining.seconds * 1000) <= dateRange.to);

    const matchesSearchQuery = patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesDateRange && matchesSearchQuery;
  });

  return (
    <div className="my-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Patients</h2>
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search..."
            className="w-[35%]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="p-6 shadow-lg cursor-pointer"
            onClick={() => {
              router.push(`/patients/${patient.id}`);
            }}
          >
            <CardContent className="px-0">
              <div className="flex items-center gap-4">
                <Image
                  src={patient.profileImage || "/patient.png"}
                  alt="patient profile image"
                  width={70}
                  height={100}
                  className="rounded-lg shadow-sm"
                />
                <div className="flex flex-col gap-0.5">
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
                  <CalendarDays className="w-5" />
                  {new Date(
                    patient.dateOfJoining.seconds * 1000
                  ).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5" />
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
