// next.config.js

const nextConfig = {

    images: {
        domains: [

            "cdn.menturo.in",
            "www.google.com",
            "https://menturo-c-plus.onrender.com",
            "images.unsplash.com",

            "i.pravatar.cc",

            "localhost",
            "127.0.0.1"

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
                            ws://127.0.0.1:*;

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