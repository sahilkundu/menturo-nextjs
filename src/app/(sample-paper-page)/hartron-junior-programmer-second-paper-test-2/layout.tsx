import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Second Paper Test 2 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test sample paper covering Representative Master, Product Master, Sale Details, commission calculation, GUI, and reports.',

    path: '/hartron-junior-programmer-second-paper-test-2',

    index: true,

})

export default function HartronJuniorProgrammerTest2Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}