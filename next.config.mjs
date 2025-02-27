/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push("@node-rs/argon2", "@node-rs/bcrypt")
        return config;
    },
    images: {
        remotePatterns: [
            {
                hostname: 'lh3.googleusercontent.com',
            },{
                hostname: 'images.rawpixel.com'
            }
        ]
    },
    eslint: {
        // Ignore ESLint errors during build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
