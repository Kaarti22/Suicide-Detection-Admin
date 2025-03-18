import { db } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = params.id;
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
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received PATCH request for doctor ID:", params.id);

    const { profileImage } = await req.json();
    if (!profileImage) {
      console.error("Profile image is missing in request body");
      return NextResponse.json(
        { error: "Profile image is required" },
        { status: 400 }
      );
    }

    console.log("Updating Firestore with image:", profileImage);

    const doctorRef = doc(db, "doctors", params.id);
    await updateDoc(doctorRef, { profileImage });

    console.log("Profile image updated successfully in Firestore");

    return NextResponse.json(
      { message: "Profile image updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to update Firestore:", error);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
}
