'use client'

export default function TestHeaderSkeleton() {

    return (

        <div className="animate-pulse">

            {/* TOP BADGES */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">

                <div className="h-6 w-24 bg-rose-100 rounded-full"></div>

                <div className="h-5 w-32 bg-yellow-100 rounded"></div>

            </div>

            {/* TITLE */}
            <div className="h-10 w-[70%] bg-gray-200 rounded-xl mb-4"></div>

            {/* DESCRIPTION */}
            <div className="space-y-2 mb-5">

                <div className="h-4 w-full bg-gray-200 rounded"></div>

                <div className="h-4 w-[60%] bg-gray-200 rounded"></div>

            </div>

            {/* MAIN BOX */}
            <div className="bg-slate-50 max-w-4xl w-full rounded-2xl border border-gray-100 overflow-hidden">

                {/* BUTTONS */}
                <div className="p-3 sm:p-4 flex gap-3">

                    <div className="h-10 w-28 bg-sky-200 rounded-full"></div>

                    <div className="h-10 w-24 bg-gray-200 rounded-full"></div>

                </div>

                {/* CATEGORY */}
                <div className="px-3 pb-3">

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

                        <div className="p-3 flex gap-2 overflow-hidden">

                            {Array.from({ length: 5 }).map((_, index) => (

                                <div
                                    key={index}
                                    className="h-8 w-20 bg-gray-200 rounded"
                                ></div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}