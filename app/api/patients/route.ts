import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, "patients"));

        const patients: any[] = [];
        querySnapshot.forEach((doc) => {
            patients.push({id: doc.id, ...doc.data()});
        });
        return NextResponse.json(patients, {status: 200});
    } catch (error) {
        console.error("Error fetching patients: ", error);
        return NextResponse.json({error: "Failed to fetch patients"}, {status: 500});
    }
}