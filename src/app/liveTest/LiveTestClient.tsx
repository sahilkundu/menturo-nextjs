'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  LIVE_TEST_RESULT,
  LIVE_TEST_SAVE,
  LIVE_TEST_SOLUTION,
  LIVE_TEST_START,
  LIVE_TEST_SUBMIT,
} from '../../../api'

type Question = { id: string; text: string; options: Array<{ key: string; text: string }>; marks?: number }
type History = { _id: string; endsAt: number; startedAt: number; status: string; elapsedSeconds?: number }
type Participant = { rank: number; firstName?: string; lastName?: string; username?: string; score: number; elapsedSeconds: number; correctAnswers: number; totalQuestions: number; userId: string }
type Result = { status: string; history: { rank: number; score: number; elapsedSeconds: number; correctAnswers: number; incorrectAnswers: number; totalQuestions: number; solutionAvailable: boolean }; participants?: Participant[] }

const asText = (value: unknown) => typeof value === 'string' ? value : value == null ? '' : String(value)

function normalizeQuestions(test: any): Question[] {
  const source = test?.questions && typeof test.questions === 'object' ? test.questions : {}
  return Object.entries(source).map(([id, raw]: [string, any]) => {
    const question = raw?.en || raw?.english || raw?.hi || raw
    const rawOptions = question?.options ?? question?.o ?? question?.answers ?? []
    const options = Array.isArray(rawOptions)
      ? rawOptions.map((value: any, index: number) => ({ key: String(index), text: asText(value?.text ?? value?.value ?? value) }))
      : Object.entries(rawOptions || {}).map(([key, value]: [string, any]) => ({ key, text: asText(value?.text ?? value?.value ?? value) }))
    return { id, text: asText(question?.question ?? question?.q ?? question?.text ?? question), options, marks: Number(raw?.qPosMarks || question?.qPosMarks || 1) }
  }).filter((item) => item.text)
}

const formatTime = (seconds: number) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.max(0, seconds) % 60).padStart(2, '0')}`

export default function LiveTestClient() {
  const params = useSearchParams()
  const liveTestId = params.get('liveTestId') || ''
  const historyId = params.get('historyId') || ''
  const [test, setTest] = useState<any>(null)
  const [history, setHistory] = useState<History | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [index, setIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [busy, setBusy] = useState(true)
  const [message, setMessage] = useState('Opening live quiz…')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [solution, setSolution] = useState<any>(null)
  const saveTimer = useRef<number | undefined>(undefined)
  const submitStarted = useRef(false)

  const loadResult = useCallback(async (id: string) => {
    const response = await fetch(`${LIVE_TEST_RESULT}?historyId=${encodeURIComponent(id)}`, { credentials: 'include', cache: 'no-store' })
    const data = await response.json()
    if (!response.ok || data.success === false) throw new Error(data.message || 'Could not load result')
    setResult(data)
    if (data.status === 'completed' || data.status === 'failed') setMessage(data.status === 'completed' ? 'Result calculated.' : 'Result calculation failed.')
    return data
  }, [])

  useEffect(() => {
    if (!liveTestId && !historyId) { setMessage('Live quiz id is missing.'); setBusy(false); return }
    let cancelled = false
    const start = async () => {
      try {
        if (historyId && !liveTestId) {
          const current = await loadResult(historyId)
          if (!cancelled) {
            setHistory({ ...current.history, _id: historyId })
            setSubmitted(true)
            setBusy(false)
          }
          return
        }
        const response = await fetch(LIVE_TEST_START, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ liveTestId, idempotencyKey: `${liveTestId}-${Date.now()}-${Math.random().toString(36).slice(2)}` }) })
        const data = await response.json()
        if (!response.ok || data.success === false) throw new Error(data.message || 'Could not start live quiz')
        if (cancelled) return
        setTest(data.test)
        setHistory(data.history)
        setQuestions(normalizeQuestions(data.test))
        const saved = data.history?.answers || {}
        setAnswers(Object.fromEntries(Object.entries(saved).map(([key, value]) => [key, asText(value)])))
        setIndex(Number(data.history?.activeIndex || 0))
        setBusy(false)
        setMessage('')
        if (['completed', 'queued', 'processing'].includes(data.history?.status)) {
          setSubmitted(true)
          const current = await loadResult(data.history._id)
          if (current.status !== 'completed' && current.status !== 'failed') {
            setMessage('Result is being calculated…')
          }
        }
      } catch (error) {
        if (!cancelled) { setMessage(error instanceof Error ? error.message : 'Could not start live quiz'); setBusy(false) }
      }
    }
    start()
    return () => { cancelled = true }
  }, [historyId, liveTestId, loadResult])

  useEffect(() => {
    if (!history || submitted) return
    const tick = () => setTimeLeft(Math.max(0, history.endsAt - Math.floor(Date.now() / 1000)))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [history, submitted])

  const submit = useCallback(async () => {
    if (!history || submitStarted.current) return
    submitStarted.current = true
    setMessage('Submitting and calculating your result…')
    try {
      const response = await fetch(LIVE_TEST_SUBMIT, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ historyId: history._id, answers }) })
      const data = await response.json()
      if (!response.ok || data.success === false) throw new Error(data.message || 'Could not submit quiz')
      setSubmitted(true)
      const poll = async () => {
        try {
          const current = await loadResult(history._id)
          if (current.status !== 'completed' && current.status !== 'failed') window.setTimeout(poll, 1000)
        } catch { window.setTimeout(poll, 1500) }
      }
      poll()
    } catch (error) {
      submitStarted.current = false
      setMessage(error instanceof Error ? error.message : 'Could not submit quiz')
    }
  }, [answers, history, loadResult])

  useEffect(() => {
    if (timeLeft === 0 && history && !submitted && !busy) submit()
  }, [busy, history, submit, submitted, timeLeft])

  useEffect(() => {
    if (!submitted || !history || !result || result.status === 'completed' || result.status === 'failed') return
    const timer = window.setTimeout(() => { loadResult(history._id).catch(() => {}) }, 1000)
    return () => window.clearTimeout(timer)
  }, [history, loadResult, result, submitted])

  useEffect(() => {
    if (!history || submitted || busy) return
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      fetch(LIVE_TEST_SAVE, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ historyId: history._id, answers, activeIndex: index }) }).catch(() => {})
    }, 400)
    return () => window.clearTimeout(saveTimer.current)
  }, [answers, history, index, submitted, busy])

  const question = questions[index]
  const selected = question ? answers[question.id] : undefined
  const solutionItems = useMemo(() => solution?.questions && solution?.solution ? questions : [], [questions, solution])

  const openSolution = async () => {
    if (!history || solution) return
    try {
      const response = await fetch(`${LIVE_TEST_SOLUTION}?historyId=${encodeURIComponent(history._id)}`, { credentials: 'include', cache: 'no-store' })
      const data = await response.json()
      if (!response.ok || data.success === false) throw new Error(data.message || 'Solution is not ready')
      setQuestions(normalizeQuestions({ questions: data.questions }))
      setSolution(data)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Solution is not ready') }
  }

  if (solution) return <SolutionView items={solutionItems} solution={solution.solution} answers={answers} onBack={() => setSolution(null)} />
  if (historyId && result) return <ResultPanel result={result} onSolution={openSolution} />
  if (busy || !question) return <main className="mx-auto max-w-4xl p-6"><div className="rounded-2xl bg-white p-8 text-center shadow">{message || 'Loading…'}</div></main>

  return (
    <main className="mx-auto max-w-5xl p-3 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white">
        <div><p className="text-xs font-bold uppercase tracking-wider text-slate-300">{test?.name || 'Live Quiz'}</p><p className="mt-1 font-black">Question {index + 1} of {questions.length}</p></div>
        <div className={`rounded-xl px-4 py-2 font-mono text-xl font-black ${timeLeft < 60 ? 'bg-red-600' : 'bg-violet-600'}`}>{formatTime(timeLeft)}</div>
      </div>
      {message && <div className="mb-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</div>}
      <section className="rounded-2xl bg-white p-5 shadow sm:p-8">
        <p className="text-lg font-black leading-8 text-slate-900">{question.text}</p>
        <div className="mt-6 grid gap-3">{question.options.map((option) => <button key={option.key} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.key }))} className={`rounded-xl border p-4 text-left font-semibold transition ${selected === option.key ? 'border-violet-600 bg-violet-50 text-violet-900' : 'border-slate-200 hover:border-violet-300'}`}><span className="mr-3 font-black">{option.key}</span>{option.text}</button>)}</div>
        <div className="mt-8 flex flex-wrap justify-between gap-3"><button type="button" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="rounded-xl border px-5 py-3 font-black disabled:opacity-40">Previous</button>{index < questions.length - 1 ? <button type="button" onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))} className="rounded-xl bg-violet-600 px-5 py-3 font-black text-white">Next</button> : <button type="button" onClick={submit} className="rounded-xl bg-emerald-600 px-5 py-3 font-black text-white">Submit Quiz</button>}</div>
      </section>
      {submitted && result && <ResultPanel result={result} onSolution={openSolution} />}
    </main>
  )
}

function ResultPanel({ result, onSolution }: { result: Result; onSolution: () => void }) {
  const history = result.history
  if (result.status !== 'completed') return <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4"><div className="max-w-sm rounded-2xl bg-white p-7 text-center"><p className="text-lg font-black">Calculating result…</p><p className="mt-2 text-sm text-slate-600">Your result is processed one submission at a time.</p></div></div>
  return <div className="fixed inset-0 z-20 overflow-y-auto bg-slate-950/50 p-4"><div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Final Results</p><h2 className="mt-2 text-center text-2xl font-black text-slate-900">Congratulations!</h2><p className="mt-3 text-center text-4xl font-black text-amber-500">#{history.rank}</p><p className="text-center font-black text-slate-700">Rank achieved</p><div className="mt-6 grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-bold text-slate-500">Score</p><p className="text-2xl font-black text-emerald-700">{history.score}</p></div><div className="rounded-xl bg-blue-50 p-4"><p className="text-xs font-bold text-slate-500">Time</p><p className="text-2xl font-black text-blue-700">{formatTime(history.elapsedSeconds)}</p></div></div><p className="mt-4 text-center font-semibold text-slate-700">Correct answers: {history.correctAnswers} / {history.totalQuestions}</p><div className="mt-6 overflow-hidden rounded-xl border"><div className="bg-slate-50 p-3 font-black">Test Series Rank List</div>{(result.participants || []).map((person) => <div key={person.userId} className={`border-t p-3 font-semibold ${person.rank === history.rank ? 'bg-emerald-50 text-emerald-700' : ''}`}><div className="flex justify-between"><span>#{person.rank} {person.firstName || person.username || 'Participant'} {person.lastName || ''} {person.rank === history.rank ? '(You)' : ''}</span><span>{person.score}</span></div><div className="mt-1 flex justify-between text-xs font-medium text-slate-500"><span>User ID: {person.userId}</span><span>Time: {formatTime(person.elapsedSeconds)}</span></div></div>)}</div><button type="button" onClick={onSolution} className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white">View Solution</button></div></div>
}

function SolutionView({ items, solution, answers, onBack }: { items: Question[]; solution: Record<string, any>; answers: Record<string, string>; onBack: () => void }) {
  return <main className="mx-auto max-w-4xl p-4 sm:p-8"><button type="button" onClick={onBack} className="mb-5 rounded-xl border px-4 py-2 font-black">← Back to result</button><h1 className="text-2xl font-black">Live Quiz Solution</h1><div className="mt-5 space-y-4">{items.map((item, index) => { const expected = asText(solution?.[item.id]?.answer); const chosen = answers[item.id]; return <article key={item.id} className="rounded-2xl bg-white p-5 shadow"><p className="font-black">{index + 1}. {item.text}</p><p className="mt-3 text-sm"><b>Your answer:</b> {chosen == null ? 'Not answered' : chosen} · <b>Correct answer:</b> {expected}</p></article> })}</div></main>
}
