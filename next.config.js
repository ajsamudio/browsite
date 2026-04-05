/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/browsite',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/browsite',
  },
}

module.exports = nextConfig
