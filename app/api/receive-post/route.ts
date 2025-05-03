import twilio from "twilio";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import axios from "axios";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
const client = twilio(accountSid, authToken);

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
  const patientData = patientDoc.data();

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
  } catch (error) {
    const err = error as Error;
    console.error("Error analyzing sentiment: ", err.message);
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

  if (finalSentiment && finalSentiment.toLowerCase() === "negative") {
    try {
      const assignedDoctorId = patientData.assignedDoctor;

      if (!assignedDoctorId) {
        console.error("No assigned doctor for patient");
      } else {
        const doctorDocSnap = await adminDb
          .collection("doctors")
          .doc(assignedDoctorId)
          .get();

        if (!doctorDocSnap.exists) {
          console.error("Assigned doctor not found in doctors collection");
        } else {
          const doctorData = doctorDocSnap.data();
          const doctorPhoneNumber = doctorData?.phoneNumber;

          if (!doctorPhoneNumber) {
            console.error("Doctor phone number missing");
          } else {
            await client.calls.create({
              url: `${process.env.WEBSITE_URL}/api/twiml?patientName=${encodeURIComponent(patientData.firstName)}&timestamp=${encodeURIComponent(new Date(timestamp).toLocaleString())}`,
              to: doctorPhoneNumber,
              from: twilioPhoneNumber,
            });            
          }
        }
      }
    } catch (callError) {
      const err = callError as Error;
      console.error("Error making call: ", err.message);
    }
  }

  return NextResponse.json({ message: "Post processed", finalSentiment });
}
