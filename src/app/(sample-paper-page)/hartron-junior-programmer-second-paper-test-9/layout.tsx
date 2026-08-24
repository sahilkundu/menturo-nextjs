import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Paper 9 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test covering Subject Master, Candidate records, test marks, automatic pass or fail result, and subject-wise passed student reports.',

    path: '/hartron-junior-programmer-second-paper-test-9',

    index: true,

})

export default function HartronJuniorProgrammerTest9Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}