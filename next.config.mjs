/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    webpack(config, options) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

export default nextConfig;
