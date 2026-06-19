import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Terms and Conditions',
    description:
        'Read the Menturo terms and conditions for using mock tests, test series, typing practice, accounts, and payments.',
    path: '/terms-and-conditions',
    keywords: [
        'Menturo terms',
        'test series terms and conditions',
    ],
})

export default function TermsLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
