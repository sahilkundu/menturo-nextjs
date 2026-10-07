'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LIVE_TEST_ACTIVITY } from '../../../api'

type Item = {
  _id: string
  liveTestId?: string
  name: string
  status: string
  score: number
  rank: number
  elapsedSeconds: number
  correctAnswers: number
  totalQuestions: number
  submittedAt: number
}

export default function LiveTestActivity() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch(LIVE_TEST_ACTIVITY, { credentials: 'include', cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setItems(data?.items || []))
      .catch(() => {})
  }, [])

  if (!items.length) return null

  return (
    <section className="mx-auto mb-6 max-w-6xl rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-violet-600">Live quiz activity</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Your live test history</h2>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-black text-violet-700">
          {items.length} attempts
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
            <div>
              <p className="font-black text-slate-800">{item.name || 'Live Quiz'}</p>
              <p className="text-xs font-semibold text-slate-500">
                {item.status === 'completed'
                  ? `${item.correctAnswers}/${item.totalQuestions} correct · ${item.elapsedSeconds}s · Rank #${item.rank}`
                  : 'Submitted · Rank will appear here after the live quiz ends'}
              </p>
            </div>
            {item.status === 'completed' && item.liveTestId && (
              <Link
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-black text-white"
                href={`/test?liveTestId=${encodeURIComponent(item.liveTestId)}&viewResult=1`}
              >
                View result
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
