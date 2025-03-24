import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }, // Fake a browser request
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json({ error: "Proxy Server Error" }, { status: 500 });
  }
}
