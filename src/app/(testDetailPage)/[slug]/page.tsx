'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

import { useWSStore } from "../../../shared/store/wsStore"
import { useTestSeriesStore } from "../../../shared/store/testSeriesStore"
const PaymentSummary = dynamic(
    () => import(
        "../../../shared/components/PaymentSummary"
    )
)

const SuggestedPaymentCard = dynamic(
    () => import(
        "../../../shared/components/SuggestedPaymentCard"
    ),
    {
        ssr: false
    }
)

const TestSection = dynamic(
    () => import(
        "../../../shared/components/TestSection"
    )
)

const TestSectionHead = dynamic(
    () => import(
        "../../../shared/components/TestSectionHead"
    )
)

const PaymentSummarySkeleton = dynamic(
    () => import(
        '../../../shared/components/Skeleton/PaymentSummarySkeleton'
    )
)


export default function TestPage() {
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
    // ======================================================
    // FETCH SERIES IF NOT IN STORE
    // ======================================================
    useEffect(() => {

        // ======================================
        // WAIT FOR WS CONNECTION
        // ======================================

        if (
            status !== 'connected'
        ) {
            return
        }

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
            <TestSectionHead
                userName="Aman Sharma"
                rollingId="SSCEXP246"
                activePlan="Premium"
                badgeText="🎯 Rank Booster"
            />

            <TestSection series={series} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 md:gap-9 items-start">
                <div className="lg:col-span-1">
                    {series ? (

                        <PaymentSummary
                            courseName={series?.n}
                            coursePrice={series?.plans?.[0]?.offerPrice || 0}
                            originalPrice={series?.plans?.[0]?.price || 0}
                            totalAmount={series?.plans?.[0]?.offerPrice || 0}
                        />

                    ) : (

                        <PaymentSummarySkeleton />

                    )}
                </div>

                <div className="lg:col-span-2">

                    <SuggestedPaymentCard />

                </div>
            </div>
        </div>
    )
}