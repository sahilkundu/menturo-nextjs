'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LIVE_TEST_ACTIVE, LIVE_TEST_SERIES } from '../../../api'
import Swal from 'sweetalert2'

type LiveQuiz = {
  id: string
  name: string
  totalQuestions: number
  durationSeconds: number
  mode: string
  status: 'scheduled' | 'live' | 'ended' | 'disabled' | string
  scheduledStartAt: number
  startedAt: number
  endsAt: number
  attemptStatus?: 'running' | 'submitted' | 'queued' | 'processing' | 'completed' | 'failed' | string
}

const formatCountdown = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
}

export default function LiveTestTab({ seriesId }: { seriesId?: string }) {
  const [quizzes, setQuizzes] = useState<LiveQuiz[]>([])
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const endpoint = seriesId
          ? `${LIVE_TEST_SERIES}?seriesId=${encodeURIComponent(seriesId)}`
          : LIVE_TEST_ACTIVE
        const response = await fetch(endpoint, { credentials: 'include', cache: 'no-store' })
        const data = await response.json()
        if (!cancelled && response.ok) {
          const next = Array.isArray(data.liveTests)
            ? data.liveTests
            : data.liveTest
              ? [data.liveTest]
              : []
          setQuizzes(next)
        }
      } catch { /* The regular series page remains usable if live data is unavailable. */ }
    }
    load()
    const refresh = window.setInterval(load, 10000)
    return () => { cancelled = true; window.clearInterval(refresh) }
  }, [seriesId])

  useEffect(() => {
    if (!quizzes.length) return
    const timer = window.setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [quizzes.length])

  const visibleQuizzes = quizzes.filter((quiz) => quiz.status !== 'disabled' && quiz.status !== 'ended')
  if (!visibleQuizzes.length) return null

  return (
    <section className="rounded-[24px] border border-red-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,.05)] sm:p-6">
      <div className="space-y-5">
        {visibleQuizzes.map((quiz) => {
          const isLive = quiz.status === 'live'
          const startAt = Number(quiz.scheduledStartAt || 0)
          const canStart = isLive || ((quiz.status === 'scheduled' || quiz.status === 'ready') && startAt <= now)
          const pendingSubmission = ['submitted', 'queued', 'processing'].includes(String(quiz.attemptStatus || ''))
          const isSubmitted = pendingSubmission || quiz.attemptStatus === 'completed'
          const canOpen = canStart || isSubmitted
          const countdownTarget = isLive ? (quiz.endsAt > 0 ? quiz.endsAt : quiz.startedAt + quiz.durationSeconds) : quiz.scheduledStartAt
          const label = isLive ? 'Ends in' : 'Starts in'
          const countdown = countdownTarget > 0 ? formatCountdown(countdownTarget - now) : '—'
          return <div key={quiz.id} className="flex flex-col gap-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.16em] text-red-600">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" /> LIVE QUIZ
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-900">{quiz.name}</h2>
              </div>
              <div className="rounded-2xl bg-red-50 px-5 py-3 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-1 font-mono text-xl font-black text-red-600">{countdown}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-700">
              <span className="rounded-xl bg-slate-50 px-4 py-2">{quiz.totalQuestions} Questions</span>
              <span className="rounded-xl bg-slate-50 px-4 py-2">{Math.max(1, Math.ceil(quiz.durationSeconds / 60))} Minutes</span>
              <span className="rounded-xl bg-slate-50 px-4 py-2">Live Quiz</span>
            </div>
            {pendingSubmission ? (
              <button
                type="button"
                onClick={() => Swal.fire({
                  icon: 'info',
                  title: 'Result not yet declared',
                  text: 'Your submission is saved. After the live quiz ends, your rank and solution will be available in My activity.',
                  confirmButtonColor: '#6d28d9'
                })}
                className="block w-full rounded-2xl bg-amber-500 px-6 py-4 text-center text-lg font-black text-white transition hover:bg-amber-600"
              >
                Submitted
              </button>
            ) : (
              <Link href={canOpen ? `/test?liveTestId=${encodeURIComponent(quiz.id)}${quiz.attemptStatus === 'completed' ? '&viewResult=1' : ''}` : '#'} aria-disabled={!canOpen} className={`block rounded-2xl px-6 py-4 text-center text-lg font-black text-white transition ${canOpen ? 'bg-violet-600 hover:bg-violet-700' : 'pointer-events-none bg-slate-300'}`}>
                {quiz.attemptStatus === 'completed' ? 'View Result →' : canStart ? 'Start Quiz →' : 'Quiz has not started'}
              </Link>
            )}
          </div>
        })}
      </div>
    </section>
  )
}
