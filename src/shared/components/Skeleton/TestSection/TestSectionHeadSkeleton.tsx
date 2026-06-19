'use client'

export default function TestSectionHeadSkeleton() {
    return (
        <div
            className="
                flex justify-between items-center
                flex-wrap gap-3
                border-b border-indigo-100
                px-2
                pb-3
                animate-pulse
            "
        >

            {/* LEFT */}
            <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-gray-200"></div>

                <div className="space-y-2">

                    <div className="h-5 w-48 bg-gray-200 rounded-md"></div>

                    <div className="h-3 w-40 bg-gray-100 rounded-md"></div>

                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

                <div className="hidden sm:block h-9 w-32 bg-gray-100 rounded-full"></div>

                <div className="h-7 w-24 bg-indigo-50 rounded-full"></div>

                <div className="h-9 w-9 bg-white border border-slate-200 rounded-xl"></div>

                <div className="h-9 w-20 bg-[#4A3F77]/20 rounded-xl"></div>

            </div>

        </div>
    )
}
