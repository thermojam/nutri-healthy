import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
        ],
        // Performance optimizations
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Production source maps (disable for smaller bundle)
    productionBrowserSourceMaps: false,


    // Enable React strict mode
    reactStrictMode: true,

    // Power Up Next.js with SWC transformations
    experimental: {
        optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
    },

    // Security headers will be set by middleware
    headers: async () => {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
