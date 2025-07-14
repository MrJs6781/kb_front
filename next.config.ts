/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // برای اینکه بتوانیم از سایت nobitex.ir تصویر نمایش دهیم، باید این دامنه را در اینجا تعریف کنیم.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nobitex.ir",
      },
    ],
  },
};

export default nextConfig;
