import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'My Activity',
    description:
        'View your Menturo mock test, typing test, and exam preparation activity.',
    path: '/activity',
    index: false,
})

export default function ActivityLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
