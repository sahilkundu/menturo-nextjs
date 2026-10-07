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
  joinedCount?: number
  attemptStatus?: 'running' | 'submitted' | 'queued' | 'processing' | 'completed' | 'failed' | string
}

const countdownParts = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds))
  return [
    String(Math.floor(safe / 3600)).padStart(2, '0'),
    String(Math.floor((safe % 3600) / 60)).padStart(2, '0'),
    String(safe % 60).padStart(2, '0'),
  ]
}

function RollingDigit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit)
  const [previous, setPrevious] = useState(digit)
  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    if (digit === current) return
    setPrevious(current)
    setCurrent(digit)
    setRolling(true)
    const timer = window.setTimeout(() => setRolling(false), 430)
    return () => window.clearTimeout(timer)
  }, [digit, current])

  return (
    <span className="relative inline-block h-[1em] w-[.64em] overflow-hidden align-middle">
      <span className={`absolute inset-0 flex items-center justify-center ${rolling ? 'live-digit-out' : 'opacity-0'}`}>
        {previous}
      </span>
      <span className={`absolute inset-0 flex items-center justify-center ${rolling ? 'live-digit-in' : ''}`}>
        {current}
      </span>
    </span>
  )
}

function RollingCountdown({ seconds }: { seconds: number }) {
  const parts = countdownParts(seconds)
  return (
    <div className="flex items-center justify-center font-mono text-[clamp(1.25rem,4vw,2rem)] font-black tracking-[.08em] text-[#d52f35] tabular-nums">
      {parts.map((part, partIndex) => (
        <span key={partIndex} className="inline-flex items-center">
          {part.split('').map((digit, digitIndex) => <RollingDigit key={`${partIndex}-${digitIndex}`} digit={digit} />)}
          {partIndex < parts.length - 1 && <span className="mx-[.08em]">:</span>}
        </span>
      ))}
    </div>
  )
}

function MetaIcon({ type }: { type: 'questions' | 'time' | 'users' }) {
  if (type === 'time') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2M9 3h6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
  if (type === 'users') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5"><path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 19.5v-1.2c0-2.3 2.2-4.1 5-4.1s5 1.8 5 4.1v1.2M14 14.8c.7-.4 1.5-.6 2.5-.6 2.2 0 4 1.4 4 3.2v1.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5"><path d="M6 3.5h9l3 3v14H6z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d="M9 10h6M9 14h6M9 18h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
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
      } catch { /* Normal series content remains available if live data is unavailable. */ }
    }
    void load()
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
    <section className="rounded-[24px] border border-[#f0cfd1] bg-[linear-gradient(135deg,#fffafa_0%,#fff_58%,#fff8f8_100%)] p-3 shadow-[0_8px_30px_rgba(166,64,72,.08)] sm:p-5">
      <style jsx>{`
        @keyframes liveDigitOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-110%); opacity: 0; } }
        @keyframes liveDigitIn { from { transform: translateY(110%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .live-digit-out { animation: liveDigitOut .43s cubic-bezier(.2,.7,.3,1) both; }
        .live-digit-in { animation: liveDigitIn .43s cubic-bezier(.2,.7,.3,1) both; }
      `}</style>
      <div className="space-y-5">
        {visibleQuizzes.map((quiz) => {
          const isLive = quiz.status === 'live'
          const startAt = Number(quiz.scheduledStartAt || 0)
          const canStart = isLive || ((quiz.status === 'scheduled' || quiz.status === 'ready') && startAt <= now)
          const pendingSubmission = ['submitted', 'queued', 'processing'].includes(String(quiz.attemptStatus || ''))
          const countdownTarget = isLive ? (quiz.endsAt > 0 ? quiz.endsAt : quiz.startedAt + quiz.durationSeconds) : startAt
          const countdown = countdownTarget > 0 ? countdownTarget - now : 0
          const label = isLive ? 'Ends in' : 'Starts in'
          const canOpen = canStart || pendingSubmission || quiz.attemptStatus === 'completed'

          return (
            <article key={quiz.id} className="overflow-hidden rounded-[20px] border border-[#f2d9da] bg-white/55 px-3 py-4 sm:px-5 sm:py-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 text-sm font-black tracking-wide text-[#111827]">
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffd9d9]">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#e12f35]" />
                    </span>
                    <span>LIVE QUIZ</span>
                  </div>
                  <h2 className="mt-5 break-words text-xl font-black leading-tight text-[#131827] sm:text-2xl">{quiz.name || 'Live Quiz'}</h2>
                </div>
                <div className="min-w-[190px] rounded-2xl bg-[#fff7f7] px-4 py-2 text-center md:min-w-[220px]">
                  <p className="text-xs font-bold text-[#1f2937]">{label}</p>
                  <RollingCountdown seconds={countdown} />
                  <div className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wide text-[#273044]"><span>HRS</span><span>MINS</span><span>SECS</span></div>
                </div>
              </div>

              <div className="my-5 h-px bg-[#f3dddd]" />
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-bold text-[#1f2937]">
                <span className="flex items-center gap-2"><MetaIcon type="questions" /><span>{Number(quiz.totalQuestions || 0)} Questions</span></span>
                <span className="flex items-center gap-2"><MetaIcon type="time" /><span>{Math.max(1, Math.ceil(Number(quiz.durationSeconds || 0) / 60))} Minutes</span></span>
                {isLive && <span className="flex items-center gap-2 text-[#39445a]"><MetaIcon type="users" /><span>{Number(quiz.joinedCount || 0)} Students Joined</span></span>}
              </div>

              <div className="mt-5">
                {pendingSubmission ? (
                  <button type="button" onClick={() => Swal.fire({ icon: 'info', title: 'Result not yet declared', text: 'Your submission is saved. After the live quiz ends, your rank and solution will be available in My activity.', confirmButtonColor: '#5b3bd1' })} className="block w-full rounded-[14px] bg-amber-500 px-6 py-3.5 text-center text-base font-black text-white transition hover:bg-amber-600 sm:text-lg">Submitted</button>
                ) : (
                  <Link href={canOpen ? `/test?liveTestId=${encodeURIComponent(quiz.id)}${quiz.attemptStatus === 'completed' ? '&viewResult=1' : ''}` : '#'} aria-disabled={!canOpen} className={`flex w-full items-center justify-center gap-3 rounded-[14px] px-6 py-3.5 text-center text-base font-black text-white transition sm:text-lg ${canOpen ? 'bg-[linear-gradient(105deg,#6040db,#5730d0)] shadow-[0_8px_18px_rgba(88,49,210,.2)] hover:brightness-105' : 'pointer-events-none bg-slate-300'}`}>
                    {quiz.attemptStatus === 'completed' ? 'View Result' : canStart ? 'Start Quiz' : 'Quiz has not started'} <span className="text-2xl leading-none">→</span>
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
