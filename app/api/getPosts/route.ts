import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/posts/";
const SECRET_API_KEY = "your_secret_api_key_here";

export async function GET() {
  try {
    const response = await axios.get(API_URL, {
      headers: { "api-key": SECRET_API_KEY },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  }
}
