'use client'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTestSeriesStore } from "../../shared/store/testSeriesStore"
import TestCardSkeleton from './Skeleton/TestSection/TestCardSkeleton'

import TestHeaderSkeleton from './Skeleton/TestSection/TestHeaderSkeleton'

import TestInfoSkeleton from './Skeleton/TestSection/TestInfoSkeleton'
type Props = {
    series: any
}

export default function TestSection({ series }: Props) {
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement>(null)

    const isAutoLoadingRef = useRef(false) // Track auto-loading state


    const {
        testsMap,
        fetchTests,
        loadingTests,
        isFetchingMore,
        testsPaginationBySeries
    } = useTestSeriesStore()

    const tests = testsMap[series?._id] || []
    const pagination = testsPaginationBySeries[series?._id]
    const rowVirtualizer = useVirtualizer({
        count: tests.length,

        getScrollElement: () =>
            scrollRef.current,

        estimateSize: () => 120,

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
    useEffect(() => {
        if (!series?._id) return
        if (isAutoLoadingRef.current) return // Prevent multiple auto-loads
        if (loadingTests) return
        if (!pagination?.hasMore) return

        // Small delay to ensure DOM is rendered
        const timer = setTimeout(() => {
            const element = scrollRef.current
            if (!element) return

            const hasScrollbar = element.scrollHeight > element.clientHeight
            const noScrollbar = !hasScrollbar

            console.log({
                testsLength: tests.length,
                scrollHeight: element.scrollHeight,
                clientHeight: element.clientHeight,
                hasScrollbar,
                noScrollbar,
                hasMore: pagination?.hasMore,
                loadingTests
            })

            // Load more if no scrollbar AND has more tests
            if (noScrollbar && pagination?.hasMore && !loadingTests) {
                isAutoLoadingRef.current = true

                fetchTests(series._id, {
                    page: pagination.currentPage + 1,
                    limit: 3
                }).finally(() => {
                    // Reset auto-load flag after fetch completes
                    setTimeout(() => {
                        isAutoLoadingRef.current = false
                    }, 100)
                })
            }
        }, 150) // Increased delay for better DOM measurement

        return () => clearTimeout(timer)
    }, [tests.length, pagination?.currentPage, pagination?.hasMore, loadingTests, series?._id])

    // Scroll-based loading
    const handleScroll = async () => {
        const element = scrollRef.current
        if (!element) return

        const isBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50
        if (!isBottom) return
        if (loadingTests) return
        if (!pagination?.hasMore) return

        await fetchTests(series._id, {
            page: pagination.currentPage + 1,
            limit: 3
        })
    }

    // Categories logic
    const categories = [
        { id: 1, name: 'All' },
        ...(series?.tags || []).map((tag: string, index: number) => ({
            id: index + 2,
            name: tag
        }))
    ]

    const includedFeatures = series?.info || []

    const handleTestClick = (test: any) => {
        if (!test.demo) {
            alert('Proceeding to unlock...')
            return
        }
        router.push(`/test/start/${test._id}`)
    }
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
                            <div className="px-3 pb-3">

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

                                    <div className="p-3 bg-[#fafafa] border-b border-gray-100 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                                        {categories.map((category, index) => (

                                            <span
                                                key={category.id}
                                                className={`text-[11px] px-3 py-1.5 rounded font-medium whitespace-nowrap shrink-0 cursor-pointer ${index === 0
                                                    ? 'bg-slate-500 text-white'
                                                    : 'bg-white border text-gray-600'
                                                    }`}
                                            >

                                                {category.name}

                                            </span>
                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* TESTS */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="max-h-[650px] overflow-y-auto p-3 sm:p-4 space-y-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-indigo-100 [&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {/* skeleton */}

                            {loadingTests && tests.length === 0 &&

                                Array.from({ length: 3 }).map((_, index) => (

                                    <div
                                        key={`skeleton-${index}`}
                                        className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-pulse"
                                    >

                                        {/* LEFT */}
                                        <div className="space-y-3 min-w-0 w-full sm:w-auto flex-1">

                                            <div className="flex items-center gap-2 flex-wrap">

                                                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>

                                                <div className="h-5 w-20 bg-amber-100 rounded-full"></div>

                                            </div>

                                            <div className="flex gap-3 flex-wrap">

                                                <div className="h-3 w-24 bg-gray-200 rounded"></div>

                                                <div className="h-3 w-20 bg-gray-200 rounded"></div>

                                                <div className="h-3 w-16 bg-gray-200 rounded"></div>

                                            </div>

                                            <div className="h-3 w-28 bg-sky-100 rounded"></div>

                                        </div>

                                        {/* BUTTON */}
                                        <div className="w-full sm:w-[130px] h-10 bg-[#4A3F77]/20 rounded-xl shrink-0"></div>

                                    </div>
                                ))
                            }

                            {/* actual tests */}
                            {loadingTests && tests.length === 0 && (
                                <TestCardSkeleton count={3} />
                            )}
                            {tests?.map((test, index) => (

                                <div
                                    key={test._id || index}
                                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition hover:shadow-md"
                                >

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

                                    <button
                                        onClick={() =>
                                            handleTestClick(test)
                                        }
                                        className="cursor-pointer w-full sm:w-auto shrink-0 bg-[#4A3F77] text-white font-medium px-4 py-2 rounded-xl text-[11px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(74,63,119,0.3)] hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)] hover:-translate-y-0.5 transition-all active:scale-95"
                                    >

                                        <span className="bg-white/15 p-1 rounded-md text-[10px]">

                                            🔒

                                        </span>

                                        <span>

                                            {test.demo
                                                ? 'Start Demo'
                                                : 'Unlock Now'}

                                        </span>

                                    </button>

                                </div>
                            ))}
                            {isFetchingMore && (
                                <TestCardSkeleton count={3} />
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

        </div>
    )
}