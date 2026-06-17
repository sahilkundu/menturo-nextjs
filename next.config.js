const nextConfig = {
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production",
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.menturo.in",
            },
            {
                protocol: "https",
                hostname: "www.google.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
        ],
    },

    async headers() {

        return [

            {
                source: "/(.*)",

                headers: [

                    {
                        key: "Content-Security-Policy",

                        value: `
                            default-src 'self';

                            img-src 'self'
                            blob:
                            data:
                            http://localhost:*
                            http://127.0.0.1:*
                            https://menturo-c-plus.onrender.com
                            https://localhost:*
                            https://127.0.0.1:*
                            https://www.google.com
                            https://www.apple.com
                            https://*.menturo.in
                            https://images.unsplash.com
                            https://i.pravatar.cc
                            https://*.adtrafficquality.google
                            https://*.cloudflare.com
                            https://challenges.cloudflare.com
                            https://*.challenges.cloudflare.com;

                            script-src 'self' 'unsafe-inline' 'unsafe-eval';

                            style-src 'self' 'unsafe-inline';

                            font-src 'self' data:;

                            connect-src 'self'
                            https:
                            http://localhost:*
                            http://127.0.0.1:*
                            ws://localhost:*
                            ws://127.0.0.1:*
                            wss://myapp-ws-latest.onrender.com
                            https://myapp-ws-latest.onrender.com;

                            frame-src 'self'
                            https://challenges.cloudflare.com;

                        `
                            .replace(/\n/g, " ")
                    }

                ]
            }

        ]
    }

};

export default nextConfig;
