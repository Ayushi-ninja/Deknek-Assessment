/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },
  // Allow @react-three packages (CommonJS)
  transpilePackages: [],
  experimental: {
    // required for framer-motion in app router
  },
}

module.exports = nextConfig
