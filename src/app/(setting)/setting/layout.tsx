import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createPageMetadata } from '../../../shared/seo'

export const metadata: Metadata = createPageMetadata({
    title: 'Settings',
    description:
        'Manage your Menturo account settings.',
    path: '/setting',
    index: false,
})

export default function SettingLayout({
    children,
}: {
    children: ReactNode
}) {
    return children
}
