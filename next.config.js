const withMdx = require('@next/mdx')()
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out',
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

module.exports = withMdx(nextConfig)
