/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT,
    NEXT_PUBLIC_URL_SERVER: process.env.NEXT_PUBLIC_URL_SERVER,
  },
  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: `${process.env.NEXT_PUBLIC_URL_SERVER}/api/:path*`,
      },
      {
        source: `/graphql/:path*`,
        destination: `${process.env.NEXT_PUBLIC_URL_SERVER}/graphql/:path*`,
      },
    ];
  },
};

export default nextConfig;
