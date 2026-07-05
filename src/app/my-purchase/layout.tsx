import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'My Purchase',
    description: 'View your Menturo courses, payment history, subscriptions, and access history.',
    path: '/my-purchase',
    index: false,
})

export default function MyPurchaseLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
