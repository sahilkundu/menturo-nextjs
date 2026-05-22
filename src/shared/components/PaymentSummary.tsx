'use client'

interface PaymentSummaryProps {
    courseName: string
    coursePrice: number
    originalPrice: number
    totalAmount: number

    onBuyNow?: () => void
}

export default function PaymentSummary({
    courseName,
    coursePrice,
    originalPrice,
    totalAmount,
    onBuyNow,
}: PaymentSummaryProps) {

    const savedAmount = originalPrice - coursePrice

    const discountPercent = Math.round(
        ((savedAmount / originalPrice) * 100)
    )

    return (
        <div className="m-3 bg-white rounded-3xl  border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">

            <h3 className="text-lg sm:text-xl font-black text-gray-800 flex items-center gap-2 flex-wrap">
                <span>💰</span>

                Payment Summary

                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                    🔥 Limited Offer
                </span>
            </h3>

            <div className="mt-5 space-y-4">

                <div className="flex justify-between items-center pb-2 border-b border-dashed">

                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Course Price
                    </span>

                    <div className="text-right">
                        <span className="font-bold text-gray-900 text-lg sm:text-xl">
                            ₹{coursePrice}
                        </span>

                        <span className="text-green-600 text-[10px] ml-2 bg-green-50 px-1.5 py-0.5 rounded">
                            {discountPercent}% OFF
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-dashed">

                    <span className="text-green-600 text-sm sm:text-base font-medium">
                        🎉 You Save
                    </span>

                    <span className="text-green-700 font-bold text-sm">
                        - ₹{savedAmount}
                    </span>
                </div>

                <div className="flex items-center gap-2 pb-2 border-b border-dashed">

                    <input
                        type="text"
                        placeholder="Apply Coupon Code"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400"
                    />

                    <button className="bg-gray-100 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap">
                        Apply
                    </button>
                </div>

                <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 rounded-2xl">

                    <span className="font-black text-gray-800 text-sm sm:text-base">
                        Total Amount
                    </span>

                    <span className="text-xl sm:text-2xl font-black text-indigo-700">
                        ₹{totalAmount}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-gray-500 text-sm flex-wrap">

                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    💳 UPI
                </span>

                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    💳 Card
                </span>

                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    🏦 NetBanking
                </span>

                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                    📱 Wallet
                </span>
            </div>

            <div className="mt-5">

                <button
                    onClick={onBuyNow}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-2xl text-sm sm:text-base shadow-md transition"
                >
                    🚀 Buy Now / Enroll Now
                </button>
            </div>

            <div className="mt-4 text-center space-y-2">

                <p className="text-[11px] text-gray-400 flex items-center justify-center gap-3 flex-wrap">

                    <span>
                        ✅ 7-Day Money Back Guarantee
                    </span>

                    <span>
                        🔒 100% Secure Payment
                    </span>
                </p>

                <p className="text-[10px] text-gray-300">
                    Instant Access · Lifetime Validity · 24x7 Support
                </p>

                <p className="text-xs font-semibold text-indigo-600">
                    {courseName}
                </p>
            </div>
        </div>
    )
}