import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const docRef = doc(db, "patients", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(
      { id: docSnap.id, ...docSnap.data() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patient details: ", error);
    return NextResponse.json(
      { error: "Failed to fetch patient details" },
      { status: 500 }
    );
  }
}
