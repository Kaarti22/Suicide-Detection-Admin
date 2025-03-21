import { db } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await context.params;
    const docRef = doc(db, "doctors", doctorId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Doctor not found" });
    }
    return NextResponse.json(
      { id: docSnap.id, ...docSnap.data() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctor details: ", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await context.params;

    if (!doctorId) {
      console.error("Doctor ID is missing in request params.");
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    if (!updateData || Object.keys(updateData).length === 0) {
      console.error("Request body is empty");
      return NextResponse.json(
        { error: "Update data is required" },
        { status: 400 }
      );
    }

    const doctorRef = doc(db, "doctors", doctorId);
    await updateDoc(doctorRef, updateData);

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Firestore:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
