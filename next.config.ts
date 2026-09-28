import type { NextConfig } from 'next';

import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
