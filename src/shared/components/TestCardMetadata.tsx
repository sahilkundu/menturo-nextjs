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
import { useEffect, type ReactNode } from 'react'

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

const SkeletonLine = ({
    className = ''
}: {
    className?: string
}) => (
    <span
        className={`block animate-pulse rounded-full bg-[#DCD6EF] ${className}`}
        aria-hidden="true"
    />
)

const MetricChip = ({
    icon,
    children,
    loading,
    skeletonWidth = 'w-12'
}: {
    icon: ReactNode
    children: ReactNode
    loading: boolean
    skeletonWidth?: string
}) => (
    <span className="inline-flex h-7 min-w-0 shrink-0 items-center gap-1 rounded-full border border-[#E4DDF4] bg-white/80 px-2 text-[10px] font-extrabold text-[#5D5575] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        {icon}
        {loading ? (
            <SkeletonLine className={`h-2.5 ${skeletonWidth}`} />
        ) : (
            <span className="truncate">
                {children}
            </span>
        )}
    </span>
)

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
    const metadataLoading = useTestCardMetadataStore(
        (state) => state.loadingByKey[key] === true
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

    const pending =
        !metadata
    const showSkeleton =
        pending || metadataLoading
    const fileMetadataUnavailable =
        !metadata?.fileMetadataAvailable
    const languages = metadata?.languages?.length
        ? metadata.languages.join(', ')
        : 'N/A'
    const rankedUsers = metadata?.rankedUsers ?? 0
    const hasLeaderboard = !pending && rankedUsers > 0
    const rankTitle = !pending && metadata.hasRank
            ? `#${metadata.rank}`
            : 'Join leaderboard'
    const rankSubtitle = !pending && metadata.hasRank
            ? `${rankedUsers} ranked`
            : hasLeaderboard
                ? `${rankedUsers} ranked users`
                : 'Be the first ranked'
    const averageScore = pending
        ? ''
        : formatMarks(metadata.averageScore)

    return (
        <>
            <div className="flex w-full flex-wrap items-center gap-2">
                <h4
                    title={test.n}
                    className="min-w-0 max-w-full truncate text-xs font-bold leading-snug text-gray-900 sm:text-sm"
                >
                    {test.n}
                </h4>

                <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 text-[10px] font-bold text-amber-800">
                    <Users size={11} aria-hidden="true" />
                    {showSkeleton ? (
                        <SkeletonLine className="h-2.5 w-16 bg-amber-200/80" />
                    ) : (
                        <>
                            {metadata?.totalAttempts ?? 0} Attempts
                            <span aria-hidden="true">/</span>
                            {metadata?.totalUsers ?? 0} Users
                        </>
                    )}
                </span>

                {isDemoTest ? (
                    <span className="hidden shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-700 min-[380px]:inline-flex">
                        <Sparkles size={10} aria-hidden="true" />
                        Demo Test
                    </span>
                ) : null}
            </div>

            <div className="flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <MetricChip
                    loading={showSkeleton}
                    skeletonWidth="w-14"
                    icon={<FileQuestion size={12} aria-hidden="true" />}
                >
                    {fileMetadataUnavailable
                        ? '--'
                        : `${metadata?.totalQuestions ?? 0} Qs`}
                </MetricChip>

                <MetricChip
                    loading={showSkeleton}
                    skeletonWidth="w-12"
                    icon={<BarChart3 size={12} aria-hidden="true" />}
                >
                    {formatMarks(metadata?.lastMarks ?? 0)} Marks
                </MetricChip>

                <MetricChip
                    loading={showSkeleton}
                    skeletonWidth="w-10"
                    icon={<Clock3 size={12} aria-hidden="true" />}
                >
                    {fileMetadataUnavailable
                        ? '--'
                        : formatDuration(metadata?.durationSeconds ?? 0)}
                </MetricChip>

                <MetricChip
                    loading={showSkeleton}
                    skeletonWidth="w-9"
                    icon={<Languages size={12} aria-hidden="true" />}
                >
                    {languages}
                </MetricChip>
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
                            {showSkeleton ? (
                                <>
                                    <SkeletonLine className="mt-1 h-3 w-24 bg-[#D8C9EE]" />
                                    <SkeletonLine className="mt-1 h-2.5 w-20 bg-[#E2D8F1]" />
                                </>
                            ) : (
                                <>
                                    <span className="block truncate text-[12px] font-black leading-tight text-[#2E254B]">
                                        {rankTitle}
                                    </span>
                                    <span className="block truncate text-[10px] font-bold text-[#7B6C93]">
                                        {rankSubtitle}
                                    </span>
                                </>
                            )}
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
                            {showSkeleton ? (
                                <>
                                    <SkeletonLine className="mt-1 h-3 w-14 bg-[#CFE0F4]" />
                                    <SkeletonLine className="mt-1 h-2.5 w-24 bg-[#D9E5F5]" />
                                </>
                            ) : (
                                <>
                                    <span className="block truncate text-[12px] font-black leading-tight text-[#24304D]">
                                        {averageScore}
                                    </span>
                                    <span className="block truncate text-[10px] font-bold text-[#6B7590]">
                                        Community benchmark
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
