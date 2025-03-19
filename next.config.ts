/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static page generation - this avoids prerendering during build
  output: 'standalone',
  
  // Disable image optimization for exported static sites
  images: { unoptimized: true },
  
  webpack: (config, { isServer }) => {
    // Only on the client side
    if (!isServer) {
      // Don't attempt to load these packages on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        "aws-sdk": false,
        "mock-aws-s3": false,
        nock: false,
        "fs.realpath": false,
      };
    }
    return config;
  },
  
  eslint: {
    ignoreDuringBuilds: true
  },
  
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;

export const ENABLE_STATIC_EXPORT = true;