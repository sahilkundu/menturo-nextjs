import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Forgot Password',
    description:
        'Recover access to your Menturo account.',
    path: '/forgot-password',
    index: false,
})

export default function ForgotPasswordLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
