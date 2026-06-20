import '../index.css'

import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import AppProviders from './providers/AppProviders'
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
                                logo: defaultImage,
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
                </AppProviders>

            </body>

        </html>
    )
}
