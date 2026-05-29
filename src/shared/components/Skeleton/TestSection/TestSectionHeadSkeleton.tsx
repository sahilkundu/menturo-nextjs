'use client'

export default function TestSectionHeadSkeleton() {
    return (
        <div
            className="
                flex justify-between items-center
                flex-wrap gap-3
                border-b border-indigo-100
                m-2
                pb-4
                animate-pulse
            "
        >

            {/* LEFT */}
            <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-gray-200"></div>

                <div className="space-y-2">

                    <div className="h-6 w-52 bg-gray-200 rounded-md"></div>

                    <div className="h-3 w-40 bg-gray-100 rounded-md"></div>

                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">

                <div className="h-4 w-28 bg-gray-200 rounded-md"></div>

                <div className="h-6 w-32 bg-gray-200 rounded-full"></div>

            </div>

        </div>
    )
}