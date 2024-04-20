/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
    output: "export",
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        // Important: return the modified config
        config.module.rules.push({
            test: /\.node/,
            use: 'raw-loader',
        });
        return config;
    },
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = withPWA(nextConfig);
