import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url'); // External video URL

    if (!videoUrl) {
        return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    try {
        // Extract Range header for smooth playback
        const range = req.headers.get('Range') || 'bytes=0-';

        // Stream the video with optimized headers
        const response = await fetch(videoUrl, {
            headers: {
                'Range': range, // Allows partial video loading
                'User-Agent': req.headers.get('User-Agent') || 'Mozilla/5.0',
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch video: ${response.status}`);

        // Extract necessary headers for efficient buffering
        const contentLength = response.headers.get('Content-Length');
        const contentRange = response.headers.get('Content-Range') || `bytes 0-${contentLength - 1}/${contentLength}`;

        return new NextResponse(response.body, {
            status: response.status === 200 ? 206 : response.status, // Ensure Partial Content (206)
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
                'Content-Length': contentLength,
                'Content-Range': contentRange,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=3600, immutable', // Better caching for smooth playback
            },
        });
    } catch (error) {
        console.error('Error streaming video:', error);
        return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
    }
}


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
