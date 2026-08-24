import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Paper 8 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test covering Mst Table, Transaction table, subject dropdown, marks eligibility conditions, and applicant report generation.',

    path: '/hartron-junior-programmer-second-paper-test-8',

    index: true,

})

export default function HartronJuniorProgrammerTest8Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}