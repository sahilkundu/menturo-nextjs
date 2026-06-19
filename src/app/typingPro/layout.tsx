import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Hindi and English Typing Test Online',
    description:
        'Practice Hindi typing and English typing online for Hartron, government jobs, skill tests, and typing speed improvement with accuracy, WPM, and result tracking.',
    path: '/typingPro',
    keywords: [
        'Hindi typing test',
        'English typing test',
        'Hartron typing test',
        'typing speed test',
        'government typing test',
        'online typing practice',
    ],
})

export default function TypingProLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
