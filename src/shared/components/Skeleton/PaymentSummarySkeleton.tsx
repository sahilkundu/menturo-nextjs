'use client'

export default function PaymentSummarySkeleton() {
    return (
        <div className="m-3 bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6 animate-pulse">

            {/* HEADER */}
            <div className="flex items-center gap-3 flex-wrap">

                <div className="h-7 w-52 bg-gray-200 rounded-lg"></div>

                <div className="h-5 w-24 bg-green-100 rounded-full"></div>

            </div>

            {/* PRICE SECTION */}
            <div className="mt-5 space-y-4">

                {/* COURSE PRICE */}
                <div className="flex justify-between items-center pb-2 border-b border-dashed">

                    <div className="h-4 w-28 bg-gray-200 rounded"></div>

                    <div className="flex items-center gap-2">

                        <div className="h-7 w-20 bg-gray-200 rounded"></div>

                        <div className="h-4 w-16 bg-green-100 rounded"></div>

                    </div>

                </div>

                {/* SAVE */}
                <div className="flex justify-between items-center pb-2 border-b border-dashed">

                    <div className="h-4 w-24 bg-green-100 rounded"></div>

                    <div className="h-4 w-16 bg-green-100 rounded"></div>

                </div>

                {/* COUPON */}
                <div className="flex items-center gap-2 pb-2 border-b border-dashed">

                    <div className="w-full h-10 bg-gray-100 rounded-xl"></div>

                    <div className="h-10 w-20 bg-gray-200 rounded-xl"></div>

                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center pt-2 bg-gray-100 p-3 rounded-2xl">

                    <div className="h-5 w-32 bg-gray-200 rounded"></div>

                    <div className="h-8 w-20 bg-indigo-100 rounded"></div>

                </div>

            </div>

            {/* PAYMENT METHODS */}
            <div className="mt-4 flex justify-center gap-4 flex-wrap">

                {Array.from({ length: 4 }).map((_, index) => (

                    <div
                        key={index}
                        className="h-8 w-20 bg-gray-100 rounded-lg"
                    ></div>

                ))}

            </div>

            {/* BUTTON */}
            <div className="mt-5">

                <div className="w-full h-14 bg-indigo-200 rounded-2xl"></div>

            </div>

            {/* FOOTER */}
            <div className="mt-4 space-y-3 flex flex-col items-center">

                <div className="h-3 w-64 bg-gray-100 rounded"></div>

                <div className="h-3 w-52 bg-gray-100 rounded"></div>

                <div className="h-4 w-40 bg-indigo-100 rounded"></div>

            </div>

        </div>
    )
}