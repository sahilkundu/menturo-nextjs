'use client'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Book
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTestSeriesStore } from "../../shared/store/testSeriesStore"
import TestCardSkeleton from './Skeleton/TestSection/TestCardSkeleton'
import { useTestDataStore }
    from '../../shared/store/testDataStore'
import TestHeaderSkeleton from './Skeleton/TestSection/TestHeaderSkeleton'

import TestInfoSkeleton from './Skeleton/TestSection/TestInfoSkeleton'
import Spinner from './Spinner'
import { useUserStore } from '../store/user'
type Props = {
    series: any
}

export default function TestSection({ series }: Props) {
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [loadingTestId, setLoadingTestId] =
        useState<string | null>(null)
    const {
        authenticated
    } = useUserStore()
    const isAutoLoadingRef = useRef(false) // Track auto-loading state
    const {

        fetchStartTest,

        fetchResumeTest,
        fetchSolution,


    } = useTestDataStore()

    const {
        testsMap,
        fetchTests,
        loadingTests,
        isFetchingMore,
        testsPaginationBySeries,
        testsBySubjectMap,
        fetchTestsBySubject,
        testsPaginationBySubject,
        clearStore,
    } = useTestSeriesStore()

    // const tests = testsMap[series?._id] || []
    const allTests =
        testsMap[series?._id] || []

    const [selectedSubject, setSelectedSubject] =
        useState('all')
    const normalizedSelectedSubject =
        selectedSubject
            .trim()
            .toLowerCase()

    const pagination =
        normalizedSelectedSubject === 'all'

            ? testsPaginationBySeries[series?._id]

            : testsPaginationBySubject?.[
            series?._id
            ]?.[
            normalizedSelectedSubject
            ]

    const subjectTests =
        testsBySubjectMap?.[
        series?._id
        ]?.[
        normalizedSelectedSubject
        ] || []

    const tests =
        normalizedSelectedSubject === 'all'
            ? allTests
            : subjectTests
    const rowVirtualizer = useVirtualizer({
        getItemKey: (index) => tests[index]?.testId || index,
        count: tests.length,

        getScrollElement: () =>
            scrollRef.current,

        estimateSize: () => 140,

        overscan: 5
    })
    // Initial load

    useEffect(() => {
        if (!series?._id) return
        if (tests.length > 0) return

        fetchTests(series._id, {
            page: 1,
            limit: 3
        })
    }, [series])

    // Auto-load logic: load more if no scrollbar appears
    // AUTO LOAD ONLY IF CONTAINER HAS NO SCROLLBAR
    useEffect(() => {

        if (!series?._id) return

        if (loadingTests) return

        if (!pagination?.hasMore) return

        const element = scrollRef.current

        if (!element) return

        // Prevent multiple parallel auto-loads
        if (isAutoLoadingRef.current) return

        const shouldLoadMore =
            element.scrollHeight <= element.clientHeight + 20

        if (!shouldLoadMore) return

        isAutoLoadingRef.current = true

        const loadMore = async () => {

            try {

                if (normalizedSelectedSubject === 'all') {

                    await fetchTests(series._id, {
                        page: pagination.currentPage + 1,
                        limit: 3
                    })

                } else {

                    await fetchTestsBySubject(
                        series._id,
                        normalizedSelectedSubject,
                        {
                            page: pagination.currentPage + 1,
                            limit: 3
                        }
                    )
                }

            } finally {

                isAutoLoadingRef.current = false
            }
        }

        loadMore()

    }, [
        tests.length,
        pagination?.hasMore
    ])
    // Scroll-based loading
    const handleScroll = async () => {
        const element = scrollRef.current
        if (!element) return

        const isBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50
        if (!isBottom) return
        if (loadingTests) return
        if (!pagination?.hasMore) return

        if (normalizedSelectedSubject === 'all') {

            await fetchTests(series._id, {
                page: pagination.currentPage + 1,
                limit: 3
            })

        } else {

            await fetchTestsBySubject(
                series._id,
                selectedSubject,
                {
                    page: pagination.currentPage + 1,
                    limit: 3
                }
            )
        }
    }

    // Categories logic
    const categories = [

        {
            id: 1,
            name: 'All'
        },

        ...((series?.sub || []).map(
            (
                sub: string,
                index: number
            ) => ({

                id: index + 2,

                name: sub
            })
        ))
    ]

    const includedFeatures = series?.info || []



    const handleTestAction = async (
        test: any,
        mode: 'resume' | 'solution' = 'resume',
        historyId?: string
    ) => {
        if (!authenticated) {

            await fetch(
                "/redirect",
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        path:
                            window.location.pathname,
                    }),
                }
            )
            clearStore()

            router.push("/login")

            return
        }

        // BLOCK MULTIPLE REQUESTS
        if (loadingTestId) return
        const actionKey =
            `${test.testId}-${mode}-${historyId || ''}`

        try {

            setLoadingTestId(actionKey)

            // =====================================
            // SOLUTION MODE
            // =====================================

            if (mode === 'solution' && historyId) {

                const data =
                    await fetchSolution({

                        historyId
                    })

                if (data?.success) {

                    router.push("/test")
                }

                return
            }

            // =====================================
            // FIND RESUME HISTORY
            // =====================================

            const resumeHistory =
                test.history?.find(
                    (h: any) =>
                        h.status === 'resume'
                )

            // =====================================
            // RESUME TEST
            // =====================================

            if (resumeHistory) {

                const data =
                    await fetchResumeTest({

                        historyId:
                            resumeHistory._id,

                        f: 0
                    })

                if (data?.success) {

                    router.push("/test")
                }

                return
            }

            // =====================================
            // START / TEST AGAIN
            // =====================================

            const data =
                await fetchStartTest({

                    relationId:
                        test.relationId,

                    testId:
                        test.testId,

                    ts:
                        test.ts
                })

            if (data?.success) {

                router.push("/test")
            }

        } finally {

            setLoadingTestId(null)
        }
    }

    const categoryScrollRef =
        useRef<HTMLDivElement>(null)

    const [showLeftArrow, setShowLeftArrow] =
        useState(false)

    const [showRightArrow, setShowRightArrow] =
        useState(true)

    const updateCategoryArrows = () => {

        const el =
            categoryScrollRef.current

        if (!el) return

        setShowLeftArrow(
            el.scrollLeft > 10
        )

        setShowRightArrow(
            el.scrollLeft <
            el.scrollWidth - el.clientWidth - 10
        )
    }

    const scrollCategories = (
        direction: 'left' | 'right'
    ) => {

        const el =
            categoryScrollRef.current

        if (!el) return

        el.scrollBy({
            left:
                direction === 'left'
                    ? -250
                    : 250,
            behavior: 'smooth'
        })
    }

    useEffect(() => {

        updateCategoryArrows()

        const el =
            categoryScrollRef.current

        if (!el) return

        const handleWheel = (
            e: WheelEvent
        ) => {

            if (Math.abs(e.deltaY) > 0) {

                e.preventDefault()

                el.scrollLeft += e.deltaY
            }
        }

        el.addEventListener(
            'wheel',
            handleWheel,
            { passive: false }
        )

        el.addEventListener(
            'scroll',
            updateCategoryArrows
        )

        return () => {

            el.removeEventListener(
                'wheel',
                handleWheel
            )

            el.removeEventListener(
                'scroll',
                updateCategoryArrows
            )
        }

    }, [])

    if (!series) {
        return (
            <div className="m-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* LEFT */}
                    <div className="lg:col-span-3 p-3 sm:p-5 md:p-7 min-w-0">

                        <TestHeaderSkeleton />

                        <div className="bg-slate-50 max-w-4xl w-full rounded-2xl border border-gray-100 overflow-hidden mt-4">

                            <TestCardSkeleton count={3} />

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 p-3 sm:p-5 md:p-7 mt-10">

                        <TestInfoSkeleton />

                    </div>

                </div>

            </div>
        )
    }
    return (

        <div className="m-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* LEFT SECTION */}
                <div className="lg:col-span-3 p-3 sm:p-5 md:p-7 min-w-0">

                    <div className="flex items-center gap-2 mb-3 flex-wrap">

                        <span className="bg-rose-100 text-rose-700 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ Bestseller
                        </span>

                        <span className="text-yellow-500 text-[11px] sm:text-sm">
                            ★★★★★ (2.4k reviews)
                        </span>

                    </div>

                    {/* TITLE */}
                    <h2 className="text-[14px] sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight">

                        {series?.n}

                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-[13px] sm:text-base leading-relaxed mt-3 mb-4">

                        {(series?.info || [])
                            .slice(0, 2)
                            .join(' • ')}

                    </p>

                    {/* MAIN BOX */}
                    <div className="bg-slate-50 max-w-4xl w-full rounded-2xl border border-gray-100 overflow-hidden">

                        {/* STICKY HEADER AREA */}
                        <div className="sticky top-0 z-20 bg-slate-50 border-b border-gray-200">

                            {/* TOP BUTTONS */}
                            <div className="p-3 sm:p-4 flex gap-2 sm:gap-3">

                                <button className="cursor-pointer bg-sky-500 text-white px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm">

                                    Mock Tests

                                </button>

                                <button className="cursor-pointer bg-white border border-gray-200 text-gray-600 px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-50 transition">

                                    PYPs

                                </button>

                            </div>

                            {/* CATEGORY */}
                            {/* <div className="px-3 pb-3">

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

                                    <div className="p-3 bg-[#fafafa] border-b border-gray-100 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">


                                        {categories.map((category) => {

                                            const isActive =

                                                selectedSubject
                                                    .toLowerCase() ===

                                                category.name
                                                    .toLowerCase()

                                            return (

                                                <button
                                                    key={category.id}

                                                    onClick={async () => {

                                                        // =========================
                                                        // ALL
                                                        // =========================

                                                        if (
                                                            category.name === 'All'
                                                        ) {

                                                            setSelectedSubject('all')

                                                            return
                                                        }

                                                        // =========================
                                                        // SUBJECT
                                                        // =========================

                                                        const normalizedSubject =
                                                            category.name
                                                                .trim()
                                                                .toLowerCase()

                                                        setSelectedSubject(
                                                            normalizedSubject
                                                        )

                                                        // already loaded
                                                        const alreadyLoaded =
                                                            testsBySubjectMap?.[
                                                                series._id
                                                            ]?.[
                                                                normalizedSubject
                                                            ]?.length > 0

                                                        if (alreadyLoaded)
                                                            return

                                                        // backend call
                                                        await fetchTestsBySubject(
                                                            series._id,
                                                            normalizedSubject,
                                                            {
                                                                page: 1,
                                                                limit: 3
                                                            }
                                                        )
                                                    }}

                                                    className={`
                text-[11px]
                px-3
                py-1.5
                rounded
                font-medium
                whitespace-nowrap
                shrink-0
                cursor
                transition
cursor-pointer
                ${isActive
                                                            ? 'bg-slate-500 text-white'
                                                            : 'bg-white border text-gray-600'}
            `}
                                                >

                                                    {category.name}

                                                </button>
                                            )
                                        })}

                                    </div>

                                </div>

                            </div> */}
                            {/* CATEGORY */}
                            {/* CATEGORY */}
                            <div className="px-3 pb-3">

                                <div className="
        relative
        bg-white
        rounded-2xl
        border
        border-gray-200
        overflow-hidden
        shadow-sm
    ">

                                    {/* LEFT FADE */}
                                    {showLeftArrow && (
                                        <div className="
                absolute
                left-0
                top-0
                bottom-0
                z-10
                w-14
                bg-gradient-to-r
                from-white
                to-transparent
                pointer-events-none
            " />
                                    )}

                                    {/* RIGHT FADE */}
                                    {showRightArrow && (
                                        <div className="
                absolute
                right-0
                top-0
                bottom-0
                z-10
                w-14
                bg-gradient-to-l
                from-white
                to-transparent
                pointer-events-none
            " />
                                    )}

                                    {/* LEFT BUTTON */}
                                    {showLeftArrow && (

                                        <button
                                            onClick={() =>
                                                scrollCategories('left')
                                            }
                                            className="
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    z-20

                    h-8
                    w-8

                    rounded-full
                    bg-white/95

                    border
                    border-gray-200

                    shadow-md

                    flex
                    items-center
                    justify-center

                    hover:bg-[#F5F3FF]
                    hover:text-[#4A3F77]

                    transition-all
                    duration-200

                    cursor-pointer
                "
                                        >

                                            <ChevronLeft size={16} />

                                        </button>
                                    )}

                                    {/* RIGHT BUTTON */}
                                    {showRightArrow && (

                                        <button
                                            onClick={() =>
                                                scrollCategories('right')
                                            }
                                            className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    z-20

                    h-8
                    w-8

                    rounded-full
                    bg-white/95

                    border
                    border-gray-200

                    shadow-md

                    flex
                    items-center
                    justify-center

                    hover:bg-[#F5F3FF]
                    hover:text-[#4A3F77]

                    transition-all
                    duration-200

                    cursor-pointer
                "
                                        >

                                            <ChevronRight size={16} />

                                        </button>
                                    )}

                                    {/* SCROLL AREA */}
                                    <div
                                        ref={categoryScrollRef}
                                        className="
                flex
                items-center
                gap-2

                overflow-x-auto
                scroll-smooth

                px-3
                py-3

                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
            "
                                    >

                                        {categories.map((category) => {

                                            const isActive =

                                                selectedSubject
                                                    .toLowerCase() ===

                                                category.name
                                                    .toLowerCase()

                                            return (

                                                <button
                                                    key={category.id}

                                                    onClick={async () => {

                                                        // =========================
                                                        // ALL
                                                        // =========================

                                                        if (
                                                            category.name === 'All'
                                                        ) {

                                                            setSelectedSubject(
                                                                'all'
                                                            )

                                                            return
                                                        }

                                                        // =========================
                                                        // SUBJECT
                                                        // =========================

                                                        const normalizedSubject =
                                                            category.name
                                                                .trim()
                                                                .toLowerCase()

                                                        setSelectedSubject(
                                                            normalizedSubject
                                                        )

                                                        // already loaded
                                                        const alreadyLoaded =
                                                            testsBySubjectMap?.[
                                                                series._id
                                                            ]?.[
                                                                normalizedSubject
                                                            ]?.length > 0

                                                        if (alreadyLoaded)
                                                            return

                                                        // backend call
                                                        await fetchTestsBySubject(
                                                            series._id,
                                                            normalizedSubject,
                                                            {
                                                                page: 1,
                                                                limit: 3
                                                            }
                                                        )
                                                    }}

                                                    className={`
                            relative
                            shrink-0

                            px-4
                            py-2

                            rounded-xl

                            text-[12px]
                            font-semibold

                            transition-all
                            duration-200

                            cursor-pointer
                            border

                            ${isActive

                                                            ? `
                                    bg-[#4A3F77]
                                    text-white
                                    border-[#4A3F77]

                                    ring-2
                                    ring-[#E9E4FF]

                                    shadow-[0_4px_14px_rgba(74,63,119,0.35)]

                                    hover:bg-[#5B4B94]

                                    hover:shadow-[0_6px_18px_rgba(91,75,148,0.45)]

                                    hover:-translate-y-[1px]
                                `

                                                            : `
                                    bg-white
                                    text-gray-600
                                    border-gray-200

                                    hover:bg-[#F5F3FF]
                                    hover:text-[#4A3F77]
                                    hover:border-[#CFC7F3]
                                `
                                                        }
                        `}
                                                >

                                                    {category.name}

                                                </button>
                                            )
                                        })}

                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* TESTS */}
                        {/* TESTS */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="
        max-h-[650px]
        overflow-y-auto
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:w-[4px]
        [&::-webkit-scrollbar-track]:bg-indigo-100
        [&::-webkit-scrollbar-thumb]:bg-indigo-300
        [&::-webkit-scrollbar-thumb]:rounded-full
    "
                        >

                            {/* LOADING */}
                            {loadingTests && tests.length === 0 && (
                                <div className="p-3 sm:p-4">
                                    <TestCardSkeleton count={3} />
                                </div>
                            )}

                            {/* VIRTUAL CONTAINER */}
                            <div
                                style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative'
                                }}
                            >

                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {

                                    const test =
                                        tests[virtualRow.index]

                                    if (!test) return null
                                    const hasHistory =
                                        test?.history?.length > 0

                                    const hasResumeAttempt =
                                        test?.history?.some(
                                            (h: any) => h.status === 'resume'
                                        )
                                    const hasRunningTest =
                                        test?.history?.some(
                                            (h: any) => h.status === 'running'
                                        )

                                    const allSubmitted =
                                        hasHistory &&
                                        test?.history?.every(
                                            (h: any) =>
                                                h.status === 'submitted'
                                        )
                                    const isResumeLoading =
                                        loadingTestId ===
                                        `${test.testId}-resume-`

                                    const isSolutionLoading = (
                                        historyId: string
                                    ) =>
                                        loadingTestId ===
                                        `${test.testId}-solution-${historyId}`
                                    return (

                                        <div
                                            key={test.testId}
                                            ref={rowVirtualizer.measureElement}
                                            data-index={virtualRow.index}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                transform: `translateY(${virtualRow.start}px)`
                                            }}
                                            className="p-3 sm:p-4"
                                        >

                                            <div
                                                className="
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            p-3
                            sm:p-4
                            flex
                            flex-col
                            sm:flex-row
                            justify-between
                            items-start
                            sm:items-center
                            gap-3
                            transition
                            hover:shadow-md
                        "
                                            >

                                                {/* LEFT */}
                                                <div className="space-y-1.5 min-w-0 w-full sm:w-auto">

                                                    <div className="flex items-center gap-2 flex-wrap">

                                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">

                                                            {test.n}

                                                        </h4>

                                                        <span className="text-amber-500 text-[10px] font-bold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">

                                                            ⚡ {(test.totalAttempt || 0)} Users

                                                        </span>

                                                    </div>

                                                    <div className="flex gap-3 text-[11px] text-gray-400 font-medium flex-wrap">

                                                        <span>
                                                            📄 {test.totalQuestions || 0} Questions
                                                        </span>

                                                        <span>
                                                            📊 {test.totalMarks || 0} Marks
                                                        </span>

                                                        <span>
                                                            ⏱️ {test.duration || '0 Min'}
                                                        </span>

                                                    </div>

                                                    <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">

                                                        🌐 {(test.lan || []).join(', ')}

                                                    </div>

                                                </div>

                                                {/* BUTTON AREA */}
                                                <div
                                                    className="
        flex
        flex-col
        sm:flex-row
        items-stretch
        sm:items-center
        gap-2
        w-full
        sm:w-auto
    "
                                                >

                                                    {/* ========================================= */}
                                                    {/* ONLY RESUME */}
                                                    {/* if any resume exists */}
                                                    {/* ========================================= */}

                                                    {hasResumeAttempt || hasRunningTest ? (

                                                        <>
                                                            <button
                                                                onClick={() => {

                                                                    if (
                                                                        !test.access ||
                                                                        loadingTestId ||
                                                                        hasRunningTest
                                                                    ) return

                                                                    handleTestAction(test)
                                                                }}
                                                                disabled={
                                                                    loadingTestId !== null
                                                                }
                                                                className={`
                                                                    
                    ${loadingTestId || hasRunningTest
                                                                        ? 'cursor-not-allowed'
                                                                        : 'cursor-pointer'
                                                                    }
                    w-full
                    sm:w-auto
                    shrink-0
                    px-4
                    py-2
                    rounded-xl
                    text-[11px]
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    active:scale-95
                    disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none

                    ${test.access
                                                                        ? `
                            bg-[#4A3F77]
                            text-white
                            shadow-[0_4px_12px_rgba(74,63,119,0.3)]
                            hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)]
                            hover:-translate-y-0.5
                        `
                                                                        : `
                            bg-gray-300
                            text-gray-600
                            cursor-not-allowed
                        `
                                                                    }
                `}
                                                            >

                                                                {
                                                                    isResumeLoading
                                                                        ? <Spinner size={15} />
                                                                        : (
                                                                            <>
                                                                                <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                                                                    {
                                                                                        authenticated && test.access
                                                                                            ? (
                                                                                                hasRunningTest
                                                                                                    ? <Lock size={15} />
                                                                                                    : <Unlock size={15} />
                                                                                            )
                                                                                            : <Lock size={15} />
                                                                                    }

                                                                                </span>

                                                                                <span>
                                                                                    {authenticated
                                                                                        ? (
                                                                                            hasRunningTest
                                                                                                ? "Test running..."
                                                                                                : "Resume Test"
                                                                                        )
                                                                                        :
                                                                                        <Lock size={15} />
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )
                                                                }
                                                            </button>

                                                            {/* ========================================= */}
                                                            {/* SHOW SOLUTION ALSO */}
                                                            {/* if submitted + resume both exist */}
                                                            {/* ========================================= */}

                                                            {authenticated && test.history?.some(
                                                                (h: any) => h.status === 'submitted'
                                                            ) && (

                                                                    <div className="relative group w-full sm:w-auto">

                                                                        {/* SOLUTION BUTTON */}
                                                                        <button
                                                                            className={`
   ${loadingTestId || hasRunningTest
                                                                                    ? 'cursor-not-allowed'
                                                                                    : 'cursor-pointer'
                                                                                }
    w-full
    sm:w-auto
    min-w-[140px]
    h-[40px]

    px-4
    py-2
    rounded-xl
    text-[11px]

    flex
    items-center
    justify-center
    gap-2

    bg-[#4A3F77]
    text-white

    shadow-[0_4px_12px_rgba(74,63,119,0.3)]
    hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)]
    hover:-translate-y-0.5
    transition-all
    `}

                                                                        >

                                                                            <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                                                                <Book size={15} />

                                                                            </span>

                                                                            <span>

                                                                                Solutions

                                                                            </span>

                                                                        </button>

                                                                        {/* DROPDOWN */}
                                                                        <div
                                                                            className="
                            absolute
                            left-0
                            bottom-0
                            hidden
                            group-hover:flex
                            flex-col-reverse
                            z-50
                            w-full
                            max-h-[90px]
                            overflow-y-auto
                            bg-[#4A3F77]
                            border
                            border-[#5b4b94]
                            rounded-xl
                            shadow-[0_6px_18px_rgba(74,63,119,0.35)]

                            [scrollbar-width:none]
                            [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:w-0
                            [&::-webkit-scrollbar]:h-0
                        "
                                                                        >

                                                                            {test.history
                                                                                ?.filter(
                                                                                    (item: any) =>
                                                                                        item.status === 'submitted'
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        item: any,
                                                                                        index: number
                                                                                    ) => (

                                                                                        <button
                                                                                            key={item._id}
                                                                                            onClick={() => {

                                                                                                handleTestAction(
                                                                                                    test,
                                                                                                    'solution',
                                                                                                    item._id
                                                                                                )

                                                                                            }}
                                                                                            className={`
                                            w-full
                                            text-left
                                            px-4
                                            py-3
                                            text-[12px]
                                            font-medium
                                            text-white
                                            bg-[#4A3F77]
                                            hover:bg-[#5b4b94]
                                            border-b
                                            border-white/10
                                            last:border-b-0
                                            transition
                                         ${loadingTestId || hasRunningTest
                                                                                                    ? 'cursor-not-allowed'
                                                                                                    : 'cursor-pointer'
                                                                                                }
                                            shrink-0
                                                                                        `}
                                                                                        >

                                                                                            Attempt {index + 1}

                                                                                        </button>
                                                                                    )
                                                                                )}

                                                                        </div>

                                                                    </div>
                                                                )}

                                                        </>

                                                    ) : allSubmitted ? (

                                                        <>
                                                            {/* ========================================= */}
                                                            {/* TEST AGAIN */}
                                                            {/* ========================================= */}

                                                            <button
                                                                onClick={() =>
                                                                    test.access &&
                                                                    handleTestAction(test)
                                                                }
                                                                disabled={
                                                                    loadingTestId !== null
                                                                }
                                                                className={`

        
                   ${loadingTestId || hasRunningTest
                                                                        ? 'cursor-not-allowed'
                                                                        : 'cursor-pointer'
                                                                    }
                    px-4
                    py-2
                    rounded-xl
                    text-[11px]
                    flex
                    items-center
                    gap-2
                    bg-[#4A3F77]
                    text-white
                    shadow-[0_4px_12px_rgba(74,63,119,0.3)]
                    hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)]
                    hover:-translate-y-0.5
                    transition-all
                    disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none
                `}
                                                            >

                                                                {
                                                                    isResumeLoading
                                                                        ? <Spinner size={15} />
                                                                        : (
                                                                            <>
                                                                                <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                                                                    {test.access && authenticated
                                                                                        ? <Unlock size={15} />
                                                                                        : <Lock size={15} />
                                                                                    }

                                                                                </span>

                                                                                <span>
                                                                                    {authenticated ? "Test Again" : <Lock size={15} />}


                                                                                </span>
                                                                            </>
                                                                        )
                                                                }

                                                            </button>

                                                            {/* ========================================= */}
                                                            {/* SOLUTIONS */}
                                                            {/* ========================================= */}
                                                            {authenticated &&
                                                                <div className="relative group">

                                                                    <button
                                                                        className={`
                       ${loadingTestId || hasRunningTest
                                                                                ? 'cursor-not-allowed'
                                                                                : 'cursor-pointer'
                                                                            }
                        px-4
                        py-2
                        rounded-xl
                        text-[11px]
                        flex
                        items-center
                        gap-2
                        bg-[#4A3F77]
                        text-white
                        shadow-[0_4px_12px_rgba(74,63,119,0.3)]
                        hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)]
                        hover:-translate-y-0.5
                        transition-all
`}
                                                                    >

                                                                        <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                                                            <Book size={15} />

                                                                        </span>

                                                                        <span>

                                                                            Solutions

                                                                        </span>

                                                                    </button>

                                                                    <div
                                                                        className="
                        absolute
                        left-0
                        bottom-0
                        hidden
                        group-hover:flex
                        flex-col-reverse
                        z-50
                        w-[125px]
                        max-h-[90px]
                        overflow-y-auto
                        bg-[#4A3F77]
                        border
                        border-[#5b4b94]
                        rounded-xl
                        shadow-[0_6px_18px_rgba(74,63,119,0.35)]

                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:w-0
                        [&::-webkit-scrollbar]:h-0
                    "
                                                                    >

                                                                        {test.history.map(
                                                                            (
                                                                                item: any,
                                                                                index: number
                                                                            ) => (

                                                                                <button
                                                                                    key={item._id}
                                                                                    onClick={() => {

                                                                                        handleTestAction(
                                                                                            test,
                                                                                            'solution',
                                                                                            item._id
                                                                                        )

                                                                                    }}
                                                                                    disabled={
                                                                                        isSolutionLoading(item._id)
                                                                                    }
                                                                                    className={`
                                                                               
        
                                    w-full
                                    text-left
                                    px-4
                                    py-3
                                    text-[12px]
                                    font-medium
                                    text-white
                                    bg-[#4A3F77]
                                    hover:bg-[#5b4b94]
                                    border-b
                                    border-white/10
                                    last:border-b-0
                                    transition
                                   ${loadingTestId || hasRunningTest
                                                                                            ? 'cursor-not-allowed'
                                                                                            : 'cursor-pointer'
                                                                                        }
                                    shrink-0
                                    disabled:cursor-not-allowed
                                     disabled:opacity-70
                                `}
                                                                                >

                                                                                    {
                                                                                        isSolutionLoading(item._id)
                                                                                            ? (
                                                                                                <div className="flex justify-center">
                                                                                                    <Spinner size={14} />
                                                                                                </div>
                                                                                            )
                                                                                            : (
                                                                                                <>Attempt {index + 1}</>
                                                                                            )
                                                                                    }
                                                                                </button>
                                                                            )
                                                                        )}

                                                                    </div>

                                                                </div>}
                                                        </>

                                                    ) : (

                                                        /* ========================================= */
                                                        /* NO HISTORY => START TEST */
                                                        /* ========================================= */

                                                        <button
                                                            disabled={
                                                                loadingTestId !== null
                                                            }
                                                            onClick={() =>
                                                                test.access &&
                                                                handleTestAction(test)
                                                            }
                                                            className={`
                                                            
                ${loadingTestId || hasRunningTest
                                                                    ? 'cursor-not-allowed'
                                                                    : 'cursor-pointer'
                                                                }
                px-4
                py-2
                rounded-xl
                text-[11px]
                flex
                items-center
                gap-2
                bg-[#4A3F77]
                text-white
                shadow-[0_4px_12px_rgba(74,63,119,0.3)]
                hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)]
                hover:-translate-y-0.5
                transition-all
                disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none
            `}
                                                        >

                                                            {
                                                                isResumeLoading
                                                                    ? <Spinner size={15} />
                                                                    : (
                                                                        <>
                                                                            {authenticated &&
                                                                                <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                                                                    {test.access
                                                                                        ? <Unlock size={15} />
                                                                                        : <Lock size={15} />
                                                                                    }

                                                                                </span>}

                                                                            <span>
                                                                                {authenticated ?
                                                                                    "Start Test" :
                                                                                    <Lock size={15} />
                                                                                }


                                                                            </span>
                                                                        </>
                                                                    )
                                                            }

                                                        </button>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>

                            {/* FETCH MORE */}
                            {isFetchingMore && (
                                <div className="p-3 sm:p-4">
                                    <TestCardSkeleton count={2} />
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* RIGHT */}
                {/* <div className="lg:col-span-2 p-3 sm:p-5 md:p-7 mt-10">

                    <div className="bg-white rounded-2xl shadow-md border border-indigo-50 sticky top-6 overflow-hidden">

                        <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">

                            <h3 className="font-black text-gray-800 flex items-center gap-2">

                                <span className="text-indigo-600 text-xl">
                                    📋
                                </span>

                                What's Included in this Pack

                            </h3>

                        </div>

                        <div className="p-5 max-h-[550px] overflow-y-auto">

                            <div className="mb-4">

                                <div className="flex items-center gap-2">

                                    <span className="text-sm font-black">
                                        📌 All Practice Tests
                                    </span>

                                    <span className="bg-gray-200 text-[10px] px-2 rounded-full">

                                        {tests?.length || 0}

                                    </span>

                                </div>

                                <ul className="mt-3 space-y-2 text-sm text-gray-700">

                                    {includedFeatures.map(
                                        (
                                            feature: string,
                                            index: number
                                        ) => (

                                            <li
                                                key={index}
                                                className="flex gap-2 text-xs md:text-sm"
                                            >

                                                <span className="text-indigo-500">
                                                    ✓
                                                </span>

                                                {feature}

                                            </li>
                                        )
                                    )}

                                </ul>

                            </div>

                        </div>

                    </div>

                </div> */}
                {/* RIGHT SECTION */}
                <div className="lg:col-span-2 p-3 sm:p-5 md:p-7 mt-10">

                    <div className="bg-white rounded-2xl shadow-md border border-indigo-50 sticky top-6 overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">

                            <h3 className="font-black text-gray-800 flex items-center gap-2">

                                <span className="text-indigo-600 text-xl">
                                    📋
                                </span>

                                What's Included in this Pack

                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                                Updated every week · Access on any device
                            </p>

                        </div>

                        {/* CONTENT */}
                        <div className="p-5 max-h-[550px] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-indigo-100 [&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                            {/* WEEKLY FEATURES */}
                            <div className="mb-5">

                                <div className="flex items-center justify-between mb-2">

                                    <span className="font-bold text-indigo-800 text-sm">
                                        🔥 THIS WEEK (Free for all)
                                    </span>

                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                                        Live Now
                                    </span>

                                </div>

                                <div className="space-y-3">

                                    {[
                                        `${tests?.length || 0} Practice Tests`,
                                        'Weekly Grand Mock Challenge',
                                        'Detailed Solutions Included',
                                        'Performance Analytics Dashboard',
                                        'Cross Device Access',
                                        'Latest Exam Pattern Questions',
                                    ].map((item, index) => (

                                        <div
                                            key={index}
                                            className="flex justify-between items-center border-b pb-2"
                                        >

                                            <div>

                                                <p className="font-medium text-sm">
                                                    ✓ {item}
                                                </p>

                                                <p className="text-[11px] text-gray-400">
                                                    Weekly Updated
                                                </p>

                                            </div>

                                            <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                                                FREE
                                            </span>

                                        </div>
                                    ))}

                                </div>

                            </div>

                            {/* INCLUDED FEATURES */}
                            <div className="mb-4">

                                <div className="flex items-center gap-2">

                                    <span className="text-sm font-black">
                                        📌 All Practice Tests
                                    </span>

                                    <span className="bg-gray-200 text-[10px] px-2 rounded-full">

                                        {tests?.length || 0}

                                    </span>

                                </div>

                                <ul className="mt-3 space-y-2 text-sm text-gray-700">

                                    {includedFeatures.map(
                                        (
                                            feature: string,
                                            index: number
                                        ) => (

                                            <li
                                                key={index}
                                                className="flex gap-2 text-xs md:text-sm"
                                            >

                                                <span className="text-indigo-500">
                                                    ✓
                                                </span>

                                                {feature}

                                            </li>
                                        )
                                    )}

                                </ul>

                            </div>

                            {/* DEVICE ACCESS */}
                            <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border mt-3">

                                <p className="text-[12px] font-bold flex items-center gap-1">
                                    🖥️💻📱 Cross-Platform Access
                                </p>

                                <p className="text-[11px] text-gray-500 mt-1">
                                    Use your same account on Desktop, Laptop,
                                    Tablet, Mobile.
                                </p>

                                <div className="flex mt-3 gap-2 text-gray-600 text-[10px] font-medium flex-wrap">

                                    <span>✔ Windows</span>
                                    <span>✔ macOS</span>
                                    <span>✔ Android</span>
                                    <span>✔ iOS</span>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t">

                            🎓 Enroll any course & unlock full test library + weekly challenges

                        </div>

                    </div>

                </div>

            </div>

        </div >
    )
}