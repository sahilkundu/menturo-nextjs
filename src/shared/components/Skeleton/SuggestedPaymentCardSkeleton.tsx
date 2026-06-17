'use client'

interface Props {
    count?: number
}

export default function SuggestedPaymentCardSkeleton({
    count = 4,
}: Props) {

    return (
        <div className="m-3 lg:col-span-2 space-y-6 animate-pulse overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <div className="space-y-2">

                    <div className="h-7 w-64 bg-gray-200 rounded"></div>

                    <div className="h-4 w-52 bg-gray-100 rounded"></div>

                </div>

                <div className="flex gap-2">

                    <div className="w-9 h-9 rounded-xl bg-gray-200"></div>

                    <div className="w-9 h-9 rounded-xl bg-gray-200"></div>

                </div>

            </div>

            {/* CARDS */}
            <div className="flex md:grid md:grid-cols-2 gap-4 overflow-hidden">

                {Array.from({ length: count }).map((_, index) => (

                    <div
                        key={index}
                        className="min-w-[300px] sm:min-w-[340px] md:min-w-0 bg-white rounded-3xl border border-gray-100 p-5"
                    >

                        <div className="flex justify-between items-start gap-2">

                            <div className="h-5 w-24 bg-rose-100 rounded-full"></div>

                            <div className="flex flex-col items-end gap-2">

                                <div className="h-4 w-16 bg-yellow-100 rounded"></div>

                                {/* DURATION */}
                                <div className="h-5 w-20 bg-indigo-100 rounded-full"></div>

                            </div>

                        </div>

                        <div className="h-7 w-48 bg-gray-200 rounded mt-5"></div>

                        <div className="space-y-2 mt-3">

                            <div className="h-4 w-full bg-gray-100 rounded"></div>

                            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>

                        </div>

                        <div className="flex gap-2 items-center mt-5">

                            <div className="h-8 w-20 bg-indigo-100 rounded"></div>

                            <div className="h-5 w-16 bg-gray-100 rounded"></div>

                            <div className="h-5 w-16 bg-green-100 rounded-full"></div>

                        </div>

                        <div className="space-y-3 mt-5">

                            {Array.from({ length: 4 }).map((_, i) => (

                                <div
                                    key={i}
                                    className="h-4 w-full bg-gray-100 rounded"
                                ></div>

                            ))}

                        </div>

                        <div className="h-12 w-full bg-indigo-200 rounded-2xl mt-6"></div>

                    </div>

                ))}

            </div>

        </div>
    )
}