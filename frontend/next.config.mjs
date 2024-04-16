/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        // Important: return the modified config
        config.module.rules.push({
            test: /\.node/,
            use: 'raw-loader',
        });
        return config;
    },
}

export default nextConfig;
