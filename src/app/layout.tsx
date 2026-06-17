import '../index.css'

import { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import AppProviders from './providers/AppProviders'

export const metadata: Metadata = {
    metadataBase: new URL('https://www.menturo.in'),

    title: {
        default: 'Menturo - Govt Exams, Haryana CET, UPSC, Banking, SSC',
        template: '%s | Menturo',
    },

    description:
        'Menturo is India\'s trusted platform for UPSC, Hartron, Banking, HTET, SSC, and other government exams.',

    keywords: [
        'Haryana CET',
        'Hartron',
        'UPSC',
        'SSC',
        'Banking',
        'HTET',
        'Mock Tests',
        'Previous Year Questions',
    ],

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
        title: 'Menturo',
        description:
            'Government exam preparation platform with PYQs and mock tests.',
        url: 'https://www.menturo.in',
        siteName: 'Menturo',
        images: [
            {
                url: 'https://www.menturo.in/M3.png',
                width: 512,
                height: 512,
            },
        ],
        type: 'website',
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
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Menturo",
                            "url": "https://www.menturo.in",
                            "logo": "https://www.menturo.in/M3.png"
                        }),
                    }}
                />
                <AppProviders>
                    {children}
                </AppProviders>

            </body>

        </html>
    )
}