import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Second Paper Test 1 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test sample paper covering Agent Master, Policy Details, commission calculation, GUI data entry, and reports.',

    path: '/hartron-junior-programmer-second-paper-test-1',

    index: true,

})

export default function HartronJuniorProgrammerTest1Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}