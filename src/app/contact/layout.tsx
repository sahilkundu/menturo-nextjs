import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'
export const metadata: Metadata = createPageMetadata({ title: 'Contact Menturo Support', description: 'Contact Menturo support for help with mock tests, typing practice, payments, and your account.', path: '/contact' })
export default function Layout({ children }: { children: React.ReactNode }) { return children }
