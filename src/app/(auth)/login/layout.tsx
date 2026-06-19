import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Login',
    description:
        'Login to Menturo to continue your mock tests, typing practice, results, and exam preparation.',
    path: '/login',
    index: false,
})

export default function LoginLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
