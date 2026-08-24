import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Paper 10 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test covering Employee Pay, Department details, DP and DA calculation rules, employee salary interface, and salary report generation.',

    path: '/hartron-junior-programmer-second-paper-test-10',

    index: true,

})

export default function HartronJuniorProgrammerTest10Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}