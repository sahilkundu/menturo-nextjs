import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Advertising Policy',
    description:
        'Read the Menturo advertising policy for ad serving, cookies, remarketing, and partner advertising technologies.',
    path: '/ad-policy',
    keywords: [
        'Menturo advertising policy',
        'Menturo ad policy',
        'Menturo cookies advertising',
    ],
})

export default function AdPolicyLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
