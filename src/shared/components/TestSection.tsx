'use client'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Book,
    History,
    RotateCcw,
    Trash2,
    X
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import {
    hideRouteLoader,
    showRouteLoader
} from '../utils/routeLoader'
import { goToLoginAfterRememberingPage } from '../utils/loginRedirect'
import TestSeriesInfo from './TestSeriesInfo'
import PaymentSummary from './PaymentSummary'
import { DELETE_TEST_ATTEMPT } from '../../../api'
type Props = {
    series: any
}

type AttemptDeletionRequest = {
    attempt: number
    deleteAll: boolean
    key: string
    test: any
}

const getSelectedSubjectKey = (
    seriesId: string
) => `selected_subject_${seriesId}`

const getRestoreSubjectKey = (
    seriesId: string
) => `restore_selected_subject_${seriesId}`

const getDefaultSubject = (
    series: any
) => {
    const subjects =
        series?.sub || []

    const allSubject =
        subjects.find(
            (subject: string) =>
                subject.trim().toLowerCase() === 'all'
        )

    return (
        allSubject ||
        subjects[0] ||
        'all'
    )
        .trim()
        .toLowerCase()
}

const isTrue = (
    value: unknown
) =>
    value === true ||
    value === "true" ||
    value === 1

const hasSeriesAccess = (
    access: any
) => {
    if (typeof access === "boolean") {
        return access
    }

    return (
        isTrue(access?.access) ||
        isTrue(access?.canAccess)
    )
}

const getSeriesAccessMessage = (
    access: any
) => {
    if (
        typeof access?.message?.displayMessage === "string" &&
        access.message.displayMessage.trim()
    ) {
        return access.message.displayMessage
    }

    if (
        typeof access?.message === "string" &&
        access.message.trim()
    ) {
        return access.message
    }

    return "Access Denied"
}

export default function TestSection({ series }: Props) {
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [openSolutionId, setOpenSolutionId] =
        useState<string | null>(null)
    const [loadingTestId, setLoadingTestId] =
        useState<string | null>(null)
    const [deletingAttemptKey, setDeletingAttemptKey] =
        useState<string | null>(null)
    const [pendingAttemptDeletion, setPendingAttemptDeletion] =
        useState<AttemptDeletionRequest | null>(null)
    const actionLoadingRef =
        useRef(false)
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const isAutoLoadingRef = useRef(false) // Track auto-loading state
    const fetchStartTest =
        useTestDataStore(
            (state) => state.fetchStartTest
        )
    const fetchResumeTest =
        useTestDataStore(
            (state) => state.fetchResumeTest
        )
    const fetchSolution =
        useTestDataStore(
            (state) => state.fetchSolution
        )

    const loadingTests =
        useTestSeriesStore(
            (state) => state.loadingTests
        )
    const isFetchingMore =
        useTestSeriesStore(
            (state) => state.isFetchingMore
        )
    const testsBySubjectMap =
        useTestSeriesStore(
            (state) => state.testsBySubjectMap
        )
    const fetchTestsBySubject =
        useTestSeriesStore(
            (state) => state.fetchTestsBySubject
        )
    const testsPaginationBySubject =
        useTestSeriesStore(
            (state) => state.testsPaginationBySubject
        )
    const clearStore =
        useTestSeriesStore(
            (state) => state.clearStore
        )


    const [selectedSubject, setSelectedSubject] =
        useState('all')

    // Save to localStorage whenever subject changes
    useEffect(() => {
        if (series?._id && selectedSubject) {
            localStorage.setItem(
                getSelectedSubjectKey(series._id),
                selectedSubject
            )
        }
    }, [selectedSubject, series?._id])
    const normalizedSelectedSubject =
        useMemo(
            () =>
                selectedSubject.trim().toLowerCase(),
            [selectedSubject]
        )

    const pagination =
        testsPaginationBySubject?.[
        series?._id
        ]?.[
        normalizedSelectedSubject
        ]

    const tests =
        useMemo(
            () =>
                testsBySubjectMap?.[
                series?._id
                ]?.[
                normalizedSelectedSubject
                ] || [],
            [
                normalizedSelectedSubject,
                series?._id,
                testsBySubjectMap
            ]
        )
    const seriesCanAccess =
        hasSeriesAccess(
            series?.access
        )
    const seriesAvailable =
        series?.av !== false
    const seriesAccessMessage =
        getSeriesAccessMessage(
            series?.access
        )


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

        const selectedSubjectKey =
            getSelectedSubjectKey(series._id)

        const restoreSubjectKey =
            getRestoreSubjectKey(series._id)

        const shouldRestoreSubject =
            sessionStorage.getItem(restoreSubjectKey) === '1'

        const savedSubject =
            localStorage.getItem(selectedSubjectKey)

        const subjectToLoad =
            shouldRestoreSubject && savedSubject
                ? savedSubject
                : getDefaultSubject(series)

        sessionStorage.removeItem(restoreSubjectKey)

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
    }, [series?._id])

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

    const refreshCurrentTests =
        async () => {
            await fetchTestsBySubject(
                series._id,
                normalizedSelectedSubject,
                {
                    page: 1,
                    limit: Math.max(
                        pagination?.loaded || 3,
                        3
                    )
                }
            )
        }

    const handleDeleteAttempt = (
        test: any,
        deleteAll = false
    ) => {
        if (!authenticated) {
            showPopupMessage(
                'Please login to delete attempts',
                false
            )
            return
        }

        const attempt =
            Number(test?.attemptUsed || 0)

        if (!deleteAll && attempt <= 0) {
            showPopupMessage(
                'No attempt available to delete',
                false
            )
            return
        }

        const key =
            `${test.testId}-${deleteAll ? 'all' : attempt}`

        if (deletingAttemptKey) {
            return
        }

        setPendingAttemptDeletion({
            attempt,
            deleteAll,
            key,
            test
        })
    }

    const confirmDeleteAttempt = async () => {
        if (!pendingAttemptDeletion) {
            return
        }

        const {
            attempt,
            deleteAll,
            key,
            test
        } = pendingAttemptDeletion

        try {
            setDeletingAttemptKey(key)

            const response =
                await fetch(
                    DELETE_TEST_ATTEMPT,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            testId: test.testId,
                            ts: test.ts,
                            deleteAll,
                            attempt
                        })
                    }
                )

            const data =
                await response.json()

            if (!data?.success) {
                showPopupMessage(
                    data?.message ||
                    'Unable to delete attempt',
                    false
                )
                return
            }

            showPopupMessage(
                data?.message ||
                'Attempt deleted',
                true
            )

            await refreshCurrentTests()
        } catch (_) {
            showPopupMessage(
                'Unable to delete attempt',
                false
            )
        } finally {
            setDeletingAttemptKey(null)
            setPendingAttemptDeletion(null)
        }
    }



    const handleTestAction = async (
        test: any,
        mode: 'resume' | 'solution' = 'resume',
        historyId?: string
    ) => {
        if (!authenticated) {
            clearStore()
            await goToLoginAfterRememberingPage(router)

            return
        }
        if (mode !== 'solution' && !seriesAvailable) {
            showPopupMessage(
                'Series Disabled',
                false
            )
            return
        }
        if (mode !== 'solution' && test?.av === false) {
            showPopupMessage(
                'Test Disabled',
                false
            )
            return
        }
        if (
            mode !== 'solution' &&
            !seriesCanAccess &&
            !test?.access
        ) {
            showPopupMessage(
                seriesAccessMessage,
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
            showRouteLoader()

            // =====================================
            // SOLUTION MODE
            // =====================================

            if (mode === 'solution' && historyId) {

                const data =
                    await fetchSolution({

                        historyId
                    })

                if (data?.success) {

                    sessionStorage.setItem(
                        getRestoreSubjectKey(series._id),
                        '1'
                    )

                    router.push("/test")
                }
                else {
                    hideRouteLoader()

                    showPopupMessage(
                        data?.message ||
                        'Failed to load solution',
                        false
                    )
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

                    sessionStorage.setItem(
                        getRestoreSubjectKey(series._id),
                        '1'
                    )

                    router.push("/test")
                }
                else {
                    hideRouteLoader()

                    showPopupMessage(
                        data?.message ||
                        'Failed to resume test',
                        false
                    )
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

                sessionStorage.setItem(
                    getRestoreSubjectKey(series._id),
                    '1'
                )

                router.push("/test")
            }
            else {
                hideRouteLoader()

                showPopupMessage(
                    data?.message ||
                    'Failed to start test',
                    false
                )
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

            {pendingAttemptDeletion ? (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="attempt-delete-title"
                >
                    <button
                        type="button"
                        aria-label="Close delete confirmation"
                        disabled={Boolean(deletingAttemptKey)}
                        onClick={() => setPendingAttemptDeletion(null)}
                        className="absolute inset-0 cursor-default bg-[#1F1B2D]/55 backdrop-blur-sm"
                    />

                    <div className="relative w-full max-w-[430px] overflow-hidden rounded-lg border border-[#E8DDE0] bg-white shadow-[0_24px_70px_rgba(31,27,45,0.30)]">
                        <div className="h-1 bg-red-600" />

                        <div className="p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                                    {pendingAttemptDeletion.deleteAll ? (
                                        <RotateCcw size={21} aria-hidden="true" />
                                    ) : (
                                        <Trash2 size={21} aria-hidden="true" />
                                    )}
                                </div>

                                <button
                                    type="button"
                                    title="Close"
                                    aria-label="Close delete confirmation"
                                    disabled={Boolean(deletingAttemptKey)}
                                    onClick={() => setPendingAttemptDeletion(null)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#777085] transition-colors hover:bg-[#F3F0F7] hover:text-[#312A49] disabled:opacity-50"
                                >
                                    <X size={17} aria-hidden="true" />
                                </button>
                            </div>

                            <h2
                                id="attempt-delete-title"
                                className="mt-4 text-lg font-bold text-[#2B2638]"
                            >
                                {pendingAttemptDeletion.deleteAll
                                    ? 'Reset all attempts?'
                                    : `Delete attempt ${pendingAttemptDeletion.attempt}?`}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#6B647D]">
                                {pendingAttemptDeletion.deleteAll
                                    ? 'This permanently removes every attempt for this test. Your next start will be Attempt 1.'
                                    : 'This permanently removes your latest attempt. Earlier attempts remain available.'}
                            </p>

                            <div className="mt-5 flex items-center justify-between border-y border-[#EEEAF5] py-3 text-xs">
                                <span className="font-medium text-[#777085]">
                                    {pendingAttemptDeletion.deleteAll
                                        ? 'Attempts to remove'
                                        : 'Attempt to remove'}
                                </span>
                                <span className="font-bold text-[#332C48]">
                                    {pendingAttemptDeletion.deleteAll
                                        ? `${pendingAttemptDeletion.attempt} attempts`
                                        : `Attempt ${pendingAttemptDeletion.attempt}`}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    disabled={Boolean(deletingAttemptKey)}
                                    onClick={() => setPendingAttemptDeletion(null)}
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#D9D3E7] bg-white px-4 text-sm font-semibold text-[#4D465E] transition-colors hover:bg-[#F6F3FA] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Keep attempts
                                </button>

                                <button
                                    type="button"
                                    disabled={Boolean(deletingAttemptKey)}
                                    onClick={() => void confirmDeleteAttempt()}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(220,38,38,0.22)] transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deletingAttemptKey === pendingAttemptDeletion.key ? (
                                        <Spinner size={15} />
                                    ) : pendingAttemptDeletion.deleteAll ? (
                                        <RotateCcw size={15} aria-hidden="true" />
                                    ) : (
                                        <Trash2 size={15} aria-hidden="true" />
                                    )}
                                    {deletingAttemptKey === pendingAttemptDeletion.key
                                        ? 'Deleting...'
                                        : pendingAttemptDeletion.deleteAll
                                            ? 'Reset all attempts'
                                            : 'Delete attempt'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}


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
                                                        localStorage.setItem(
                                                            getSelectedSubjectKey(series._id),
                                                            normalizedSubject
                                                        )

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
                                    const isAvailable =
                                        seriesAvailable &&
                                        test?.av !== false
                                    if (!test) return null
                                    const isDemoTest =
                                        isTrue(test?.demo)
                                    const attemptUsed =
                                        Number(test?.attemptUsed || 0)
                                    const attemptLimit =
                                        Number(test?.attemptLimit || 12)
                                    const attemptsRemaining =
                                        Math.max(
                                            attemptLimit - attemptUsed,
                                            0
                                        )
                                    const attemptProgress =
                                        attemptLimit > 0
                                            ? Math.min(
                                                (attemptUsed / attemptLimit) * 100,
                                                100
                                            )
                                            : 0
                                    const isAttemptLimitReached =
                                        attemptLimit > 0 &&
                                        attemptUsed >= attemptLimit
                                    const deleteLatestKey =
                                        `${test.testId}-${attemptUsed}`
                                    const deleteAllKey =
                                        `${test.testId}-all`
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
                                                <div className="min-w-0 w-full space-y-1.5 sm:flex-1">

                                                    <div className="flex items-center gap-2 flex-wrap">

                                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">

                                                            {test.n}

                                                        </h4>

                                                        <span className="text-[#9A4A00] text-[10px] font-bold bg-[#FFF7D6] border border-[#F59E0B]/20 px-1.5 py-0.5 rounded shrink-0">

                                                            ⚡ {(test.totalAttempt || 0)} Users

                                                        </span>

                                                        {isDemoTest ? (
                                                            <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                                                                Demo Test
                                                            </span>
                                                        ) : null}

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

                                                    <div className="flex w-full max-w-[560px] flex-col gap-2 border-l-2 border-[#DDD6F1] pl-3 pt-0.5">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold">
                                                                <History
                                                                    size={14}
                                                                    className={isAttemptLimitReached
                                                                        ? 'text-red-600'
                                                                        : 'text-[#4A3F77]'}
                                                                />
                                                                <span className="text-[#49425D]">
                                                                    Attempt tracking
                                                                </span>
                                                                <span className={isAttemptLimitReached
                                                                    ? 'text-red-700'
                                                                    : 'text-emerald-700'}>
                                                                    {attemptUsed} of {attemptLimit} used
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E9E5F3]"
                                                                aria-label={`${attemptUsed} of ${attemptLimit} attempts used`}
                                                            >
                                                                <div
                                                                    className={`h-full rounded-full transition-[width] duration-300 ${isAttemptLimitReached
                                                                        ? 'bg-red-500'
                                                                        : 'bg-emerald-500'}`}
                                                                    style={{ width: `${attemptProgress}%` }}
                                                                />
                                                            </div>

                                                            <p className="mt-1 text-[10px] font-medium text-[#837C96]">
                                                                {isAttemptLimitReached
                                                                    ? 'Attempt limit reached. Remove an attempt to continue.'
                                                                    : `${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining`}
                                                            </p>
                                                        </div>

                                                        {authenticated && attemptUsed > 0 ? (
                                                            <div
                                                                className="flex shrink-0 items-center gap-1.5"
                                                                role="group"
                                                                aria-label="Attempt deletion actions"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    title={`Delete latest attempt ${attemptUsed}`}
                                                                    disabled={Boolean(deletingAttemptKey)}
                                                                    onClick={() =>
                                                                        handleDeleteAttempt(test)
                                                                    }
                                                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 text-[10px] font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                                >
                                                                    <Trash2 size={13} aria-hidden="true" />
                                                                    {deletingAttemptKey === deleteLatestKey
                                                                        ? 'Deleting...'
                                                                        : 'Delete latest'}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    title="Delete all attempts and reset this test"
                                                                    disabled={Boolean(deletingAttemptKey)}
                                                                    onClick={() =>
                                                                        handleDeleteAttempt(test, true)
                                                                    }
                                                                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-700 bg-red-600 px-2.5 text-[10px] font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                                >
                                                                    <RotateCcw size={13} aria-hidden="true" />
                                                                    {deletingAttemptKey === deleteAllKey
                                                                        ? 'Deleting...'
                                                                        : 'Reset all'}
                                                                </button>
                                                            </div>
                                                        ) : null}
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
                                                                            isActionLocked ||
                                                                            hasRunningTest ||
                                                                            (authenticated && !test.access)
                                                                        ) return

                                                                        handleTestAction(test)
                                                                    }}
                                                                    disabled={
                                                                        isActionLocked || hasRunningTest || (authenticated && !test.access)
                                                                    }
                                                                    className={`
                                                                    
                    ${isActionLocked || hasRunningTest || (authenticated && !test.access)
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

                    ${(!authenticated || test.access) && !isActionLocked && !hasRunningTest
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
                                                                                            : "Login to Resume"
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
                                                                        (!authenticated || test.access) &&
                                                                        !isActionLocked &&
                                                                        !isAttemptLimitReached &&
                                                                        handleTestAction(test)
                                                                    }
                                                                    disabled={
                                                                        isActionLocked ||
                                                                        (authenticated && !test.access) ||
                                                                        isAttemptLimitReached
                                                                    }
                                                                    className={`

        
                   ${isActionLocked || hasRunningTest || (authenticated && !test.access) || isAttemptLimitReached
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
                    ${!isActionLocked && !hasRunningTest && (!authenticated || test.access) && !isAttemptLimitReached
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

                                                                                        {test.access && authenticated
                                                                                            ? <Unlock size={15} />
                                                                                            : <Lock size={15} />
                                                                                        }

                                                                                    </span>
                                                                                    {(!authenticated || test.access) &&
                                                                                        <span>
                                                                                            {authenticated
                                                                                                ? isAttemptLimitReached
                                                                                                    ? "Limit Reached"
                                                                                                    : "Test Again"
                                                                                                : "Login to Retry"}
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
                                                                    isActionLocked || (authenticated && !test.access)
                                                                }
                                                                onClick={() =>
                                                                    (!authenticated || test.access) &&
                                                                    !isActionLocked &&
                                                                    handleTestAction(test)
                                                                }
                                                                className={`
                                                            
                ${isActionLocked || hasRunningTest || (authenticated && !test.access)
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
                ${!isActionLocked && !hasRunningTest && (!authenticated || test.access)
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

                                                                                        {test.access
                                                                                            ? <Unlock size={15} />
                                                                                            : <Lock size={15} />
                                                                                        }

                                                                                    </span>}
                                                                                {(!authenticated || test.access) &&
                                                                                    <span>
                                                                                        {authenticated ?
                                                                                            "Start Test" :
                                                                                            "Login to Start"
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
