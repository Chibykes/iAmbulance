/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.chibykes.dev'
      },
    ],
  }
}

module.exports = withPWA(nextConfig);
// module.exports = nextConfig;
