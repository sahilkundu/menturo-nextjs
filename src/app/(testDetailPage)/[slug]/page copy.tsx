// app/test/[slug]/page.tsx

import { tests } from "../../../data/test"
import PaymentSummary from "../../../shared/components/PaymentSummary"
import SuggestedPaymentCard from "../../../shared/components/SuggestedPaymentCard"
import TestSection from "../../../shared/components/TestSection"
import TestSectionHead from "../../../shared/components/TestSectionHead"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function TestPage({
    params
}: PageProps) {

    const { slug } = await params

    const test = tests.find(
        (item) => item.slug === slug
    )

    const cards = [
        {
            id: 1,
            badge: '#1 Bestseller',
            title: 'SSC GD Constable 2026',
            description: 'Full-length mocks + chapter-wise drills.',
            price: 399,
            originalPrice: 1499,
            buttonText: '🚀 Buy Now',
            features: [
                '120+ Full Mock Tests',
                '40 Sectional Tests',
                'Weekly Challenge Exam',
            ],
        },

        {
            id: 2,
            badge: '🔥 Popular',
            title: 'Railway Group D + NTPC',
            description: 'CBT mocks + Physics booster.',
            price: 549,
            originalPrice: 1799,
            buttonText: '💳 Buy Now',
            features: [
                '180+ Mock Exams',
                'All India Rank',
                'Weekly Live Tests',
            ],
        },

        {
            id: 3,
            badge: '🎯 Expert Pick',
            title: 'SBI PO + IBPS Clerk',
            description: 'Puzzle sets + mains simulator.',
            price: 649,
            originalPrice: 1999,
            buttonText: '💸 Enroll Now',
            features: [
                '45 Full Length Tests',
                '20+ Weekly Challenges',
                'Cross Device Sync',
            ],
        },

        {
            id: 4,
            badge: '⭐ Combo Offer',
            title: 'SSC CGL + CHSL',
            description: 'Adaptive tests + AI analysis.',
            price: 799,
            originalPrice: 2499,
            buttonText: '📚 Buy Now',
            features: [
                '250+ Full Tests',
                'National Mock Weekly',
                'Unlimited Access',
            ],
        },
    ]

    if (!test) {

        return (
            <div className="p-10 text-3xl">
                Test Not Found
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">

            <TestSectionHead
                userName="Aman Sharma"
                rollingId="SSCEXP246"
                activePlan="Premium"
                badgeText="🎯 Rank Booster"
            />

            <TestSection />

            {/* PAYMENT + SUGGESTED SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 md:gap-9 items-start">

                {/* LEFT SIDE */}
                <div className="lg:col-span-1">
                    <PaymentSummary
                        courseName="SSC GD Platinum Pack"
                        coursePrice={399}
                        originalPrice={1499}
                        totalAmount={447}
                    />
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-2">
                    <SuggestedPaymentCard cards={cards} />
                </div>

            </div>
        </div>
    )
}