import type { Metadata } from 'next'
import HartronSeoPage from '../../shared/components/HartronSeoPage'
import { hartronSupportMap } from '../../shared/hartronSeo'
import { createPageMetadata } from '../../shared/seo'

const page = hartronSupportMap['hartron-exam-pattern']

export const metadata: Metadata = createPageMetadata({
    title: 'HARTRON Exam Pattern | Mock Test Practice Plan',
    description: page.description,
    path: '/hartron-exam-pattern',
    keywords: [
        'HARTRON exam pattern',
        'HARTRON paper pattern',
        'HARTRON mock test pattern',
        'HARTRON computer exam pattern',
        'HARTRON preparation strategy',
    ],
})

export default function HartronExamPatternPage() {
    return <HartronSeoPage page={page} />
}
