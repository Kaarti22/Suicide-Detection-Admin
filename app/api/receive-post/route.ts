import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function runSentimentAnalysis(text: string): number {
  const score = Math.min(1, text.length / 300);
  return parseFloat(score.toFixed(2));
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("authorization");
  const validKey = `Bearer ${process.env.SOCIAL_MEDIA_API_KEY}`;

  if (apiKey !== validKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userHandle, content, postId, timestamp, imageUrl } = await req.json();

  if (!userHandle || !content || !postId || !timestamp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const patientSnap = await adminDb
    .collection("patients")
    .where("socialMediaHandle", "==", userHandle)
    .limit(1)
    .get();

  if (patientSnap.empty) {
    return NextResponse.json(
      { message: "User not monitored" },
      { status: 400 }
    );
  }

  const sentimentScore = runSentimentAnalysis(content);

  await adminDb.collection("postSentiments").add({
    userHandle,
    postId,
    content,
    sentimentScore,
    imageUrl,
    timestamp: new Date(timestamp),
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Post processed", sentimentScore });
}
