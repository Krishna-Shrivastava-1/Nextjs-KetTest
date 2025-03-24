import { NextResponse } from 'next/server';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Define the proxy function
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const targetUrl = searchParams.get('url'); // Get the target URL from query params

        if (!targetUrl) {
            return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
        }

        // Proxy the request
        const proxy = createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            secure: true,
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
            pathRewrite: {
                [`^/api/proxy`]: '', // Remove /api/proxy from request path
            },
        });

        return proxy(req, new NextResponse());
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Proxy server error' }, { status: 500 });
    }
}
