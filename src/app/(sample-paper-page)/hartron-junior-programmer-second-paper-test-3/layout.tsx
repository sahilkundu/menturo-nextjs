import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Second Paper Test 3 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test sample paper covering Author Master, Book Details, royalty calculation, GUI data entry, and report generation.',

    path: '/hartron-junior-programmer-second-paper-test-3',

    index: true,

})

export default function HartronJuniorProgrammerTest3Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}