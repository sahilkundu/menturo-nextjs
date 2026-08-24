import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Paper 5 | Programming Test',

    description:
        'Hartron Programming Test sample paper covering insurance agents, customers, Agent Master, Policy Details, commission calculation, GUI data entry, and report generation.',

    path: '/hartron-junior-programmer-second-paper-test-5',

    index: true,

})

export default function HartronJuniorProgrammerTest5Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}