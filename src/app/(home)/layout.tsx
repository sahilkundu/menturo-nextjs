import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Menturo - Govt Exam Mock Tests, Hartron, Haryana CET, SSC',
    description:
        'Prepare for Haryana CET, Hartron, SSC CGL, SSC CHSL, SSC GD, DSSSB, UPSC, Banking, HTET, and state government exams with Menturo mock tests and PYQs.',
    path: '/',
    keywords: [
        'Testbook alternative',
        'Haryana CET online test',
        'Hartron typing test',
        'SSC CGL mock test',
        'SSC CHSL mock test',
        'DSSSB mock test',
    ],
})

export default function HomeLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
