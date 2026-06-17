'use client'

import TestCardSkeleton from './Skeleton/TestCardSkeleton'
import TestHeaderSkeleton from './Skeleton/TestSection/TestHeaderSkeleton'

import TestInfoSkeleton from './Skeleton/TestSection/TestInfoSkeleton'

type Props = {
    series: any
}

export default function TestSeriesInfo({ series }: Props) {
    const includedFeatures = series?.info || []

    if (!series) {
        return (
            <div className="m-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* LEFT */}
                    <div className="lg:col-span-3 p-3 sm:p-5 md:p-7 min-w-0">

                        <TestHeaderSkeleton />

                        <div className="bg-slate-50 max-w-4xl w-full rounded-2xl border border-gray-100 overflow-hidden mt-4">

                            <TestCardSkeleton count={1} />

                        </div>

                    </div>

                    {/* RIGHT */}
                    <TestInfoSkeleton />


                </div>

            </div>
        )
    }
    return (
        <>
            <div className="lg:col-span-2 p-3 sm:p-5 md:p-7 mt-10">

                <div className="bg-white rounded-2xl shadow-md border border-indigo-50 sticky top-6 overflow-hidden">

                    {/* HEADER */}
                    <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">

                        <h3 className="font-black text-gray-800 flex items-center gap-2">

                            <span className="text-indigo-600 text-xl">
                                📋
                            </span>

                            What's Included in this Pack

                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                            Updated every week · Access on any device
                        </p>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5 max-h-[550px] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-indigo-100 [&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                        {/* WEEKLY FEATURES */}
                        <div className="mb-5">

                            <div className="flex items-center justify-between mb-2">

                                <span className="font-bold text-indigo-800 text-sm">
                                    🔥 THIS WEEK (Free for all)
                                </span>

                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                                    Live Now
                                </span>

                            </div>

                            <div className="space-y-3">

                                {[
                                    'Weekly Grand Mock Challenge',
                                    'Detailed Solutions Included',
                                    'Performance Analytics Dashboard',
                                    'Cross Device Access',
                                    'Latest Exam Pattern Questions',
                                ].map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex justify-between items-center border-b pb-2"
                                    >

                                        <div>

                                            <p className="font-medium text-sm">
                                                ✓ {item}
                                            </p>

                                            <p className="text-[11px] text-gray-400">
                                                Weekly Updated
                                            </p>

                                        </div>

                                        <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                                            FREE
                                        </span>

                                    </div>
                                ))}

                            </div>

                        </div>

                        {/* INCLUDED FEATURES */}
                        <div className="mb-4">

                            <div className="flex items-center gap-2">

                                <span className="text-sm font-black">
                                    📌 All Practice Tests
                                </span>

                            </div>

                            <ul className="mt-3 space-y-2 text-sm text-gray-700">

                                {includedFeatures.map(
                                    (
                                        feature: string,
                                        index: number
                                    ) => (

                                        <li
                                            key={index}
                                            className="flex gap-2 text-xs md:text-sm"
                                        >

                                            <span className="text-indigo-500">
                                                ✓
                                            </span>

                                            {feature}

                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                        {/* DEVICE ACCESS */}
                        <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border mt-3">

                            <p className="text-[12px] font-bold flex items-center gap-1">
                                🖥️💻📱 Cross-Platform Access
                            </p>

                            <p className="text-[11px] text-gray-500 mt-1">
                                Use your same account on Desktop, Laptop,
                                Tablet, Mobile.
                            </p>

                            <div className="flex mt-3 gap-2 text-gray-600 text-[10px] font-medium flex-wrap">

                                <span>✔ Windows</span>
                                <span>✔ macOS</span>
                                <span>✔ Android</span>
                                <span>✔ iOS</span>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t">

                        🎓 Enroll any course & unlock full test library + weekly challenges

                    </div>

                </div>

            </div>
        </>

    )




}