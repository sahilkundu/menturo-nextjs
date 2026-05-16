// next.config.js

const nextConfig = {

    images: {
        domains: [

            "cdn.menturo.in",
            "www.google.com",

            "images.unsplash.com",

            "i.pravatar.cc"

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

                            connect-src 'self' https:;

                            frame-src 'self' https://challenges.cloudflare.com;
                        `
                            .replace(/\n/g, " ")
                    }

                ]
            }

        ]
    }

};

export default nextConfig;