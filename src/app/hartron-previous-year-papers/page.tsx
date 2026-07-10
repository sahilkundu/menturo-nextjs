import type { Metadata } from 'next'
import HartronSeoPage from '../../shared/components/HartronSeoPage'
import { hartronSupportMap } from '../../shared/hartronSeo'
import { createPageMetadata } from '../../shared/seo'

const page = hartronSupportMap['hartron-previous-year-papers']

export const metadata: Metadata = createPageMetadata({
    title: 'HARTRON Previous Year Papers | PYQs and Mock Tests',
    description: page.description,
    path: '/hartron-previous-year-papers',
    keywords: [
        'HARTRON previous year papers',
        'HARTRON PYQ',
        'HARTRON previous year questions',
        'HARTRON computer PYQ',
        'HARTRON mock test',
    ],
})

export default function HartronPreviousYearPapersPage() {
    return <HartronSeoPage page={page} />
}

