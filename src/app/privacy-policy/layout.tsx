import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Privacy Policy',
    description:
        'Read the Menturo privacy policy for exam preparation, mock test, account, payment, and user data practices.',
    path: '/privacy-policy',
    keywords: [
        'Menturo privacy policy',
        'exam preparation privacy policy',
    ],
})

export default function PrivacyPolicyLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
