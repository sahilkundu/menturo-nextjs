import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Mock Test',
    description:
        'Attempt your active Menturo mock test.',
    path: '/test',
    index: false,
})

export default function TestLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
