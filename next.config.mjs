/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '5001',
            // pathname: '/account123/**',
          },
          // add production server url
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            // pathname: '/account123/**',
          },
        ],
      },
};

export default nextConfig;
