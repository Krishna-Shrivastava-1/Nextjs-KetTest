// app/api/video/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' });

    // Set the correct Content-Type
    const contentType = 'application/vnd.apple.mpegurl'; // Or the correct type

    // Create a streaming response
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
  }
}