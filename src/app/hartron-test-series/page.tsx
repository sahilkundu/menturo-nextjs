import type { Metadata } from 'next'
import HartronSeoPage from '../../shared/components/HartronSeoPage'
import { hartronSupportMap } from '../../shared/hartronSeo'
import { createPageMetadata } from '../../shared/seo'

const page = hartronSupportMap['hartron-test-series']

export const metadata: Metadata = createPageMetadata({
    title: 'HARTRON Test Series 2026 | Mock Tests, PYQs and Exam Pattern',
    description: page.description,
    path: '/hartron-test-series',
    keywords: [
        'HARTRON test series',
        'HARTRON mock test',
        'HARTRON Programmer test series',
        'HARTRON Junior Programmer test series',
        'HARTRON Data Entry Operator test series',
        'HARTRON previous year papers',
        'HARTRON exam pattern',
    ],
})

export default function HartronTestSeriesPage() {
    return <HartronSeoPage page={page} />
}
