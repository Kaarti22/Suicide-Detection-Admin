import { db } from "@/app/firebase/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: patientId } = await context.params;

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }
    const q = query(
      collection(db, "postSentiments"),
      where("patientId", "==", patientId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(posts, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching posts: ", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
