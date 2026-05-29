import '../index.css'

import { ReactNode } from 'react'

import AppProviders from './providers/AppProviders'

export const metadata = {
    title: 'Menturo',
    description: 'Enterprise-level app using Next.js',
}

export default function RootLayout({
    children
}: {
    children: ReactNode
}) {

    return (

        <html lang="en">

            <body suppressHydrationWarning>

                <AppProviders>
                    {children}
                </AppProviders>

            </body>

        </html>
    )
}