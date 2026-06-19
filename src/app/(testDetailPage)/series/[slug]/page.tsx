'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTestSeriesStore } from "../../../../shared/store/testSeriesStore"
import { useTestDataStore } from '../../../../shared/store/testDataStore'
import { useUserStore } from '../../../../shared/store/user'
import { SAVE_TEST } from '../../../../../api'
import SeriesPaymentPage from '../../../../shared/components/SeriesPaymentPage'
import { showRouteLoader } from '../../../../shared/utils/routeLoader'
import {
    createSeriesSlug,
    extractSeriesIdFromSlug,
    isSeriesIdOnlySlug
} from '../../../../shared/seo'
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

const TestSectionHead = dynamic(
    () => import(
        "../../../../shared/components/TestSectionHead"
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

    return (
        isTrue(access?.access) ||
        isTrue(access?.canAccess)
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
    const series = useTestSeriesStore((state) => state.seriesMap[seriesId])
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

    const goHome = () => {
        showRouteLoader()
        router.push("/")
    }

    const goLogin = async () => {
        showRouteLoader()

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

        router.push("/login")
    }

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
        if (
            !series ||
            !isSeriesIdOnlySlug(slug)
        ) {
            return
        }

        const seoSlug =
            createSeriesSlug(
                series.n,
                seriesId
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
            <TestSectionHead
                userName=""
                rollingId=""
                activePlan={
                    authenticated
                        ? canAccessSeries
                            ? "Premium"
                            : "No Access"
                        : "Guest"
                }
                badgeText="🎯 Rank Booster"
                onHome={goHome}
                onLogin={goLogin}
                showSignIn={!authenticated}
            />

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
        </div>
    )
}
