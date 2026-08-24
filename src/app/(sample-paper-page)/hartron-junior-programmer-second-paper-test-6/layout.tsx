import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({

    title: 'Hartron Programmer Paper 6 | Programming Test',

    description:
        'Hartron Programming Test sample paper covering Mst_Model, Service_Tbl, service record GUI, dropdown controls, automatic service charge calculation, and report generation.',

    path: '/hartron-junior-programmer-second-paper-test-6',

    index: true,

})

export default function HartronJuniorProgrammerTest6Layout({

    children,

}: {

    children: ReactNode

}) {

    return children

}