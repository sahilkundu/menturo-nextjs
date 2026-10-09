'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ACTIVITY, LIVE_TEST_RESULT } from '../../../../api'
import { useUserStore } from '../../../shared/store/user'

type Profile = {
    userId: string
    username: string
    firstName: string
    lastName: string
}

type Overview = {
    coursesAttended: number
    testsAttempted: number
    overallScore: number
    overallRank: number
    totalStudents: number
}

type StudentRow = {
    rank: number
    userId: string
    name: string
    score: number
}

type ChapterRow = {
    name: string
    totalAttempts: number
    scoreObtained: number
    performance: string
    progress: number
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
    resultDeclaredAt?: number
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

const emptyProfile: Profile = { userId: '', username: '', firstName: '', lastName: '' }
const emptyOverview: Overview = { coursesAttended: 0, testsAttempted: 0, overallScore: 0, overallRank: 0, totalStudents: 0 }

const dateText = (value: number) => {
    if (!value) return '—'
    const milliseconds = value < 100000000000 ? value * 1000 : value
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(milliseconds))
}

const timeText = (value: number) => {
    const seconds = Math.max(0, Number(value || 0))
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const scoreText = (value: number) => `${Number(value || 0).toFixed(0)}%`

const userLabel = (person: RankParticipant) =>
    `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.username || 'Participant'

const initials = (profile: Profile) => {
    const name = `${profile.firstName} ${profile.lastName}`.trim() || profile.username || 'Student'
    return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('')
}

function StatCard({ icon, label, value, detail, className, selected = false }: { icon: string; label: string; value: string; detail: string; className: string; selected?: boolean }) {
    return (
        <div className={`relative min-h-[126px] overflow-hidden rounded-[14px] p-4 text-white shadow-[0_8px_18px_rgba(48,36,110,.12)] ${className} ${selected ? 'ring-2 ring-[#211b46] ring-offset-2' : ''}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base">{icon}</div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-white/90">{label}</p>
            <p className="mt-0.5 text-2xl font-black leading-none">{value}</p>
            <p className="mt-2 truncate text-[10px] font-semibold text-white/90">{detail}</p>
        </div>
    )
}

export default function ActivityPage() {
    const user = useUserStore((state) => state.user)
    const [profile, setProfile] = useState<Profile>(emptyProfile)
    const [overview, setOverview] = useState<Overview>(emptyOverview)
    const [students, setStudents] = useState<StudentRow[]>([])
    const [chapters, setChapters] = useState<ChapterRow[]>([])
    const [liveItems, setLiveItems] = useState<LiveActivity[]>([])
    const [selectedLiveId, setSelectedLiveId] = useState('')
    const [chapterFilter, setChapterFilter] = useState('All')
    const [pageTab, setPageTab] = useState<'overview' | 'live'>('overview')
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
            setProfile({ ...emptyProfile, ...(data.profile || {}) })
            setOverview({ ...emptyOverview, ...(data.overview || {}) })
            setStudents(Array.isArray(data.students) ? data.students : [])
            setChapters(Array.isArray(data.chapters) ? data.chapters : [])
            setLiveItems(nextLive)
            setSelectedLiveId((current) => current || nextLive[0]?._id || '')
        })()
        activityRequest.current = request
        try { await request } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Unable to load activity')
        } finally {
            setLoading(false)
            if (activityRequest.current === request) activityRequest.current = null
        }
    }, [])

    useEffect(() => { void loadActivity() }, [loadActivity])

    const selectedLive = useMemo(() => liveItems.find((item) => item._id === selectedLiveId) || null, [liveItems, selectedLiveId])
    const visibleChapters = useMemo(() => chapterFilter === 'All' ? chapters : chapters.filter((chapter) => chapter.name === chapterFilter), [chapterFilter, chapters])
    const ownerName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Student'
    const avatarText = initials(profile.userId ? profile : { ...profile, username: user?.username || '' })

    const openRank = async (item: LiveActivity) => {
        if (!item.liveTestId || item.status !== 'completed') return
        setRankLoading(true)
        setRankResult(null)
        try {
            const response = await fetch(`${LIVE_TEST_RESULT}?historyId=${encodeURIComponent(item._id)}`, { credentials: 'include', cache: 'no-store' })
            const data = await response.json()
            if (!response.ok || !data?.success) throw new Error(data?.message || 'Rank is not available')
            setRankResult(data)
        } catch (rankError) {
            setError(rankError instanceof Error ? rankError.message : 'Rank is not available')
        } finally { setRankLoading(false) }
    }

    return (
        <main className="min-h-screen bg-[#f8f8fc] px-2 py-3 text-[#17204b] sm:px-4 sm:py-5">
            <div className="mx-auto max-w-[1580px] space-y-4">
                <section className="rounded-[16px] border border-[#dfe2f3] bg-[linear-gradient(110deg,#fff_0%,#fbfbff_57%,#eeeaff_100%)] px-5 py-5 shadow-[0_4px_16px_rgba(51,55,120,.04)] sm:px-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#efb99f] text-lg font-black text-[#513225] shadow-inner sm:h-14 sm:w-14">{avatarText || 'S'}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5741d9]">Your learning overview</p>
                                <h1 className="mt-1 text-xl font-black leading-tight text-[#17204b] sm:text-2xl">{ownerName}</h1>
                                <p className="mt-1 text-xs font-semibold text-[#77809f]">User ID: {profile.userId || user?.id || '—'} · {user?.type || 'Student'}</p>
                                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#eee9ff] px-3 py-2 text-xs font-black text-[#5036d1]">
                                    <span>🏆</span> Overall rank <strong>#{overview.overallRank || '—'}</strong> <span className="font-semibold">of {overview.totalStudents || 0} students</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-[14px] border border-[#e0e2f2] bg-white/75 p-4 lg:max-w-[530px]">
                            <div className="flex items-center justify-between text-xs font-black text-[#66708e]"><span>Overall performance</span><strong className="text-2xl text-[#5036d1]">{scoreText(overview.overallScore)}</strong></div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8e9f4]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#5950e5,#1dbf91)]" style={{ width: `${Math.min(100, Math.max(0, Number(overview.overallScore || 0)))}%` }} /></div>
                            <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#7a829d]"><span>{overview.testsAttempted} tests attempted</span><span>{overview.coursesAttended} courses attended</span></div>
                        </div>
                    </div>
                </section>

                {error && <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"><span>{error}</span><button type="button" onClick={() => void loadActivity()} className="rounded-lg bg-rose-600 px-3 py-2 text-xs text-white">Retry</button></div>}

                <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon="🎓" label="Total Courses Attended" value={loading ? '—' : String(overview.coursesAttended)} detail="Your learning courses" className="bg-[linear-gradient(135deg,#6552f5,#4d35e9)]" />
                    <StatCard icon="▤" label="Total Tests Attempted" value={loading ? '—' : String(overview.testsAttempted)} detail="Completed test attempts" className="bg-[linear-gradient(135deg,#08ca94,#00af7d)]" />
                    <StatCard icon="🏆" label="My Rank" value={loading ? '—' : `#${overview.overallRank || '—'}`} detail={`Among ${overview.totalStudents || 0} students`} className="bg-[linear-gradient(135deg,#ffb52a,#f79416)]" selected />
                    <StatCard icon="◎" label="My Score" value={loading ? '—' : scoreText(overview.overallScore)} detail="Overall performance" className="bg-[linear-gradient(135deg,#f83f78,#ef1e65)]" />
                </section>

                <div className="flex flex-wrap gap-2 border-b border-[#dfe2f3] pb-2">
                    <button type="button" onClick={() => setPageTab('overview')} className={`rounded-xl px-4 py-2.5 text-sm font-black ${pageTab === 'overview' ? 'bg-[#5743d8] text-white shadow-lg shadow-violet-200' : 'bg-white text-[#657092]'}`}>My overview</button>
                    <button type="button" onClick={() => setPageTab('live')} className={`rounded-xl px-4 py-2.5 text-sm font-black ${pageTab === 'live' ? 'bg-[#5743d8] text-white shadow-lg shadow-violet-200' : 'bg-white text-[#657092]'}`}>Live test activity {liveItems.length > 0 && `(${liveItems.length})`}</button>
                    <button type="button" onClick={() => void loadActivity()} disabled={loading} className="ml-auto rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#5743d8] disabled:opacity-50">{loading ? 'Loading…' : 'Refresh'}</button>
                </div>

                {pageTab === 'overview' ? (
                    <div className="space-y-4">
                        <section className="rounded-[16px] border border-[#dfe2f3] bg-white p-3 shadow-[0_4px_16px_rgba(51,55,120,.04)] sm:p-4">
                            <div className="mb-3"><h2 className="text-lg font-black text-[#17204b]">Overall score · All students</h2><p className="mt-1 text-xs font-semibold text-[#7b84a3]">A dynamic comparison of completed test performance.</p></div>
                            <div className="overflow-x-auto rounded-xl border border-[#e4e6f0]">
                                <table className="w-full min-w-[560px] text-left text-xs"><thead className="bg-[#f5f6fb] text-[10px] font-black uppercase tracking-wide text-[#697392]"><tr><th className="px-3 py-3">Metric rank</th><th className="px-3 py-3">Student</th><th className="px-3 py-3">Overall score</th></tr></thead><tbody>{students.map((student) => <tr key={`${student.userId}-${student.rank}`} className={`border-t border-[#edf0f6] ${student.userId === (profile.userId || user?.id) ? 'bg-[#f2efff]' : ''}`}><td className="px-3 py-3"><span className="rounded-lg bg-[#eef0f8] px-2 py-1 font-black text-[#26315c]">#{student.rank}</span></td><td className="px-3 py-3 font-black text-[#26315c]">{student.name}{student.userId === (profile.userId || user?.id) && <span className="ml-2 rounded bg-[#dfd8ff] px-2 py-1 text-[9px] text-[#5538d4]">You</span>}</td><td className="px-3 py-3 font-black text-[#5036d1]">{scoreText(student.score)}</td></tr>)}</tbody></table>
                                {!loading && students.length === 0 && <p className="px-4 py-8 text-center text-sm font-bold text-[#8b93ab]">No student ranking data available yet.</p>}
                            </div>
                        </section>

                        <section className="rounded-[16px] border border-[#dfe2f3] bg-white p-3 shadow-[0_4px_16px_rgba(51,55,120,.04)] sm:p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-black text-[#17204b]">Chapter-wise attempts &amp; scores</h2><p className="mt-1 text-xs font-semibold text-[#7b84a3]">Your attempts and score in each learning chapter.</p></div><span className="rounded-lg bg-[#eee9ff] px-3 py-2 text-[10px] font-black text-[#573bd5]">{chapters.reduce((sum, chapter) => sum + Number(chapter.totalAttempts || 0), 0)} total attempts</span></div>
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1"><button type="button" onClick={() => setChapterFilter('All')} className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black ${chapterFilter === 'All' ? 'bg-[#5743d8] text-white' : 'bg-[#f2f1fb] text-[#667092]'}`}>All chapters</button>{chapters.map((chapter) => <button type="button" key={chapter.name} onClick={() => setChapterFilter(chapter.name)} className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black ${chapterFilter === chapter.name ? 'bg-[#5743d8] text-white' : 'bg-[#f2f1fb] text-[#667092]'}`}>{chapter.name}</button>)}</div>
                            <div className="mt-2 overflow-x-auto rounded-xl border border-[#e4e6f0]"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[#f5f6fb] text-[10px] font-black uppercase tracking-wide text-[#697392]"><tr><th className="px-3 py-3">Chapter</th><th className="px-3 py-3">Total attempts</th><th className="px-3 py-3">Score obtained</th><th className="px-3 py-3">Performance</th><th className="px-3 py-3">Progress</th></tr></thead><tbody>{visibleChapters.map((chapter) => <tr key={chapter.name} className="border-t border-[#edf0f6]"><td className="px-3 py-3 font-black text-[#26315c]">{chapter.name}</td><td className="px-3 py-3 font-semibold text-[#26315c]">{chapter.totalAttempts}</td><td className="px-3 py-3"><span className="rounded-lg bg-emerald-50 px-3 py-2 font-black text-emerald-700">{scoreText(chapter.scoreObtained)}</span></td><td className="px-3 py-3 font-semibold text-[#26315c]">{chapter.performance}</td><td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-2 w-20 overflow-hidden rounded-full bg-[#e7eaf4]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#11be8b,#5276e8)]" style={{ width: `${Math.min(100, Math.max(0, Number(chapter.progress || 0)))}%` }} /></div><span className="font-semibold text-[#445079]">{scoreText(chapter.progress)}</span></div></td></tr>)}</tbody></table>{!loading && visibleChapters.length === 0 && <p className="px-4 py-8 text-center text-sm font-bold text-[#8b93ab]">No chapter activity available yet.</p>}</div>
                        </section>
                    </div>
                ) : (
                    <section className="rounded-[16px] border border-[#dfe2f3] bg-white p-3 shadow-[0_4px_16px_rgba(51,55,120,.04)] sm:p-4">
                        <div><h2 className="text-lg font-black text-[#17204b]">Live test activity</h2><p className="mt-1 text-xs font-semibold text-[#7b84a3]">Your live-test score and rank history.</p></div>
                        <div className="mt-4 overflow-x-auto rounded-xl border border-[#e4e6f0]"><table className="w-full min-w-[800px] text-left text-xs"><thead className="bg-[#f5f6fb] text-[10px] font-black uppercase tracking-wide text-[#697392]"><tr><th className="px-3 py-3">Live test</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Score</th><th className="px-3 py-3">Rank</th><th className="px-3 py-3">Time used</th><th className="px-3 py-3">Action</th></tr></thead><tbody>{liveItems.map((item) => <tr key={item._id} className="border-t border-[#edf0f6]"><td className="px-3 py-3 font-black text-[#26315c]">{item.name || 'Live test'}</td><td className="px-3 py-3 font-semibold text-[#687292]">{dateText(item.submittedAt)}</td><td className="px-3 py-3 font-black text-[#5036d1]">{item.status === 'completed' ? scoreText(item.score) : '—'}</td><td className="px-3 py-3 font-black text-[#26315c]">{item.status === 'completed' ? `#${item.rank || '—'}` : 'Pending'}</td><td className="px-3 py-3 font-semibold text-[#687292]">{timeText(item.elapsedSeconds)}</td><td className="px-3 py-3"><button type="button" disabled={item.status !== 'completed' || rankLoading} onClick={() => void openRank(item)} className="rounded-lg bg-[#5743d8] px-3 py-2 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">{rankLoading && selectedLiveId === item._id ? 'Loading…' : item.status === 'completed' ? 'View rank' : 'Result pending'}</button></td></tr>)}</tbody></table>{!loading && liveItems.length === 0 && <p className="px-4 py-10 text-center text-sm font-bold text-[#8b93ab]">No live test activity yet.</p>}</div>
                    </section>
                )}
            </div>

            {rankResult && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4" onClick={() => setRankResult(null)}><div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Public live rank</p><h2 className="mt-1 text-2xl font-black text-slate-900">Quiz final results</h2></div><button type="button" onClick={() => setRankResult(null)} className="rounded-lg px-3 py-1 text-2xl font-light text-slate-400 hover:bg-slate-100">×</button></div><div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="rounded-2xl bg-violet-50 p-4"><p className="text-xs font-black text-violet-500">Your rank</p><p className="mt-1 text-2xl font-black text-violet-700">#{rankResult.history.rank}</p></div><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-black text-emerald-600">Your score</p><p className="mt-1 text-2xl font-black text-emerald-700">{Number(rankResult.history.score || 0).toFixed(1)}</p></div><div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs font-black text-blue-600">Time used</p><p className="mt-1 text-2xl font-black text-blue-700">{timeText(rankResult.history.elapsedSeconds)}</p></div></div><div className="mt-6 overflow-hidden rounded-2xl border border-slate-100"><div className="grid grid-cols-[64px_1fr_90px_90px] bg-[#5141c7] px-4 py-3 text-xs font-black uppercase tracking-wider text-white"><span>Rank</span><span>Participant</span><span>Score</span><span>Time</span></div><div className="max-h-[55vh] overflow-y-auto">{(rankResult.participants || []).map((person) => <div key={`${person.userId}-${person.rank}`} className={`grid grid-cols-[64px_1fr_90px_90px] items-center border-t px-4 py-3 text-sm ${person.rank === rankResult.history.rank ? 'bg-emerald-50 font-black text-emerald-700' : 'border-slate-100 text-slate-700'}`}><span>#{person.rank}</span><span className="min-w-0 truncate">{userLabel(person)}{person.rank === rankResult.history.rank ? ' (You)' : ''}</span><span>{Number(person.score || 0).toFixed(1)}</span><span>{timeText(person.elapsedSeconds)}</span></div>)}</div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Link href={`/test?liveTestId=${encodeURIComponent(selectedLive?.liveTestId || '')}&historyId=${encodeURIComponent(selectedLive?._id || '')}&viewResult=1`} className="flex-1 rounded-xl bg-[#5141c7] px-4 py-3 text-center text-sm font-black text-white">View solution</Link><button type="button" onClick={() => setRankResult(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600">Close</button></div></div></div>}
        </main>
    )
}
