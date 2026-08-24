import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Software Developer Paper 4 | Programming Test',

    description:
        'Hartron Programming Test sample paper covering ABC Hospital doctors, patients, treatment consultation fees, Doctor Master, Treatment Master, Appointment Details, GUI, and reports.',

    path: '/hartron-junior-programmer-second-paper-test-4',

    index: true,

})

export default function HartronJuniorProgrammerTest4Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}