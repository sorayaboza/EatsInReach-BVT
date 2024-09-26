/** @type {import('next').NextConfig} */
import withImages from 'next-images';

const nextConfig = withImages({
  images: {
    remotePatterns: [
      {
        protocol: 'https', // The protocol used for the image source
        hostname: 'utfs.io', // The external domain
        port: '', // You can specify the port if needed (leave blank for default)
        pathname: '/**', // Allow all paths from this hostname
      },
    ],
  },
});

export default nextConfig;
