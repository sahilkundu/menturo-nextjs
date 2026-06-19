import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Reset Password',
    description:
        'Reset your Menturo account password.',
    path: '/reset-password',
    index: false,
})

export default function ResetPasswordLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
