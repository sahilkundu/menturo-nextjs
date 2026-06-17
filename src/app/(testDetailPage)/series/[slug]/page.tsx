'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { useWSStore } from "../../../../shared/utils/wsStore"
import { useTestSeriesStore } from "../../../../shared/store/testSeriesStore"
import { useTestDataStore } from '../../../../shared/store/testDataStore'
import { useUserStore } from '../../../../shared/store/user'
import { SAVE_TEST } from '../../../../../api'
import SeriesPaymentPage from '../../../../shared/components/SeriesPaymentPage'
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

    const isFreeAccess =
        isTrue(access?.isFree)

    const isPaid =
        isTrue(access?.isPaid)

    const isExpired =
        isTrue(access?.isExpired)

    return (
        (isPaid && !isExpired) ||
        (isPaid && isExpired && isFreeAccess) ||
        (!isPaid && isFreeAccess)
    )
}


export default function TestPage() {
    const {

        clearActiveTest,
        timeLeft
    } = useTestDataStore()
    const {
        authenticated,
        fetchUser
    } = useUserStore()
    useEffect(() => {
        if (!authenticated) {
            fetchUser()
        }
    }, [])


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

    // ======================================================
    // STORE
    // ======================================================
    const seriesMap = useTestSeriesStore((state) => state.seriesMap)
    const fetchSingleSeries = useTestSeriesStore((state) => state.fetchSingleSeries)
    const {
        userId,
        status,
        guestId
    } = useWSStore()
    // ======================================================
    // REFS FOR TRACKING
    // ======================================================
    const fetchInProgressRef = useRef(false)
    const initialLoadDoneRef = useRef(false)

    // ======================================================
    // GET SERIES FROM STORE (direct lookup)
    // ======================================================
    const series = seriesMap[slug]
    const canAccessSeries =
       hasActiveSeriesAccess(series?.access)
    console.log("===============================")
    console.log(canAccessSeries)

    // ======================================================
    // FETCH SERIES IF NOT IN STORE
    // ======================================================
    useEffect(() => {

        // Don't fetch if no slug
        if (!slug) return

        // If series already exists in store, mark as done
        if (seriesMap[slug]) {
            initialLoadDoneRef.current = true
            fetchInProgressRef.current = false
            return
        }

        // Prevent duplicate requests
        if (fetchInProgressRef.current) return
        if (initialLoadDoneRef.current) return

        // Start fetching
        fetchInProgressRef.current = true

        fetchSingleSeries(slug, userId || guestId)
            .then((fetchedSeries) => {

                if (fetchedSeries) {

                    console.log(
                        '✅ Series loaded successfully:',
                        fetchedSeries.n
                    )

                } else {

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

        slug,
        status,
        userId,
        seriesMap,
        fetchSingleSeries

    ])
    // ======================================================
    // LOADING STATES
    // ======================================================

    // ======================================================
    // SUGGESTED CARDS (exclude current series)
    // ======================================================
    const cards = Object.values(seriesMap)
        .filter((item: any) => item._id !== slug)
        .slice(0, 10)

    // ======================================================
    // RENDER MAIN CONTENT
    // ======================================================
    return (
        <div className="max-w-7xl mx-auto md:px-6 lg:px-8 py-6 space-y-8 border border-gray-200">
            <TestSectionHead
                userName=""
                rollingId=""
                activePlan={canAccessSeries ? "Premium" : "No Access"}
                badgeText="🎯 Rank Booster"
            />

            <TestSection series={series} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-9 items-start">
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
