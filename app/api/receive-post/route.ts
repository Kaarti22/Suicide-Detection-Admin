import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import axios from "axios";

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

  const patientDoc = patientSnap.docs[0];
  const patientId = patientDoc.id;

  let textSentiment = null;
  let imageSentiment = null;
  let finalSentiment = null;

  try {
    const formData = new FormData();
    formData.append("text", content);

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    formData.append("image", buffer, {
      filename: "uploaded_image.jpg",
      contentType: "image/jpeg",
      knownLength: buffer.length,
    });

    const sentimentResponse = await axios.post(
      `${process.env.FASTAPI_SERVER_URL}/analyze/`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    textSentiment = sentimentResponse.data.text_sentiment;
    imageSentiment = sentimentResponse.data.image_sentiment;
    finalSentiment = sentimentResponse.data.final_sentiment;
  } catch (error: any) {
    console.error("Error analyzing sentiment: ", error.message);
  }

  await adminDb.collection("postSentiments").add({
    patientId,
    userHandle,
    postId,
    content,
    textSentiment,
    imageSentiment,
    finalSentiment,
    imageUrl,
    timestamp: new Date(timestamp),
  });

  return NextResponse.json({ message: "Post processed", finalSentiment });
}
