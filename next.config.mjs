/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT,
    NEXT_PUBLIC_URL_SERVER: process.env.NEXT_PUBLIC_URL_SERVER,
  }
};

export default nextConfig;
