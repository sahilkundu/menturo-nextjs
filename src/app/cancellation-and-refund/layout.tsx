import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Cancellation and Refund Policy',
    description:
        'Read the Menturo cancellation and refund policy for paid mock tests, test series, and exam preparation services.',
    path: '/cancellation-and-refund',
    keywords: [
        'Menturo refund policy',
        'test series refund policy',
    ],
})

export default function RefundLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
