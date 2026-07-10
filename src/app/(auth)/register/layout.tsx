import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Create Account',
    description:
        'Create a Menturo account to start mock tests, typing practice, previous year questions, and exam preparation.',
    path: '/register',
})

export default function RegisterLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
