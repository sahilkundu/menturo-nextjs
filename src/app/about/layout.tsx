import type { Metadata } from 'next'
import { createPageMetadata } from '../../shared/seo'
export const metadata: Metadata = createPageMetadata({ title: 'About Menturo', description: 'Menturo helps students prepare for government exams with mock tests, PYQs, and typing practice.', path: '/about' })
export default function Layout({ children }: { children: React.ReactNode }) { return children }
