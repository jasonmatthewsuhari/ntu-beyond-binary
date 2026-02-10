/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    images: {
        unoptimized: true,
    },
    // Disable server-side features for Electron
    trailingSlash: true,
    // Ensure all pages are statically generated
    reactStrictMode: true,
}

module.exports = nextConfig
