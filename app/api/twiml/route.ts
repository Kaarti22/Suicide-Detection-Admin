import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const patientName = url.searchParams.get("patientName") || "Patient";
  const timestamp = url.searchParams.get("timestamp") || "unknown time";

  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">
        Alert! Patient ${patientName} has posted negative content at ${timestamp}. Please check immediately.
      </Say>
    </Response>
  `;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "Content-type": "text/xml" },
  });
}
