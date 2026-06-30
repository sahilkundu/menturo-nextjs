'use client'

import {
    BarChart3,
    Clock3,
    Crown,
    FileQuestion,
    Languages,
    Medal,
    Sparkles,
    TrendingUp,
    Users
} from 'lucide-react'
import { useEffect } from 'react'

import {
    getTestCardMetadataKey,
    useTestCardMetadataStore
} from '../store/testCardMetadataStore'

type Props = {
    seriesId: string
    test: any
    isDemoTest: boolean
}

const formatMarks = (value: number) =>
    Number.isInteger(value)
        ? String(value)
        : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')

const formatDuration = (seconds: number) => {
    if (seconds <= 0) {
        return '0 Min'
    }

    return `${Math.ceil(seconds / 60)} Min`
}

export default function TestCardMetadata({
    seriesId,
    test,
    isDemoTest
}: Props) {
    const testId = String(test?.testId || '')
    const key = getTestCardMetadataKey(
        seriesId,
        testId
    )
    const metadata = useTestCardMetadataStore(
        (state) => state.metadataByKey[key]
    )
    const fetchMetadata = useTestCardMetadataStore(
        (state) => state.fetchMetadata
    )

    useEffect(() => {
        void fetchMetadata(
            seriesId,
            testId,
            String(test?.relationId || '')
        )
    }, [fetchMetadata, seriesId, test?.relationId, testId])

    const pending = !metadata
    const valueOrPending = (
        value: string | number,
        unavailable = pending
    ) => unavailable ? '--' : value
    const fileMetadataUnavailable =
        pending || !metadata?.fileMetadataAvailable
    const languages = metadata?.languages?.length
        ? metadata.languages.join(', ')
        : pending
            ? '--'
            : 'N/A'
    const rankedUsers = metadata?.rankedUsers ?? 0
    const hasLeaderboard = !pending && rankedUsers > 0
    const rankTitle = pending
        ? '--'
        : metadata.hasRank
            ? `#${metadata.rank}`
            : 'Join leaderboard'
    const rankSubtitle = pending
        ? 'Ranking loading'
        : metadata.hasRank
            ? `${rankedUsers} ranked`
            : hasLeaderboard
                ? `${rankedUsers} ranked users`
                : 'Be the first ranked'
    const averageScore = pending
        ? '--'
        : formatMarks(metadata.averageScore)

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xs font-bold leading-snug text-gray-900 sm:text-sm">
                    {test.n}
                </h4>

                <span className="inline-flex shrink-0 items-center gap-1 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    <Users size={11} aria-hidden="true" />
                    {valueOrPending(metadata?.totalAttempts ?? 0)} Attempts
                    <span aria-hidden="true">/</span>
                    {valueOrPending(metadata?.totalUsers ?? 0)} Users
                </span>

                {isDemoTest ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                        <Sparkles size={10} aria-hidden="true" />
                        Demo Test
                    </span>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-[#6B647D]">
                <span className="inline-flex items-center gap-1">
                    <FileQuestion size={12} aria-hidden="true" />
                    {valueOrPending(
                        metadata?.totalQuestions ?? 0,
                        fileMetadataUnavailable
                    )} Questions
                </span>
                <span className="inline-flex items-center gap-1">
                    <BarChart3 size={12} aria-hidden="true" />
                    {valueOrPending(
                        formatMarks(metadata?.lastMarks ?? 0)
                    )} Marks
                </span>
                <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} aria-hidden="true" />
                    {valueOrPending(
                        formatDuration(metadata?.durationSeconds ?? 0),
                        fileMetadataUnavailable
                    )}
                </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4A3F77]">
                <Languages size={12} aria-hidden="true" />
                {languages}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl border border-[#E4D8FF] bg-[linear-gradient(135deg,#FFFBF0_0%,#FFF6D7_42%,#F8EEFF_100%)] px-3 py-2 shadow-[0_10px_22px_rgba(122,92,28,0.12)]">
                    <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-white/45 blur-sm" />
                    <div className="relative flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#FFE08A,#B983FF)] text-white shadow-[0_8px_16px_rgba(116,82,170,0.22)]">
                            {metadata?.hasRank ? (
                                <Crown size={15} aria-hidden="true" />
                            ) : (
                                <Medal size={15} aria-hidden="true" />
                            )}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#8A6A22]">
                                Leaderboard
                            </span>
                            <span className="block truncate text-[12px] font-black leading-tight text-[#2E254B]">
                                {rankTitle}
                            </span>
                            <span className="block truncate text-[10px] font-bold text-[#7B6C93]">
                                {rankSubtitle}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-[#D9E9FF] bg-[linear-gradient(135deg,#F4FAFF_0%,#EEF7FF_45%,#F7F2FF_100%)] px-3 py-2 shadow-[0_10px_22px_rgba(40,85,155,0.10)]">
                    <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-white/50 blur-sm" />
                    <div className="relative flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#48B5FF,#7867FF)] text-white shadow-[0_8px_16px_rgba(63,98,201,0.22)]">
                            <TrendingUp size={15} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#3F65A8]">
                                Average score
                            </span>
                            <span className="block truncate text-[12px] font-black leading-tight text-[#24304D]">
                                {averageScore}
                            </span>
                            <span className="block truncate text-[10px] font-bold text-[#6B7590]">
                                Community benchmark
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
