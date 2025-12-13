/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    devtool: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname: "image.tmdb.org"
      },
      {
        protocol:'https',
        hostname: "placehold.co"
      }
    ]
  }
};

export default nextConfig;
