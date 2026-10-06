import { Suspense } from 'react'
import LiveTestClient from './LiveTestClient'

export default function LiveTestPage() {
  return <Suspense fallback={<main className="p-6 text-center">Loading live quiz…</main>}><LiveTestClient /></Suspense>
}
