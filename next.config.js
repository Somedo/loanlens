/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },  distDir: '.next-build',
}

module.exports = nextConfig