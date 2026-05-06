/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/products',
        destination: '/404', // Forces a 404 Not Found error Page
      },
      {
        source: '/products/:path*',
        destination: '/404',
      },
    ]
  },
}

export default nextConfig
