/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your image sources
  },
  output: 'export',
};

module.exports = nextConfig;
