/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // Allows any https domain
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
