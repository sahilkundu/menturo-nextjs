'use client'

import { useEffect, useState } from 'react'
import { LIVE_TEST_RESULT } from '../../../api'
import { useUserStore } from '../store/user'

type LiveTestResultModalProps = {
    result: any
    onViewSolution: () => void
    onClose?: () => void
}

const formatTime = (seconds: number) => {
    const safe = Math.max(0, Number(seconds || 0))
    const minutes = Math.floor(safe / 60)
    const remaining = safe % 60
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export default function LiveTestResultModal({
    result,
    onViewSolution,
    onClose,
}: LiveTestResultModalProps) {
    const history = result?.history || {}
    const currentUser = useUserStore((state) => state.user)
    const [participants, setParticipants] = useState<any[]>([])
    const [pagination, setPagination] = useState<any>(null)
    const [loadingMore, setLoadingMore] = useState(false)

    const mergeParticipants = (items: any[]) => {
        const merged = new Map<string, any>()
        items.forEach((item) => {
            if (item?.userId) merged.set(String(item.userId), item)
        })
        if (history.rank && currentUser?.id) {
            const userId = String(currentUser.id)
            if (!merged.has(userId)) {
                merged.set(userId, {
                    userId,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    username: currentUser.username,
                    rank: Number(history.rank),
                    score: Number(history.score || 0),
                    elapsedSeconds: Number(history.elapsedSeconds || 0),
                })
            }
        }
        return [...merged.values()].sort((left, right) => Number(left.rank || 0) - Number(right.rank || 0))
    }

    useEffect(() => {
        setParticipants(mergeParticipants(Array.isArray(result?.participants) ? result.participants : []))
        setPagination(result?.pagination || null)

        if (result?.status !== 'completed' || !history._id) return
        let cancelled = false
        const refreshFirstRankPage = async () => {
            try {
                const response = await fetch(
                    `${LIVE_TEST_RESULT}?historyId=${encodeURIComponent(history._id)}&page=1&limit=20`,
                    { credentials: 'include', cache: 'no-store' },
                )
                const data = await response.json()
                if (!cancelled && response.ok && data?.success) {
                    setParticipants(mergeParticipants(Array.isArray(data.participants) ? data.participants : []))
                    setPagination(data.pagination || null)
                }
            } catch {
                // The result already received from the page remains visible.
            }
        }
        void refreshFirstRankPage()
        return () => { cancelled = true }
    // Only refresh when this result changes; polling must not restart the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result?.status, history._id, currentUser?.id])

    const loadMoreParticipants = async () => {
        if (!history._id || loadingMore || !pagination?.hasMore) return
        setLoadingMore(true)
        try {
            const nextPage = Number(pagination.page || 1) + 1
            const response = await fetch(
                `${LIVE_TEST_RESULT}?historyId=${encodeURIComponent(history._id)}&page=${nextPage}&limit=${Number(pagination.limit || 20)}`,
                { credentials: 'include', cache: 'no-store' },
            )
            const data = await response.json()
            if (response.ok && data?.success) {
                setParticipants((current) => mergeParticipants([...current, ...(Array.isArray(data.participants) ? data.participants : [])]))
                setPagination(data.pagination || null)
            }
        } finally {
            setLoadingMore(false)
        }
    }

    if (result?.status === 'submitted' || result?.status === 'queued' || result?.status === 'processing') {
        return (
            <div className="fixed inset-0 z-[2000] grid place-items-center bg-slate-950/50 p-4">
                <div className="relative max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close result popup"
                            className="absolute right-3 top-2 rounded-full px-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                            ×
                        </button>
                    )}
                    <p className="text-lg font-black text-slate-900">Result not yet declared</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your submission is locked. After the live quiz ends, your rank and solution will be available in My activity.
                    </p>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-5 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white"
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-slate-950/50 p-4">
            <div className="relative mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close result popup"
                        className="absolute right-3 top-2 rounded-full px-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        ×
                    </button>
                )}
                <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quiz Final Results
                </p>
                <h2 className="mt-2 text-center text-2xl font-black text-slate-900">
                    Congratulations!
                </h2>
                <p className="mt-3 text-center text-4xl font-black text-amber-500">
                    #{history.rank || '—'}
                </p>
                <p className="text-center font-black text-slate-700">Rank achieved</p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Score</p>
                        <p className="text-2xl font-black text-emerald-700">{history.score ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Time</p>
                        <p className="text-2xl font-black text-blue-700">
                            {formatTime(history.elapsedSeconds)}
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-center font-semibold text-slate-700">
                    Correct answers: {history.correctAnswers || 0} / {history.totalQuestions || 0}
                </p>

                    <div className="mt-6 overflow-hidden rounded-xl border">
                        <div className="bg-slate-50 p-3 font-black">Test Series Rank List</div>
                    <div onScroll={(event) => { const target = event.currentTarget; if (target.scrollTop + target.clientHeight >= target.scrollHeight - 48) void loadMoreParticipants() }} className="max-h-[55vh] overflow-y-auto">
                    {participants.map((person: any) => (
                        <div
                            key={`${person.userId}-${person.rank}`}
                            className={`border-t p-3 font-semibold ${
                                person.rank === history.rank
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : ''
                            }`}
                        >
                            <div className="flex justify-between gap-3">
                                <span>
                                    #{person.rank} {person.firstName || person.username || 'Participant'}{' '}
                                    {person.lastName || ''}
                                    {person.rank === history.rank ? ' (You)' : ''}
                                </span>
                                <span>{person.score}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs font-medium text-slate-500">
                                <span>User ID: {person.userId}</span>
                                <span>Time: {formatTime(person.elapsedSeconds)}</span>
                            </div>
                        </div>
                    ))}
                    {loadingMore && <p className="p-3 text-center text-xs font-bold text-slate-400">Loading more students…</p>}
                    {!loadingMore && pagination && !pagination.hasMore && <p className="p-3 text-center text-xs font-bold text-slate-400">All students loaded</p>}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onViewSolution}
                    className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white"
                >
                    View Solution
                </button>
            </div>
        </div>
    )
}
