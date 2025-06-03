/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Netlify deployment optimizations
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Remove trailingSlash as it can cause 404s on Netlify
  assetPrefix: '',
}

module.exports = nextConfig 