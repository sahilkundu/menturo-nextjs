'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ACTIVITY, LIVE_TEST_RESULT } from '../../../../api'
import { useUserStore } from '../../../shared/store/user'

type NormalActivity = {
    id: string
    testId: string
    seriesId: string
    testName: string
    seriesName: string
    attempt: number
    status: string
    score: number
    correctAnswers: number
    incorrectAnswers: number
    totalQuestions: number
    elapsedSeconds: number
    attemptedAt: number
    submittedAt: number
    solutionAvailable: boolean
}

type LiveActivity = {
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

type RankParticipant = {
    rank: number
    userId: string
    firstName?: string
    lastName?: string
    username?: string
    score: number
    elapsedSeconds: number
}

type RankResult = {
    status: string
    history: {
        rank: number
        score: number
        elapsedSeconds: number
        correctAnswers: number
        totalQuestions: number
    }
    participants?: RankParticipant[]
}

const dateText = (value: number) => {
    if (!value) return '—'
    const milliseconds = value < 100000000000 ? value * 1000 : value
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(milliseconds))
}

const timeText = (value: number) => {
    const seconds = Math.max(0, Number(value || 0))
    const minutes = Math.floor(seconds / 60)
    return `${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const userLabel = (person: RankParticipant) =>
    `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.username || 'Participant'

export default function ActivityPage() {
    const user = useUserStore((state) => state.user)
    const ownerName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Your activity'
    const [normalItems, setNormalItems] = useState<NormalActivity[]>([])
    const [liveItems, setLiveItems] = useState<LiveActivity[]>([])
    const [selectedLiveId, setSelectedLiveId] = useState('')
    const [rankResult, setRankResult] = useState<RankResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [rankLoading, setRankLoading] = useState(false)
    const [error, setError] = useState('')

    const activityRequest = useRef<Promise<void> | null>(null)

    const loadActivity = useCallback(async () => {
        if (activityRequest.current) return activityRequest.current
        setLoading(true)
        setError('')
        const request = (async () => {
            const response = await fetch(ACTIVITY, { credentials: 'include', cache: 'no-store' })
            const data = await response.json().catch(() => null)
            if (!response.ok || !data?.success) throw new Error(data?.message || `Unable to load activity (${response.status})`)
            const nextLive = Array.isArray(data.liveItems) ? data.liveItems : []
            setNormalItems(Array.isArray(data.items) ? data.items : [])
            setLiveItems(nextLive)
            setSelectedLiveId((current) => current || nextLive[0]?._id || '')
        })()
        activityRequest.current = request
        try {
            await request
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Unable to load activity')
        } finally {
            setLoading(false)
            if (activityRequest.current === request) activityRequest.current = null
        }
    }, [])

    useEffect(() => {
        void loadActivity()
    }, [loadActivity])

    const selectedLive = useMemo(
        () => liveItems.find((item) => item._id === selectedLiveId) || null,
        [liveItems, selectedLiveId],
    )

    const openRank = async (item: LiveActivity) => {
        if (!item.liveTestId || item.status !== 'completed') return
        setRankLoading(true)
        setRankResult(null)
        try {
            const response = await fetch(
                `${LIVE_TEST_RESULT}?historyId=${encodeURIComponent(item._id)}`,
                { credentials: 'include', cache: 'no-store' },
            )
            const data = await response.json()
            if (!response.ok || !data?.success) throw new Error(data?.message || 'Rank is not available')
            setRankResult(data)
        } catch (rankError) {
            setError(rankError instanceof Error ? rankError.message : 'Rank is not available')
        } finally {
            setRankLoading(false)
        }
    }

    const completedNormal = normalItems.filter((item) => item.status === 'submitted').length
    const completedLive = liveItems.filter((item) => item.status === 'completed').length

    return (
        <main className="min-h-screen bg-[#f6f4fb] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#211b46,#513da1_55%,#7757d9)] p-6 text-white shadow-[0_18px_50px_rgba(65,47,139,.24)] sm:p-8">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[.22em] text-violet-200">Menturo activity</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{ownerName}</h1>
                        <p className="mt-2 max-w-2xl text-sm font-medium text-violet-100 sm:text-base">
                            Your test history, live quiz attempts, and declared ranks in one private dashboard.
                        </p>
                        <button type="button" onClick={() => void loadActivity()} disabled={loading} className="mt-5 rounded-xl bg-white/15 px-4 py-2 text-xs font-black text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/25 disabled:opacity-60">
                            {loading ? 'Loading…' : 'Refresh activity'}
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                        <span>{error}</span>
                        <button type="button" onClick={() => void loadActivity()} className="rounded-lg bg-rose-600 px-3 py-2 text-xs text-white">Retry</button>
                    </div>
                )}

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ['Normal attempts', normalItems.length, 'Your saved mock-test attempts'],
                        ['Completed results', completedNormal, 'Normal results available'],
                        ['Live quizzes', liveItems.length, 'Live tests in your history'],
                        ['Declared live ranks', completedLive, 'Public rank lists available'],
                    ].map(([label, value, detail]) => (
                        <div key={String(label)} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-[0_8px_25px_rgba(77,55,145,.07)]">
                            <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
                            <p className="mt-2 text-3xl font-black text-[#5039bd]">{loading ? '—' : value}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-400">{detail}</p>
                        </div>
                    ))}
                </section>

                <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_10px_35px_rgba(77,55,145,.08)]">
                    <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-5 py-5 sm:px-7">
                        <p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Private records</p>
                        <h2 className="mt-1 text-xl font-black text-slate-900">Normal test activity</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Only your authenticated test history is shown here.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-[980px] w-full text-left text-sm">
                            <thead className="bg-[#5141c7] text-xs uppercase tracking-wider text-white">
                                <tr>
                                    <th className="px-5 py-4">Test</th>
                                    <th className="px-5 py-4">Series</th>
                                    <th className="px-5 py-4">Attempted</th>
                                    <th className="px-5 py-4">Correct</th>
                                    <th className="px-5 py-4">Incorrect</th>
                                    <th className="px-5 py-4">Score</th>
                                    <th className="px-5 py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!loading && normalItems.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-violet-50/50">
                                        <td className="px-5 py-4 font-black text-slate-800">{item.testName || 'Test'}</td>
                                        <td className="px-5 py-4 font-semibold text-slate-500">{item.seriesName || '—'}</td>
                                        <td className="px-5 py-4 font-semibold text-slate-500">{dateText(item.attemptedAt)}</td>
                                        <td className="px-5 py-4 font-black text-emerald-600">{item.correctAnswers} / {item.totalQuestions}</td>
                                        <td className="px-5 py-4 font-black text-rose-500">{item.incorrectAnswers}</td>
                                        <td className="px-5 py-4 font-black text-[#4d36c0]">{Number(item.score || 0).toFixed(1)}</td>
                                        <td className="px-5 py-4 font-semibold text-slate-500">{timeText(item.elapsedSeconds)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && normalItems.length === 0 && <p className="px-6 py-12 text-center text-sm font-bold text-slate-400">No normal test activity yet.</p>}
                </section>

                <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_10px_35px_rgba(77,55,145,.08)] sm:p-7">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Live quiz records</p>
                        <h2 className="mt-1 text-xl font-black text-slate-900">Your live tests</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Each tab is loaded from your own live-test history. Participant details appear only after opening a declared rank.</p>
                    </div>

                    {liveItems.length > 0 ? (
                        <>
                            <div className="mt-5 flex gap-2 overflow-x-auto border-b border-slate-100 pb-2">
                                {liveItems.map((item) => (
                                    <button
                                        type="button"
                                        key={item._id}
                                        onClick={() => { setSelectedLiveId(item._id); setRankResult(null) }}
                                        className={`shrink-0 rounded-xl px-4 py-3 text-left text-xs font-black transition ${selectedLiveId === item._id ? 'bg-[#5141c7] text-white shadow-lg shadow-violet-200' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}
                                    >
                                        <span className="block max-w-[190px] truncate">{item.name || 'Live quiz'}</span>
                                        <span className={`mt-1 block text-[10px] ${selectedLiveId === item._id ? 'text-violet-100' : 'text-violet-400'}`}>{item.status === 'completed' ? 'Rank declared' : 'Submitted'}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedLive && (
                                <div className="mt-5 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">{selectedLive.name || 'Live quiz'}</h3>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">Submitted {dateText(selectedLive.submittedAt)}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-black ${selectedLive.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {selectedLive.status === 'completed' ? `Rank #${selectedLive.rank}` : 'Result not declared'}
                                        </span>
                                    </div>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-4">
                                        <div className="rounded-xl bg-white p-3"><p className="text-[10px] font-black uppercase text-slate-400">Score</p><p className="mt-1 text-xl font-black text-violet-700">{Number(selectedLive.score || 0).toFixed(1)}</p></div>
                                        <div className="rounded-xl bg-white p-3"><p className="text-[10px] font-black uppercase text-slate-400">Correct</p><p className="mt-1 text-xl font-black text-emerald-600">{selectedLive.correctAnswers}/{selectedLive.totalQuestions}</p></div>
                                        <div className="rounded-xl bg-white p-3"><p className="text-[10px] font-black uppercase text-slate-400">Time used</p><p className="mt-1 text-xl font-black text-slate-800">{timeText(selectedLive.elapsedSeconds)}</p></div>
                                        <div className="flex items-end"><button type="button" disabled={selectedLive.status !== 'completed' || rankLoading} onClick={() => void openRank(selectedLive)} className="w-full rounded-xl bg-[#5141c7] px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-[#4332ae] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">{rankLoading ? 'Loading rank…' : selectedLive.status === 'completed' ? 'View live rank' : 'Rank pending'}</button></div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="mt-6 rounded-2xl bg-violet-50 px-5 py-10 text-center text-sm font-bold text-slate-400">No live quiz activity yet.</p>
                    )}
                </section>
            </div>

            {rankResult && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4" onClick={() => setRankResult(null)}>
                    <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4">
                            <div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Public live rank</p><h2 className="mt-1 text-2xl font-black text-slate-900">Quiz final results</h2></div>
                            <button type="button" onClick={() => setRankResult(null)} className="rounded-lg px-3 py-1 text-2xl font-light text-slate-400 hover:bg-slate-100">×</button>
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-2xl bg-violet-50 p-4"><p className="text-xs font-black text-violet-500">Your rank</p><p className="mt-1 text-2xl font-black text-violet-700">#{rankResult.history.rank}</p></div>
                            <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-black text-emerald-600">Your score</p><p className="mt-1 text-2xl font-black text-emerald-700">{Number(rankResult.history.score || 0).toFixed(1)}</p></div>
                            <div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs font-black text-blue-600">Time used</p><p className="mt-1 text-2xl font-black text-blue-700">{timeText(rankResult.history.elapsedSeconds)}</p></div>
                        </div>
                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                            <div className="grid grid-cols-[64px_1fr_90px_90px] bg-[#5141c7] px-4 py-3 text-xs font-black uppercase tracking-wider text-white"><span>Rank</span><span>Participant</span><span>Score</span><span>Time</span></div>
                            <div className="max-h-[55vh] overflow-y-auto">
                                {(rankResult.participants || []).map((person) => (
                                    <div key={`${person.userId}-${person.rank}`} className={`grid grid-cols-[64px_1fr_90px_90px] items-center border-t px-4 py-3 text-sm ${person.rank === rankResult.history.rank ? 'bg-emerald-50 font-black text-emerald-700' : 'border-slate-100 text-slate-700'}`}>
                                        <span>#{person.rank}</span><span className="min-w-0"><span className="block truncate">{userLabel(person)}{person.rank === rankResult.history.rank ? ' (You)' : ''}</span><span className="mt-0.5 block truncate text-[10px] font-semibold opacity-60">ID: {person.userId}</span></span><span>{Number(person.score || 0).toFixed(1)}</span><span>{timeText(person.elapsedSeconds)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="mt-3 text-xs font-semibold text-slate-400">Participant information is shown only in this live-quiz public rank list.</p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <Link href={`/test?liveTestId=${encodeURIComponent(selectedLive?.liveTestId || '')}&historyId=${encodeURIComponent(selectedLive?._id || '')}&viewResult=1`} className="flex-1 rounded-xl bg-[#5141c7] px-4 py-3 text-center text-sm font-black text-white">View solution</Link>
                            <button type="button" onClick={() => setRankResult(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
