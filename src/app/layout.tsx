import '../index.css'

import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import AppProviders from './providers/AppProviders'
import CookieConsent from '../shared/components/CookieConsent'
import AppBottomHeader from '../shared/components/AppBottomHeader'
import {
    defaultImage,
    seoKeywords,
    siteName,
    siteUrl
} from '../shared/seo'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    referrer: 'origin-when-cross-origin',
    authors: [
        {
            name: siteName,
            url: siteUrl,
        },
    ],
    creator: siteName,
    publisher: siteName,
    category: 'education',
    icons: {
        shortcut: '/favicon.ico',
        icon: [
            {
                url: '/favicon.ico',
                sizes: '48x48',
            },
            {
                url: '/icon-192.png',
                type: 'image/png',
                sizes: '192x192',
            },
            {
                url: '/icon-512.png',
                type: 'image/png',
                sizes: '512x512',
            },
        ],
        apple: [
            {
                url: '/apple-touch-icon.png',
                type: 'image/png',
                sizes: '180x180',
            },
        ],
    },

    title: {
        default: 'Menturo - Govt Exam Mock Tests, Haryana CET, Hartron, SSC',
        template: '%s | Menturo',
    },

    description:
        'Menturo helps students prepare for Haryana CET, Hartron, SSC CGL, SSC CHSL, SSC GD, DSSSB, UPSC, Banking, HTET, and state government exams with mock tests, PYQs, and typing practice.',

    keywords: seoKeywords,

    verification: {
        google: 'lQ8DvOxm1SoOHSt0LFa2Z5QGd4qR1y2Iy2PmOsGdQpc',
    },

    robots: {
        index: true,
        follow: true,
    },

    alternates: {
        canonical: '/',
    },

    openGraph: {
        title: 'Menturo - Government Exam Mock Tests',
        description:
            'Prepare for Haryana CET, Hartron, SSC, DSSSB, UPSC, Banking, HTET, and state exams with mock tests and previous year questions.',
        url: siteUrl,
        siteName,
        images: [
            {
                url: defaultImage,
                width: 512,
                height: 512,
                alt: 'Menturo government exam preparation',
            },
        ],
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Menturo - Government Exam Mock Tests',
        description:
            'Mock tests, PYQs, and typing practice for Haryana CET, Hartron, SSC, DSSSB, UPSC, Banking, HTET, and state exams.',
        images: [defaultImage],
    },
}
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children
}: {
    children: ReactNode
}) {

    return (

        <html lang="en">

            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `!function(){var p=location.pathname.replace(/\\/$/,'')||'/';var ok=p==='/'||p==='/series'||p.indexOf('/series/')===0||p==='/typingPro';if(!ok)return;function l(z,u){var s=document.createElement('script');s.dataset.zone=z;s.src=u;[document.documentElement,document.body].filter(Boolean).pop().appendChild(s)}l('11245878','https://al5sm.com/tag.min.js');l('11245917','https://n6wxm.com/vignette.min.js');l('11245992','https://nap5k.com/tag.min.js')}();`,
                    }}
                />
            </head>

            <body suppressHydrationWarning>
                <Script
                    id="site-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([
                            {
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: siteName,
                                url: siteUrl,
                                logo: {
                                    '@type': 'ImageObject',
                                    url: defaultImage,
                                    width: 512,
                                    height: 512,
                                },
                                sameAs: [
                                    siteUrl,
                                ],
                            },
                            {
                                '@context': 'https://schema.org',
                                '@type': 'WebSite',
                                name: siteName,
                                url: siteUrl,
                            },
                        ]),
                    }}
                />
                <AppProviders>
                    {children}
                    <AppBottomHeader />
                </AppProviders>
                <CookieConsent />

            </body>

        </html>
    )
}
