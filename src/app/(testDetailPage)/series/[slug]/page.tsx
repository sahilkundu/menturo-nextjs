'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTestSeriesStore } from "../../../../shared/store/testSeriesStore"
import { useTestDataStore } from '../../../../shared/store/testDataStore'
import { useUserStore } from '../../../../shared/store/user'
import { SAVE_TEST } from '../../../../../api'
import SeriesPaymentPage from '../../../../shared/components/SeriesPaymentPage'
import {
    createSeriesSlug,
    extractSeriesIdFromSlug,
} from '../../../../shared/seo'
import AdSenseAd from '../../../../shared/components/AdSenseAd'
const PaymentSummary = dynamic(
    () => import(
        "../../../../shared/components/PaymentSummary"
    )
)

const SuggestedPaymentCard = dynamic(
    () => import(
        "../../../../shared/components/SuggestedPaymentCard"
    ),
    {
        ssr: false
    }
)

const TestSection = dynamic(
    () => import(
        "../../../../shared/components/TestSection"
    )
)

const PaymentSummarySkeleton = dynamic(
    () => import(
        '../../../../shared/components/Skeleton/PaymentSummarySkeleton'
    )
)

const isTrue = (value: any) => {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true'
    }

    return value === true || value === 1
}

const hasActiveSeriesAccess = (access: any) => {
    if (!access) {
        return false
    }

    return access === true || (
        isTrue(access?.access) ||
        isTrue(access?.canAccess)
    )
}

const toTextList = (value: unknown) =>
    Array.isArray(value)
        ? value
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim())
        : []

function SeriesSeoContent({ series }: { series: any }) {
    if (!series?.n) {
        return null
    }

    const examName = String(series.n).trim()
    const subjects = toTextList(series.sub)
    const tags = toTextList(series.tags)
    const subjectText = subjects.length
        ? subjects.slice(0, 5).join(', ')
        : 'important exam subjects'
    const tagText = tags.length
        ? tags.slice(0, 4).join(', ')
        : 'government exam preparation'
    const testCount = Array.isArray(series.info)
        ? series.info.length
        : 0
    return (
        <section className="rounded-[24px] border border-[#E2DDF3] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,.05)] sm:p-6 lg:p-8">
            <div className="max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5B21B6]">
                    Online test series
                </p>
                <h1 className="mt-2 text-2xl font-black leading-tight text-[#171426] sm:text-3xl">
                    {examName} Mock Test Series 2026
                </h1>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                    Practice {examName} mock tests, previous year questions, online practice sets, and exam-level questions on Menturo. This test series is built for {tagText} and helps you improve speed, accuracy, and confidence before the exam.
                </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-[#EEE9FB] bg-[#FBFAFF] p-4">
                    <h2 className="text-sm font-black text-[#271F49]">
                        {examName} Online Mock Tests
                    </h2>
                    <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                        Attempt structured online tests for {examName} with exam-style questions, timed practice, and result tracking.
                    </p>
                </article>

                <article className="rounded-2xl border border-[#EEE9FB] bg-[#FBFAFF] p-4">
                    <h2 className="text-sm font-black text-[#271F49]">
                        {examName} Previous Year Questions
                    </h2>
                    <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                        Use PYQ-style practice to understand repeated topics, question difficulty, and the latest exam pattern.
                    </p>
                </article>

                <article className="rounded-2xl border border-[#EEE9FB] bg-[#FBFAFF] p-4">
                    <h2 className="text-sm font-black text-[#271F49]">
                        Subjects Covered
                    </h2>
                    <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                        Focus areas include {subjectText}. {testCount > 0 ? `${testCount} practice items are listed in this pack.` : 'More tests and practice sets may be added over time.'}
                    </p>
                </article>
            </div>

            <div className="mt-6 rounded-2xl border border-[#EEE9FB] bg-[#FCFBFF] p-4 sm:p-5">
                <h2 className="text-base font-black text-[#171426]">
                    {examName} Test Series FAQs
                </h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <details className="rounded-xl border border-[#E9E3F7] bg-white p-3">
                        <summary className="cursor-pointer text-sm font-black text-[#4A3F77]">
                            Is this {examName} mock test series useful for preparation?
                        </summary>
                        <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                            Yes. It is designed for {examName} preparation with online mock tests, practice questions, and performance-focused revision.
                        </p>
                    </details>

                    <details className="rounded-xl border border-[#E9E3F7] bg-white p-3">
                        <summary className="cursor-pointer text-sm font-black text-[#4A3F77]">
                            Can I practice {examName} previous year questions?
                        </summary>
                        <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                            You can practice PYQ-style and exam-level questions where available, along with mock tests for revision and speed building.
                        </p>
                    </details>
                </div>
            </div>
        </section>
    )
}


export default function TestPage() {
    const router =
        useRouter()

    const clearActiveTest =
        useTestDataStore(
            (state) => state.clearActiveTest
        )
    const timeLeft =
        useTestDataStore(
            (state) => state.timeLeft
        )
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const authChecked =
        useUserStore(
            (state) => state.authChecked
        )
    const fetchUser =
        useUserStore(
            (state) => state.fetchUser
        )
    useEffect(() => {
        if (!authenticated && !authChecked) {
            fetchUser()
        }
    }, [
        authChecked,
        authenticated,
        fetchUser
    ])


    const pathname = usePathname()

    const saveTestBeforeLeave = async () => {

        const store =
            useTestDataStore.getState()
        if (!store.activeTest || Object.keys(store.activeTest).length === 0) {
            return
        }

        const history =
            store.activeTest
                ?.activeQuestionHistoryObj

        const runningHistory = store.activeTest?.history


        if (!runningHistory?._id) {

            return
        }
        try {
            // Use fetch with keepalive to ensure it completes
            await fetch(SAVE_TEST, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    historyId:
                        runningHistory._id,
                    time: timeLeft,

                    data: {

                        [store.activeSubject]: {

                            ...history[
                            store.activeSubject
                            ],

                            activeIndex:
                                store.activeQuestionIndex,

                            language:
                                store.activeLan,

                            timeLeft:
                                store.timeLeft
                        }
                    },

                    e: 1
                }),
                keepalive: true // Ensures request completes even after page unload
            })
        } catch (error) {
            console.error('Failed to save test:', error)
        }


        useTestDataStore.getState().clearActiveTest()
    }

    // useEffect(() => {

    //     if (!pathname.includes("/test")) {
    //         await saveTestBeforeLeave()

    //         clearActiveTest()
    //     }

    // }, [pathname, clearActiveTest])
    useEffect(() => {
        const handlePathChange = async () => {
            if (!pathname.includes("/test")) {
                await saveTestBeforeLeave()
                clearActiveTest()
            }
        }

        handlePathChange()
    }, [pathname, clearActiveTest])

    // ======================================================
    // PARAMS
    // ======================================================
    const params = useParams()
    const slug = String(params.slug)
    const seriesId = extractSeriesIdFromSlug(slug)

    // ======================================================
    // STORE
    // ======================================================
    const series = useTestSeriesStore((state) =>
        state.seriesMap[seriesId] ||
        Object.values(state.seriesMap).find((item: any) => item?.slug === seriesId)
    )
    const fetchSingleSeries = useTestSeriesStore((state) => state.fetchSingleSeries)
    // ======================================================
    // REFS FOR TRACKING
    // ======================================================
    const fetchInProgressRef = useRef(false)
    const initialLoadDoneRef = useRef(false)

    // ======================================================
    // GET SERIES FROM STORE (direct lookup)
    // ======================================================
    const canAccessSeries =
        hasActiveSeriesAccess(series?.access)

    // ======================================================
    // FETCH SERIES IF NOT IN STORE
    // ======================================================
    useEffect(() => {

        // Don't fetch if no slug
        if (!seriesId) return

        // If series already exists in store, mark as done
        if (series) {
            initialLoadDoneRef.current = true
            fetchInProgressRef.current = false
            return
        }

        // Prevent duplicate requests
        if (fetchInProgressRef.current) return
        if (initialLoadDoneRef.current) return

        // Start fetching
        fetchInProgressRef.current = true

        fetchSingleSeries(seriesId)
            .then((fetchedSeries) => {

                if (!fetchedSeries) {

                    console.error(
                        '❌ Failed to load series'
                    )

                    fetchInProgressRef.current = false
                }

                initialLoadDoneRef.current = true

            })
            .catch((error) => {

                console.error(
                    '❌ Error fetching series:',
                    error
                )

                fetchInProgressRef.current = false

                initialLoadDoneRef.current = true
            })

        return () => {

            fetchInProgressRef.current = false
        }

    }, [

        seriesId,
        series,
        fetchSingleSeries

    ])

    useEffect(() => {
        if (!series) {
            return
        }

        const seoSlug =
            createSeriesSlug(
                series.n,
                series.slug || series._id || seriesId
            )

        if (
            seoSlug &&
            seoSlug !== slug
        ) {
            router.replace(`/series/${seoSlug}`)
        }
    }, [
        router,
        series,
        seriesId,
        slug
    ])

    // ======================================================
    // RENDER MAIN CONTENT
    // ======================================================
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2 sm:py-3 space-y-3">
            <TestSection series={series} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
                {/* <div className="lg:col-span-1">
                    {series ? (

                        <PaymentSummary series={series}

                        />

                    ) : (

                        <PaymentSummarySkeleton />

                    )}
                </div> */}
                {!canAccessSeries && (
                    <div className="lg:col-span-2">

                        <SeriesPaymentPage series={series} />

                    </div>
                )}

                <div className="lg:col-span-2">

                    <SuggestedPaymentCard excludeSeriesId={series?._id} />

                </div>
            </div>

            <SeriesSeoContent series={series} />

            <AdSenseAd />
        </div>
    )
}
