import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Junior Programmer Paper 7 | Programming Test',

    description:
        'Hartron Junior Programmer Programming Test covering Mst Table, Job Table, CatType dropdown, job limits, district-wise application limits, and category-wise job limits.',

    path: '/hartron-junior-programmer-second-paper-test-7',

    index: true,

})

export default function HartronJuniorProgrammerTest7Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}