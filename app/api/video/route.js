// app/api/video/route.js
// import axios from 'axios';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get('url');

//   if (!url) {
//     return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
//   }

//   try {
//     const response = await axios.get(url, { responseType: 'stream' });

//     // Set the correct Content-Type
//     const contentType = 'application/vnd.apple.mpegurl'; // Or the correct type

//     // Create a streaming response
//     return new NextResponse(response.data, {
//       status: 200,
//       headers: {
//         'Content-Type': contentType,
//       },
//     });
//   } catch (error) {
//     console.error('API error:', error);
//     return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
  // }
// }



// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const videoUrl = searchParams.get('url'); // Get external video URL

//   if (!videoUrl) {
//     return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
//   }

//   try {
//     // Fetch video stream from external source with range support
//     const response = await fetch(videoUrl, {
//       headers: {
//         'Range': req.headers.get('Range') || 'bytes=0-', // Forward Range header for streaming
//       },
//     });

//     if (!response.ok) throw new Error(`Failed to fetch video: ${response.status}`);

//     // Forward streaming response to client
//     return new NextResponse(response.body, {
//       status: response.status,
//       headers: {
//         'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
//         'Content-Length': response.headers.get('Content-Length'),
//         'Content-Range': response.headers.get('Content-Range'),
//         'Accept-Ranges': 'bytes',
//       },
//     });
//   } catch (error) {
//     console.error('Error streaming video:', error);
//     return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
        return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'Range': req.headers.get('Range') || 'bytes=0-',
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch video: ${response.status}`);

        // Stream directly using NextResponse's ReadableStream
        return new NextResponse(response.body, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
                'Content-Length': response.headers.get('Content-Length'),
                'Content-Range': response.headers.get('Content-Range'),
                'Accept-Ranges': 'bytes',
            },
        });
    } catch (error) {
        console.error('Error streaming video:', error);
        return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
    }
}