import type { Metadata } from 'next'
import HartronSeoPage from '../../shared/components/HartronSeoPage'
import { hartronSupportMap } from '../../shared/hartronSeo'
import { createPageMetadata } from '../../shared/seo'

const page = hartronSupportMap['hartron-syllabus']

export const metadata: Metadata = createPageMetadata({
    title: 'HARTRON Syllabus 2026 | Programmer, DEO and Computer Topics',
    description: page.description,
    path: '/hartron-syllabus',
    keywords: [
        'HARTRON syllabus',
        'HARTRON Programmer syllabus',
        'HARTRON DEO syllabus',
        'HARTRON computer syllabus',
        'HARTRON exam preparation',
    ],
})

export default function HartronSyllabusPage() {
    return <HartronSeoPage page={page} />
}

