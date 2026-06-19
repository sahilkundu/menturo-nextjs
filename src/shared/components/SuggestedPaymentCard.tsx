'use client'

import { useRef, useEffect, useCallback, useMemo } from 'react'

import { useTestSeriesStore }
    from "../store/testSeriesStore"

import SuggestedPaymentCardSkeleton
    from "./Skeleton/SuggestedPaymentCardSkeleton"

interface SuggestedPaymentCardProps {
    excludeSeriesId?: string
}

export default function SuggestedPaymentCard({
    excludeSeriesId
}: SuggestedPaymentCardProps) {

    // ======================================================
    // REFS
    // ======================================================

    const scrollRef =
        useRef<HTMLDivElement>(null)

    const autoLoadingRef =
        useRef(false)

    // ======================================================
    // STORE
    // ======================================================

    const seriesMap =
        useTestSeriesStore(
            (state) => state.seriesMap
        )
    const fetchSeries =
        useTestSeriesStore(
            (state) => state.fetchSeries
        )
    const loadingSeries =
        useTestSeriesStore(
            (state) => state.loadingSeries
        )
    const pagination =
        useTestSeriesStore(
            (state) =>
                state.seriesPaginationByTag['']
        )

    // ======================================================
    // DATA
    // ======================================================

    const cards =
        useMemo(
            () =>
                Object
                    .values(seriesMap)
                    .filter(
                        (series: any) =>
                            series._id !== excludeSeriesId
                    ),
            [
                excludeSeriesId,
                seriesMap
            ]
        )

    // ======================================================
    // INITIAL FETCH
    // ======================================================

    useEffect(() => {

        // if (cards.length > 0) return

        fetchSeries({
            page: 1,
            limit: 6
        })

    }, [fetchSeries])

    // ======================================================
    // AUTO LOAD IF NO SCROLLBAR
    // ======================================================

    useEffect(() => {

        if (!pagination?.hasMore) return

        if (loadingSeries) return

        if (autoLoadingRef.current) return

        const timer =
            setTimeout(() => {

                const element =
                    scrollRef.current

                if (!element) return

                const noVerticalScroll =
                    element.scrollHeight <=
                    element.clientHeight

                if (noVerticalScroll) {

                    autoLoadingRef.current =
                        true

                    fetchSeries({
                        page:
                            pagination.currentPage + 1,

                        limit: 6
                    }).finally(() => {

                        setTimeout(() => {

                            autoLoadingRef.current =
                                false

                        }, 100)
                    })
                }

            }, 150)

        return () =>
            clearTimeout(timer)

    }, [
        cards.length,
        loadingSeries,
        pagination?.currentPage,
        pagination?.hasMore
    ])

    // ======================================================
    // SCROLL FETCH
    // ======================================================

    const handleScroll =
        useCallback(async () => {

            const element =
                scrollRef.current

            if (!element) return

            const isMobile =
                window.innerWidth < 768

            let reachedEnd = false

            // =========================================
            // MOBILE → HORIZONTAL
            // =========================================

            if (isMobile) {

                reachedEnd =
                    element.scrollLeft +
                    element.clientWidth >=
                    element.scrollWidth - 100
            }

            // =========================================
            // DESKTOP → VERTICAL
            // =========================================

            else {

                reachedEnd =
                    element.scrollTop +
                    element.clientHeight >=
                    element.scrollHeight - 100
            }

            if (!reachedEnd) return

            if (loadingSeries) return

            if (!pagination?.hasMore) return

            await fetchSeries({
                page:
                    pagination.currentPage + 1,

                limit: 6
            })
        }, [
            fetchSeries,
            loadingSeries,
            pagination?.currentPage,
            pagination?.hasMore
        ])

    // ======================================================
    // MOBILE BUTTON SCROLL
    // ======================================================

    const scrollLeft = useCallback(() => {

        if (scrollRef.current) {

            scrollRef.current.scrollBy({
                left: -320,
                behavior: 'smooth',
            })
        }
    }, [])

    const scrollRight = useCallback(() => {

        if (scrollRef.current) {

            scrollRef.current.scrollBy({
                left: 320,
                behavior: 'smooth',
            })
        }
    }, [])

    // ======================================================
    // INITIAL SKELETON
    // ======================================================

    if (

        cards.length === 0
    ) {
        return (
            <SuggestedPaymentCardSkeleton
                count={4}
            />
        )
    }

    return (

        <div className="m-3 lg:col-span-2 space-y-6 overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 flex-wrap">

                <div>

                    <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-gray-900">

                        <span className="bg-indigo-600 w-2 h-7 rounded-full"></span>

                        🔥 Other Premium Test Series

                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1">

                        Choose your exam pack. One-time payment gets full access.

                    </p>

                </div>

                {/* MOBILE SLIDER */}
                <div className="flex gap-2 md:hidden">

                    <button
                        onClick={scrollLeft}
                        className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ‹
                    </button>

                    <button
                        onClick={scrollRight}
                        className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ›
                    </button>

                </div>

            </div>

            {/* CARDS */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                    flex
                    md:grid
                    md:grid-cols-2
                    gap-4

                    overflow-x-auto
                    md:overflow-x-hidden
                    md:overflow-y-auto

                    max-h-[650px]

                    scroll-smooth

                    scrollbar-thin
                    scrollbar-thumb-indigo-300
                    scrollbar-track-indigo-100

                    pb-2
                "
            >

                {cards.flatMap((series: any) =>

                    (series.plans || []).map((plan: any) => {

                        const discountPercent = Math.round(
                            (
                                (
                                    plan.price -
                                    plan.offerPrice
                                ) /
                                plan.price
                            ) * 100
                        )

                        return (

                            <div
                                key={`${series._id}-${plan.planID}`}
                                className="
                                    min-w-[300px]
                                    sm:min-w-[340px]
                                    md:min-w-0

                                    bg-white
                                    rounded-3xl
                                    shadow-md
                                    border
                                    border-gray-100
                                    overflow-hidden
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-xl
                                "
                            >

                                <div className="p-5">

                                    {/* TOP */}
                                    <div className="flex justify-between items-start gap-2">

                                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full">

                                            🔥 Popular

                                        </span>

                                        <span className="text-yellow-500 text-xs">

                                            ⭐⭐⭐⭐⭐

                                        </span>

                                    </div>

                                    {/* PLAN NAME */}
                                    {/* <h4 className="text-xl font-black mt-4 text-gray-900">

                                        {plan.name}

                                    </h4> */}
                                    {/* PLAN NAME + DURATION */}
                                    <div className="flex items-start justify-between gap-3 mt-4">

                                        <h4 className="text-xl font-black text-gray-900 leading-tight">

                                            {plan.name}

                                        </h4>

                                        <span className="
        shrink-0
        bg-indigo-100
        text-indigo-700
        text-[11px]
        font-bold
        px-3
        py-1
        rounded-full
    ">

                                            {plan.duration}

                                        </span>

                                    </div>

                                    {/* SERIES */}
                                    <p className="text-indigo-600 text-xs font-semibold mt-1">

                                        {series.n}

                                    </p>

                                    {/* TAGLINE */}
                                    <p className="text-gray-500 text-sm leading-relaxed mt-2">

                                        {plan.tagline}

                                    </p>

                                    {/* PRICE */}
                                    <div className="flex items-center gap-2 mt-5 flex-wrap">

                                        <span className="text-3xl font-black text-indigo-700">

                                            ₹{plan.offerPrice}

                                        </span>

                                        <span className="text-gray-400 line-through text-sm">

                                            ₹{plan.price}

                                        </span>

                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">

                                            {discountPercent}% OFF

                                        </span>

                                    </div>

                                    {/* FEATURES */}
                                    <div className="mt-5 space-y-2 text-xs text-gray-600">

                                        <div className="flex items-center gap-2">

                                            <span>✅</span>

                                            <span>
                                                {plan.duration}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <span>✅</span>

                                            <span>
                                                {plan.allowedAttempt} Attempts
                                            </span>

                                        </div>

                                        {(series.info || [])
                                            .slice(0, 3)
                                            .map((feature: string, index: number) => (

                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >

                                                    <span>✅</span>

                                                    <span>{feature}</span>

                                                </div>

                                            ))}

                                    </div>

                                    {/* BUTTON */}
                                    <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md transition">

                                        Enroll Now

                                    </button>

                                </div>

                            </div>
                        )
                    })
                )}

                {/* LOADING MORE */}
                {loadingSeries && cards.length > 0 && (

                    <SuggestedPaymentCardSkeleton
                        count={2}
                    />

                )}

            </div>

        </div>
    )
}
