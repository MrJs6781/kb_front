/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptoicons.co",
      },
    ],
  },
};

export default nextConfig;
