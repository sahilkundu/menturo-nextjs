'use client'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Book,
    X
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
import { showPopupMessage } from '../utils/popup'
import TestSeriesInfo from './TestSeriesInfo'
import PaymentSummary from './PaymentSummary'
type Props = {
    series: any
}

export default function TestSection({ series }: Props) {
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [openSolutionId, setOpenSolutionId] =
        useState<string | null>(null)
    const [loadingTestId, setLoadingTestId] =
        useState<string | null>(null)
    const actionLoadingRef =
        useRef(false)
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
        loadingTests,
        isFetchingMore,
        testsBySubjectMap,
        fetchTestsBySubject,
        testsPaginationBySubject,
        clearStore,
    } = useTestSeriesStore()


    // const [selectedSubject, setSelectedSubject] =
    //     useState('all')
    // Load saved subject from localStorage on initial render
    const [selectedSubject, setSelectedSubject] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`selected_subject_${series?._id}`)
            return saved || 'all'
        }
        return 'all'
    })

    // Save to localStorage whenever subject changes
    useEffect(() => {
        if (series?._id && selectedSubject) {
            localStorage.setItem(`selected_subject_${series._id}`, selectedSubject)
        }
    }, [selectedSubject, series?._id])
    const normalizedSelectedSubject =
        selectedSubject.trim().toLowerCase()

    const pagination =
        testsPaginationBySubject?.[
        series?._id
        ]?.[
        normalizedSelectedSubject
        ]

    const tests =
        testsBySubjectMap?.[
        series?._id
        ]?.[
        normalizedSelectedSubject
        ] || []


    const rowVirtualizer = useVirtualizer({
        getItemKey: (index) => tests[index]?.testId || index,
        count: tests.length,

        getScrollElement: () =>
            scrollRef.current,

        estimateSize: () => 140,

        overscan: 5
    })

    useEffect(() => {
        if (!series?._id) return

        // Check if we already have tests for current subject
        if (tests.length > 0) return

        // Get saved subject or use first subject
        const savedSubject = localStorage.getItem(`selected_subject_${series._id}`)
        const subjectToLoad = savedSubject || (series?.sub?.[0] || '').toLowerCase()

        setSelectedSubject(subjectToLoad)

        // Only fetch if tests for this subject don't exist
        const existingTests = testsBySubjectMap?.[series._id]?.[subjectToLoad]
        if (!existingTests || existingTests.length === 0) {
            fetchTestsBySubject(
                series._id,
                subjectToLoad,
                {
                    page: 1,
                    limit: 3
                }
            )
        }
    }, [series?._id]) // Remove tests.length dependency

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


                await fetchTestsBySubject(
                    series._id,
                    normalizedSelectedSubject,
                    {
                        page: pagination.currentPage + 1,
                        limit: 3
                    }
                )

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

        // if (normalizedSelectedSubject === 'all') {

        //     await fetchTests(series._id, {
        //         page: pagination.currentPage + 1,
        //         limit: 3
        //     })

        // } else {

        //     await fetchTestsBySubject(
        //         series._id,
        //         selectedSubject,
        //         {
        //             page: pagination.currentPage + 1,
        //             limit: 3
        //         }
        //     )
        // }
        await fetchTestsBySubject(
            series._id,
            normalizedSelectedSubject,
            {
                page: pagination.currentPage + 1,
                limit: 3
            }
        )
    }


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
        if (!series?.access) {
            showPopupMessage(
                "Access Denied",
                false
            )
            return
        }

        // BLOCK MULTIPLE REQUESTS

        if (loadingTestId || actionLoadingRef.current) return

        const actionKey =
            `${test.testId}-${mode}-${historyId || ''}`

        try {

            actionLoadingRef.current = true
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
                        relationId:
                            test.relationId,
                        testId:
                            test.testId,
                        ts:
                            test.ts,

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

            actionLoadingRef.current = false
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


    // Store refs for each test's dropdown and button
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!openSolutionId) return;

            const target = e.target as Node;
            const currentDropdown = dropdownRefs.current[openSolutionId];
            const currentButton = buttonRefs.current[openSolutionId];

            // Check if click is inside dropdown or its button
            if (currentDropdown?.contains(target)) return;
            if (currentButton?.contains(target)) return;

            // Click is outside - close dropdown
            setOpenSolutionId(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openSolutionId]);
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

        // <div className="m-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                    <div className="bg-slate-50 max-w-4xl w-full rounded-2xl  overflow-hidden">

                        {/* STICKY HEADER AREA */}
                        <div className="sticky top-0 z-20 bg-slate-50">

                            {/* TOP BUTTONS */}
                            <div className="p-3 sm:p-4 flex gap-2 sm:gap-3">

                                <button className="cursor-pointer bg-[#4A3F77] text-white px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm">

                                    Mock Tests

                                </button>

                                <button className="cursor-pointer bg-white border border-gray-200 text-gray-600 px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-50 transition">

                                    PYPs

                                </button>

                            </div>
                            {/* CATEGORY */}
                            <div className="px-1 pb-3">

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
                                        {(series?.sub || []).map((subject, index) => {

                                            const isActive =
                                                selectedSubject.toLowerCase() ===
                                                subject.toLowerCase()


                                            return (
                                                <button
                                                    key={index}
                                                    // onClick={async () => {

                                                    //     const normalizedSubject =
                                                    //         subject.trim().toLowerCase()

                                                    //     setSelectedSubject(normalizedSubject)

                                                    //     await fetchTestsBySubject(
                                                    //         series._id,
                                                    //         normalizedSubject,
                                                    //         {
                                                    //             page: 1,
                                                    //             limit: 3
                                                    //         }
                                                    //     )
                                                    // }}
                                                    onClick={async () => {
                                                        const normalizedSubject =
                                                            subject.trim().toLowerCase()

                                                        setSelectedSubject(normalizedSubject)

                                                        // Save to localStorage
                                                        localStorage.setItem(`selected_subject_${series._id}`, normalizedSubject)

                                                        // Check if already loaded
                                                        const alreadyLoaded = testsBySubjectMap?.[series._id]?.[normalizedSubject]?.length > 0

                                                        if (!alreadyLoaded) {
                                                            await fetchTestsBySubject(
                                                                series._id,
                                                                normalizedSubject,
                                                                {
                                                                    page: 1,
                                                                    limit: 3
                                                                }
                                                            )
                                                        }
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
                                                    {subject}
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
                            key={selectedSubject}
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
                                    position: 'relative',
                                }}
                            >

                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {

                                    const test =
                                        tests[virtualRow.index]
                                    const isAvailable = test?.av
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
                                    const isActionLocked =
                                        loadingTestId !== null
                                    const isTestSolutionLoading =
                                        loadingTestId?.startsWith(
                                            `${test.testId}-solution-`
                                        )
                                    const premiumButtonClass =
                                        `
                                            bg-[linear-gradient(135deg,#4A3F77_0%,#362D5F_100%)]
                                            text-white
                                            border
                                            border-white/15
                                            shadow-[0_10px_24px_rgba(74,63,119,0.26),inset_0_1px_0_rgba(255,255,255,0.18)]
                                            hover:bg-[#3D3466]
                                            active:scale-[0.98]
                                        `
                                    const disabledButtonClass =
                                        `
                                            cursor-not-allowed
                                            border
                                            border-[#D7D2E8]
                                            bg-[#F3F1FA]
                                            text-[#8D86A9]
                                            shadow-none
                                            pointer-events-none
                                        `
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
                                        >

                                            <div
                                                className="
                            bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFAFF_100%)]
                            border
                            border-[#E5DFF4]
                            rounded-2xl
                            m-1
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
                            shadow-[0_10px_26px_rgba(74,63,119,0.08)]
                        "
                                            >

                                                {/* LEFT */}
                                                <div className="space-y-1.5 min-w-0 w-full sm:w-auto">

                                                    <div className="flex items-center gap-2 flex-wrap">

                                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">

                                                            {test.n}

                                                        </h4>

                                                        <span className="text-[#9A4A00] text-[10px] font-bold bg-[#FFF7D6] border border-[#F59E0B]/20 px-1.5 py-0.5 rounded shrink-0">

                                                            ⚡ {(test.totalAttempt || 0)} Users

                                                        </span>

                                                    </div>

                                                    <div className="flex gap-3 text-[11px] text-[#6B647D] font-medium flex-wrap">

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

                                                    <div className="text-[11px] text-[#4A3F77] font-semibold flex items-center gap-1">

                                                        🌐 {(test.lan || []).join(', ')}

                                                    </div>

                                                </div>

                                                {/* BUTTON AREA */}
                                                {isAvailable ?
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
                                                                            isActionLocked ||
                                                                            hasRunningTest
                                                                        ) return

                                                                        handleTestAction(test)
                                                                    }}
                                                                    disabled={
                                                                        isActionLocked || hasRunningTest || !test.access
                                                                    }
                                                                    className={`
                                                                    
                    ${isActionLocked || hasRunningTest || !test.access
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
                    disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none

                    ${test.access && !isActionLocked && !hasRunningTest
                                                                            ? premiumButtonClass
                                                                            : disabledButtonClass
                                                                        }
                `}
                                                                >

                                                                    {
                                                                        isResumeLoading
                                                                            ? <Spinner size={16} />
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
                                                                                ref={(el) => {
                                                                                    if (el) buttonRefs.current[test.testId] = el;
                                                                                }}
                                                                                onClick={() => {
                                                                                    if (
                                                                                        isActionLocked ||
                                                                                        hasRunningTest
                                                                                    ) return

                                                                                    setOpenSolutionId(
                                                                                        openSolutionId === test.testId ? null : test.testId
                                                                                    )
                                                                                }}
                                                                                disabled={
                                                                                    isActionLocked || hasRunningTest
                                                                                }
                                                                                className={`
   ${isActionLocked || hasRunningTest
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

    ${isActionLocked || hasRunningTest
                                                                                        ? disabledButtonClass
                                                                                        : premiumButtonClass
                                                                                    }
    transition-all
    disabled:opacity-70
    `}

                                                                            >

                                                                                {
                                                                                    isTestSolutionLoading
                                                                                        ? <Spinner size={16} />
                                                                                        : (
                                                                                            <>
                                                                                                <span className="p-1 rounded-md text-[10px]">
                                                                                                    <Book size={15} />
                                                                                                </span>

                                                                                                <span>
                                                                                                    Solutions({test.history
                                                                                                        ?.filter(
                                                                                                            (item: any) => item.status === "submitted"
                                                                                                        ).length})
                                                                                                </span>
                                                                                            </>
                                                                                        )
                                                                                }

                                                                            </button>

                                                                            {/* DROPDOWN */}
                                                                            <div
                                                                                ref={(el) => {
                                                                                    if (el) dropdownRefs.current[test.testId] = el;
                                                                                }}
                                                                                className={`
                                                                                        absolute
                                                                                        left-0
                                                                                        bottom-0
                                                                                        ${openSolutionId === test.testId ? 'block' : 'hidden'}
                                                                                        z-50
                                                                                        w-full
                                                                                        overflow-hidden
                                                                                        bg-white
                                                                                        border
                                                                                        border-[#E5DFF4]
                                                                                        rounded-2xl
                                                                                        shadow-[0_18px_38px_rgba(74,63,119,0.22)]
                                                                                    `}
                                                                            >
                                                                                <button
                                                                                    ref={(el) => {
                                                                                        if (el) buttonRefs.current[test.testId] = el;  // ← ADD THIS LINE
                                                                                    }}
                                                                                    onClick={() => setOpenSolutionId(null)}
                                                                                    className="
        absolute
        top-1
        right-1
        z-10
        w-5
        h-5
        rounded-full
        bg-[#F5F3FF]
        text-[#4A3F77]
        hover:bg-[#EFEAFE]
        flex
        items-center
        justify-center
        cursor-pointer
    "
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                                <div
                                                                                    className="
        flex
        flex-col-reverse
        max-h-[118px]
        overflow-y-auto
        pt-8
        bg-white
        rounded-2xl

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
                                                                                                        if (isActionLocked) return

                                                                                                        handleTestAction(
                                                                                                            test,
                                                                                                            'solution',
                                                                                                            item._id
                                                                                                        )

                                                                                                    }}
                                                                                                    disabled={isActionLocked}
                                                                                                    className={`
                                            w-full
                                            text-left
                                            px-4
                                            py-2.5
                                            text-[12px]
                                            flex
                                            text-center
                                            justify-center
                                            items-center
                                            gap-2
                                            font-medium
                                            text-[#4A3F77]
                                            bg-white
                                            hover:bg-[#F8F6FF]
                                            border-b
                                            border-[#EEEAF8]
                                            last:border-b-0
                                            transition
                                            disabled:opacity-70
                                            disabled:pointer-events-none
                                         ${isActionLocked || hasRunningTest
                                                                                                            ? 'cursor-not-allowed'
                                                                                                            : 'cursor-pointer'
                                                                                                        }
                                            shrink-0
                                                                                        `}
                                                                                                >

                                                                                                    {
                                                                                                        isSolutionLoading(item._id)
                                                                                                            ? <Spinner size={16} />
                                                                                                            : (
                                                                                                                <>
                                                                                                                    <span className="h-5 w-5 rounded-full bg-[#FFF7D6] text-[#9A4A00] grid place-items-center text-[10px] font-black">
                                                                                                                        {index + 1}
                                                                                                                    </span>
                                                                                                                    Attempt {index + 1}
                                                                                                                </>
                                                                                                            )
                                                                                                    }

                                                                                                </button>
                                                                                            )
                                                                                        )}
                                                                                </div>
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
                                                                        !isActionLocked &&
                                                                        handleTestAction(test)
                                                                    }
                                                                    disabled={
                                                                        isActionLocked || !test.access
                                                                    }
                                                                    className={`

        
                   ${isActionLocked || hasRunningTest || !test.access
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
                    flex
                    justify-center
                    text-center
                    ${!isActionLocked && !hasRunningTest && test.access
                                                                            ? premiumButtonClass
                                                                            : disabledButtonClass
                                                                        }
                    transition-all
                    disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none
                `}
                                                                >

                                                                    {
                                                                        isResumeLoading
                                                                            ? <Spinner size={16} />
                                                                            : (
                                                                                <>
                                                                                    <span className="p-1 rounded-md text-[10px]">

                                                                                        {test.access && authenticated && series?.access
                                                                                            ? <Unlock size={15} />
                                                                                            : <Lock size={15} />
                                                                                        }

                                                                                    </span>
                                                                                    {series?.access &&
                                                                                        <span>
                                                                                            {authenticated ? "Test Again" : <Lock size={15} />}
                                                                                        </span>
                                                                                    }
                                                                                </>
                                                                            )
                                                                    }

                                                                </button>

                                                                {/* ========================================= */}
                                                                {/* SOLUTIONS */}
                                                                {/* ========================================= */}
                                                                {authenticated && test.history?.some(
                                                                    (h: any) => h.status === 'submitted'
                                                                ) &&
                                                                    <div
                                                                        className="relative"
                                                                    >

                                                                        <button
                                                                            onClick={() => {
                                                                                if (isActionLocked) return

                                                                                setOpenSolutionId(
                                                                                    openSolutionId === test.testId
                                                                                        ? null
                                                                                        : test.testId
                                                                                )

                                                                            }}
                                                                            disabled={isActionLocked}
                                                                            className={`
                       ${isActionLocked || hasRunningTest
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

    ${isActionLocked || hasRunningTest
                                                                                    ? disabledButtonClass
                                                                                    : premiumButtonClass
                                                                                }
    transition-all
    disabled:opacity-70
`}
                                                                        >

                                                                            {
                                                                                isTestSolutionLoading
                                                                                    ? <Spinner size={16} />
                                                                                    : (
                                                                                        <>
                                                                                            <span className="p-1 rounded-md text-[10px]">
                                                                                                <Book size={15} />
                                                                                            </span>

                                                                                            <span>
                                                                                                Solutions
                                                                                                ({test.history
                                                                                                    ?.filter(
                                                                                                        (item: any) => item.status === "submitted"
                                                                                                    ).length})
                                                                                            </span>
                                                                                        </>
                                                                                    )
                                                                            }

                                                                        </button>

                                                                        <div
                                                                            ref={(el) => {
                                                                                if (el) dropdownRefs.current[test.testId] = el;
                                                                            }}
                                                                            className={`
                                                                                        absolute
                                                                                        left-0
                                                                                        bottom-0
                                                                                        ${openSolutionId === test.testId ? 'block' : 'hidden'}
                                                                                        z-50
                                                                                        w-full
                                                                                        overflow-hidden
                                                                                        bg-white
                                                                                        border
                                                                                        border-[#E5DFF4]
                                                                                        rounded-2xl
                                                                                        shadow-[0_18px_38px_rgba(74,63,119,0.22)]
                                                                                    `}
                                                                        >
                                                                            <button

                                                                                onClick={() => setOpenSolutionId(null)}
                                                                                className="
        absolute
        top-1
        right-1
        z-10
        w-5
        h-5
        rounded-full
        bg-[#F5F3FF]
        text-[#4A3F77]
        hover:bg-[#EFEAFE]
        flex
        items-center
        justify-center
        cursor-pointer
    "
                                                                            >
                                                                                <X size={12} />
                                                                            </button>
                                                                            <div
                                                                                className="
        flex
        flex-col-reverse
        max-h-[118px]
        overflow-y-auto
         pt-8
        bg-white
        rounded-2xl

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
                                                                                                    if (isActionLocked) return

                                                                                                    handleTestAction(
                                                                                                        test,
                                                                                                        'solution',
                                                                                                        item._id
                                                                                                    )

                                                                                                }}
                                                                                                disabled={isActionLocked}
                                                                                                className={`
                                            w-full
                                            text-left
                                            px-4
                                            py-2.5
                                            text-[12px]
                                            flex
                                            text-center
                                            justify-center
                                            items-center
                                            gap-2
                                            font-medium
                                            text-[#4A3F77]
                                            bg-white
                                            hover:bg-[#F8F6FF]
                                            border-b
                                            border-[#EEEAF8]
                                            last:border-b-0
                                            transition
                                            disabled:opacity-70
                                            disabled:pointer-events-none
                                         ${isActionLocked || hasRunningTest
                                                                                                        ? 'cursor-not-allowed'
                                                                                                        : 'cursor-pointer'
                                                                                                    }
                                            shrink-0
                                                                                        `}
                                                                                            >

                                                                                                {
                                                                                                    isSolutionLoading(item._id)
                                                                                                        ? <Spinner size={16} />
                                                                                                        : (
                                                                                                            <>
                                                                                                                <span className="h-5 w-5 rounded-full bg-[#FFF7D6] text-[#9A4A00] grid place-items-center text-[10px] font-black">
                                                                                                                    {index + 1}
                                                                                                                </span>
                                                                                                                Attempt {index + 1}
                                                                                                            </>
                                                                                                        )
                                                                                                }

                                                                                            </button>
                                                                                        )
                                                                                    )}
                                                                            </div>
                                                                        </div>

                                                                    </div>}
                                                            </>

                                                        ) : (

                                                            /* ========================================= */
                                                            /* NO HISTORY => START TEST */
                                                            /* ========================================= */

                                                            <button
                                                                disabled={
                                                                    isActionLocked || !test.access
                                                                }
                                                                onClick={() =>
                                                                    test.access &&
                                                                    !isActionLocked &&
                                                                    handleTestAction(test)
                                                                }
                                                                className={`
                                                            
                ${isActionLocked || hasRunningTest || !test.access
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
                justify-center
                text-center
                ${!isActionLocked && !hasRunningTest && test.access
                                                                        ? premiumButtonClass
                                                                        : disabledButtonClass
                                                                    }
                transition-all
                disabled:opacity-70
        disabled:cursor-not-allowed
        disabled:pointer-events-none
            `}
                                                            >

                                                                {
                                                                    isResumeLoading
                                                                        ? <Spinner size={16} />
                                                                        : (
                                                                            <>
                                                                                {authenticated &&
                                                                                    <span className=" p-1 rounded-md text-[10px]">

                                                                                        {test.access && series?.access
                                                                                            ? <Unlock size={15} />
                                                                                            : <Lock size={15} />
                                                                                        }

                                                                                    </span>}
                                                                                {series?.access &&
                                                                                    <span>
                                                                                        {authenticated ?
                                                                                            "Start Test" :
                                                                                            <Lock size={15} />
                                                                                        }


                                                                                    </span>
                                                                                }
                                                                            </>
                                                                        )
                                                                }

                                                            </button>
                                                        )}

                                                    </div> :
                                                    <div
                                                        className="
                                                                    flex
                                                                    sm:flex-row
                                                                    items-stretch
                                                                    sm:items-center
                                                                    w-full
                                                                    sm:w-auto
                                                                    "
                                                    >
                                                        <button
                                                            disabled
                                                            className="
        w-full
        sm:w-auto
        px-4
        py-2
        rounded-xl

        flex
        items-center
        justify-center
        gap-2

        bg-gray-300
        text-[#4A3F77]

        opacity-70
        cursor-not-allowed
        pointer-events-none
        whitespace-nowrap
    "
                                                        >
                                                            {test?.btn}
                                                            <Lock size={14} />
                                                        </button>
                                                    </div>
                                                }
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


                {/* RIGHT SECTION */}
                <div className="lg:col-span-2 w-full min-w-0">
                    <TestSeriesInfo series={series} />
                    {/* <PaymentSummary series={series} /> */}
                </div>


            </div>

        </div >
    )
}
