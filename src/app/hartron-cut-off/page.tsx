import type { Metadata } from 'next'
import HartronSeoPage from '../../shared/components/HartronSeoPage'
import { hartronSupportMap } from '../../shared/hartronSeo'
import { createPageMetadata } from '../../shared/seo'

const page = hartronSupportMap['hartron-cut-off']

export const metadata: Metadata = createPageMetadata({
    title: 'HARTRON Cut Off | DEO Result and Category Wise Marks',
    description: page.description,
    path: '/hartron-cut-off',
    keywords: [
        'HARTRON cut off',
        'HARTRON cutoff',
        'HARTRON DEO cut off',
        'HARTRON result',
        'HARTRON Data Entry Operator cutoff',
        'HARTRON Kurukshetra University cutoff',
    ],
})

export default function HartronCutOffPage() {
    return <HartronSeoPage page={page} />
}
