import { db } from "@/app/firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

interface Patient {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  dateOfJoining: Timestamp;
  profileImage?: string;
  address: string;
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "patients"));

    const patients: Patient[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Patient),
    }));
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients: ", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
