const withMdx = require('@next/mdx')()
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

module.exports = withMdx(nextConfig)
