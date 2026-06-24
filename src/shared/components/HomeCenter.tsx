'use client'

import { useTestSeriesStore } from "../../shared/store/testSeriesStore"
import { useWSStore } from "../utils/wsStore"
import Header from "./Header"
import TestCard from "./TestCard"
import { useRef, useEffect, useCallback, useMemo, useState } from "react"
import TestCardSkeleton from "./Skeleton/TestCardSkeleton"
import { useUserStore } from "../store/user"


export default function HomeCenter() {
    const authType =
        useWSStore(
            (state) => state.authType
        )
    const guestId =
        useWSStore(
            (state) => state.guestId
        )
    const sliderRef = useRef<HTMLDivElement | null>(null)
    const [showSkeleton, setShowSkeleton] =
        useState(false)
    const fetchedRef =
        useRef(false)
    // MOVE STORE HERE
    const seriesMap =
        useTestSeriesStore(
            (state) => state.seriesMap
        )
    const fetchSeries =
        useTestSeriesStore(
            (state) => state.fetchSeries
        )
    const pagination =
        useTestSeriesStore(
            (state) =>
                state.seriesPaginationByTag['']
        )
    const loadingSeries =
        useTestSeriesStore(
            (state) => state.loadingSeries
        )
    const status =
        useWSStore(
            (state) => state.status
        )
    const userId =
        useWSStore(
            (state) => state.userId
        )
    const loadingUser =
        useUserStore(
            (state) => state.loading
        )
    const scrollLeft = useCallback(() => {

        sliderRef.current?.scrollBy({
            left: -320,
            behavior: "smooth"
        })
    }, [])

    const scrollRight = useCallback(() => {

        sliderRef.current?.scrollBy({
            left: 320,
            behavior: "smooth"
        })
    }, [])
    // =====================================================
    // AUTO LOAD ON SCROLL END
    // =====================================================

    const isFetchingRef = useRef(false)

    const handleSliderScroll = () => {

        if (!sliderRef.current) return

        if (loadingSeries) return

        if (isFetchingRef.current) return

        const el = sliderRef.current

        // USER HAS NOT SCROLLED YET
        if (el.scrollLeft <= 0) return

        const remainingScroll =
            el.scrollWidth -
            el.scrollLeft -
            el.clientWidth

        if (remainingScroll <= 20) {

            if (!pagination?.hasMore) return

            void loadMore()
        }
    }

    useEffect(() => {

        if (!loadingSeries) {

            isFetchingRef.current = false
        }

    }, [loadingSeries])
    // =====================================================
    // STORE
    // =====================================================



    // =====================================================
    // SERIES ARRAY
    // =====================================================

    const visibleSeries =
        useMemo(
            () =>
                Object.values(seriesMap)
                    .filter(
                        (item: any) =>
                            item &&
                            item._id &&
                            item.n
                    ),
            [seriesMap]
        )
    const shouldShowCardSkeleton =
        visibleSeries.length === 0 &&
        (
            loadingSeries ||
            loadingUser ||
            !fetchedRef.current
        )
    // const series =
    //     Object.values(seriesMap)
    //         .sort((a: any, b: any) => {

    //             const hartronA =
    //                 a?.n?.toLowerCase()
    //                     .includes("hartron data entry operator")

    //             const hartronB =
    //                 b?.n?.toLowerCase()
    //                     .includes("hartron data entry operator")

    //             if (hartronA && !hartronB) return -1

    //             if (!hartronA && hartronB) return 1

    //             return 0
    //         })
    // =====================================================
    // PAGINATION
    // =====================================================

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        // =====================================
        // LOAD ONLY ONCE
        // =====================================

        if (
            fetchedRef.current
        ) {
            return
        }

        if (
            visibleSeries.length === 0
        ) {

            fetchedRef.current = true

            fetchSeries({

                page: 1,

                limit: 5
            })
        }

    }, [
        status,
        authType,
        guestId,
        userId,
        visibleSeries.length,
        fetchSeries
    ])
    // =====================================================
    // LOAD MORE
    // =====================================================

    const loadMore =
        useCallback(async () => {

            if (loadingSeries) return

            if (isFetchingRef.current) return

            if (!pagination) return

            if (!pagination.hasMore) return

            isFetchingRef.current = true

            try {

                await fetchSeries({
                    page: pagination.currentPage + 1,
                    limit: 5
                })

            } finally {

                isFetchingRef.current = false
            }

        }, [
            pagination,
            loadingSeries,
            fetchSeries
        ])

    // =====================================================
    // AUTO LOAD IF NO SCROLLBAR
    // =====================================================


    useEffect(() => {

        const timer =
            setTimeout(() => {

                setShowSkeleton(
                    loadingSeries
                )

            }, loadingSeries ? 0 : 300)

        return () => {

            clearTimeout(timer)

        }

    }, [loadingSeries])

    useEffect(() => {

        const element = sliderRef.current

        if (!element) return

        if (loadingSeries) return

        if (!pagination?.hasMore) return

        const frame =
            requestAnimationFrame(() => {

                const cardCount =
                    element.querySelectorAll(
                        '[data-test-card]'
                    ).length

                if (cardCount === 0) return

                const hasHorizontalScrollbar =
                    element.scrollWidth >
                    element.clientWidth + 1

                if (!hasHorizontalScrollbar) {

                    void loadMore()
                }
            })

        return () => {

            cancelAnimationFrame(frame)
        }

    }, [
        visibleSeries.length,
        loadingSeries,
        pagination?.currentPage,
        pagination?.hasMore,
        loadMore
    ])
    return (
        <>
            {/* <!-- MAIN --> */}
            <div className="w-full min-h-screen p-3 lg:p-4">

                <div className="">

                    <div className="flex gap-4 items-start">



                        {/* <!-- CENTER --> */}
                        <div className="flex-1 min-w-0">

                            {/* <!-- HERO --> */}
                            <div className="relative overflow-hidden rounded-[12px]">

                                {/* <!-- BG --> */}
                                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1800&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover" />

                                {/* <!-- OVERLAY --> */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#111827e8] to-[#6d28d9cc]"></div>

                                {/* <!-- BIG TEXT --> */}
                                <h1 className="absolute top-0 left-7 text-[70px] font-black text-white/10 hidden lg:block">
                                    EDUCATION
                                </h1>
                                <Header />
                            </div>

                            {/* <!-- COURSE SECTION --> */}
                            <div className="mt-5 bg-white dark-card rounded-[30px] p-1 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden">





                                {/* <!-- SLIDER TOP --> */}
                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="p-4 font-semibold dark-text">
                                        Popular Courses
                                    </h3>

                                    <div className="p-4 flex gap-2">

                                        <button
                                            onClick={scrollLeft}
                                            className="
        w-9
        h-9
        rounded-xl
        border
        border-gray-200
        hover:bg-gray-100
        transition-all
    "
                                        >
                                            ‹
                                        </button>

                                        <button
                                            onClick={scrollRight}
                                            className="
        w-9
        h-9
        rounded-xl
        border
        border-gray-200
        hover:bg-gray-100
        transition-all
    "
                                        >
                                            ›
                                        </button>

                                    </div>

                                </div>

                                {/* <!-- SLIDER --> */}
                                {/* <!-- SECTION --> */}
                                <div className="  bg-white dark-card rounded-[32px] p-3 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden ">

                                    {/* <!-- TOP --> */}
                                    <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-6">

                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2
                                                    className="text-2xl font-black dark-text bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 bg-clip-text text-transparent">
                                                    Popular Govt Exam Test Series
                                                </h2>
                                                <span
                                                    className="text-[11px] font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <i className="fas fa-gift text-[10px]"></i> Buy 1 Get 1 Demo Free
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark-sub flex items-center gap-1">
                                                <i className="fas fa-trophy text-amber-500 text-[12px]"></i> SSC, HSSC, HPSC, UPSC,
                                                Railway & State Exams
                                            </p>
                                        </div>

                                        {/* <!-- BUTTONS --> */}

                                    </div>




                                    <div
                                        ref={sliderRef}
                                        onScroll={handleSliderScroll}
                                        className="
    flex
    items-stretch
    gap-4
    overflow-x-auto
    overflow-y-hidden
    pb-1
    scroll-smooth
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
"
                                    >

                                        {
                                            visibleSeries
                                                .map((item: any) => (
                                                    <div
                                                        key={item._id}
                                                        data-test-card
                                                        className="w-[240px] flex-shrink-0"
                                                    >
                                                        <TestCard
                                                            access={item?.access}
                                                            av={item?.av !== false}
                                                            key={item._id}
                                                            slug={item._id}
                                                            board={item.tags?.[0] || "TEST"}
                                                            liveName={
                                                                item.demo
                                                                    ? "Demo"
                                                                    : "Live"
                                                            }
                                                            name={item.n}
                                                            totalTest={`${item?.plans?.[0]?.allowedAttempt || 0} Attempts`}
                                                            totalPrice={
                                                                item?.plans?.[0]?.price
                                                                    ? `₹${item.plans[0].price}`
                                                                    : "₹0"
                                                            }
                                                            offerPrice={
                                                                item?.plans?.[0]?.offerPrice
                                                                    ? `₹${item.plans[0].offerPrice}`
                                                                    : "₹0"
                                                            }
                                                            demoInfo={
                                                                item?.access?.message?.displayMessage ||
                                                                (
                                                                    item.demo
                                                                        ? "Free Demo Available"
                                                                        : "Premium Test Series"
                                                                )
                                                            }
                                                            demoHead={
                                                                item.demo
                                                                    ? "Demo Free"
                                                                    : "Premium"
                                                            }
                                                            btnName={
                                                                item?.av === false
                                                                    ? item?.btnName
                                                                    : undefined
                                                            }
                                                            img={item.i}
                                                            btnBgColor="
                bg-violet-50
                hover:bg-violet-100
            "
                                                            btnTxtColor="
                text-violet-700
            "
                                                        />
                                                    </div>
                                                ))
                                        }


                                        {
                                            (
                                                shouldShowCardSkeleton ||
                                                showSkeleton
                                            ) && (
                                                <>
                                                    <TestCardSkeleton count={shouldShowCardSkeleton ? 4 : 3} />
                                                </>
                                            )
                                        }

                                    </div>

                                    {/* <StateCard
                                        states={[
                                            {
                                                stateName: "🇮🇳 Haryana (HSSC / CET)",
                                                value: "haryana",

                                                exams: [

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },
                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },
                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },
                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },
                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-blue-100",
                                                        statusText: "text-blue-700",

                                                        title: "Haryana Police",

                                                        posts: "6,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-red-100",
                                                        statusText: "text-red-600",

                                                        title: "HPSC Assistant Professor",

                                                        posts: "2,400",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    }

                                                ]
                                            },
                                            {
                                                stateName: "🇮🇳 Haryana (HSSC / CET)",
                                                value: "haryana",

                                                exams: [

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-blue-100",
                                                        statusText: "text-blue-700",

                                                        title: "Haryana Police",

                                                        posts: "6,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-red-100",
                                                        statusText: "text-red-600",

                                                        title: "HPSC Assistant Professor",

                                                        posts: "2,400",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    }

                                                ]
                                            },
                                            {
                                                stateName: "🇮🇳 Haryana (HSSC / CET)",
                                                value: "haryana",

                                                exams: [

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-blue-100",
                                                        statusText: "text-blue-700",

                                                        title: "Haryana Police",

                                                        posts: "6,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-red-100",
                                                        statusText: "text-red-600",

                                                        title: "HPSC Assistant Professor",

                                                        posts: "2,400",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    }

                                                ]
                                            }
                                        ]}
                                    /> */}


                                </div>


                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </>
    )
}
