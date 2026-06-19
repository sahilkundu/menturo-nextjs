'use client'

import TestCardSkeleton from "./TestCardSkeleton"

export default function HomeCenterSkeleton() {
    return (
        <div className="w-full min-h-screen p-3 lg:p-4">
            <div className="relative overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#1F2937_0%,#4A3F77_55%,#6D28D9_100%)]">
                <div className="relative z-10 p-5 lg:p-6 animate-pulse">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                        <div className="flex items-center gap-4">
                            <div className="hidden max-[1280px]:block h-10 w-10 rounded-full bg-white/20" />
                            <div className="h-12 w-12 rounded-2xl bg-white/20" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 rounded bg-white/25" />
                                <div className="h-3 w-48 rounded bg-white/15" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="h-10 w-28 rounded-xl bg-white/20" />
                            <div className="h-10 w-10 rounded-full bg-white/20" />
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="h-5 w-36 rounded bg-white/20" />
                        <div className="h-8 w-[360px] max-w-full rounded bg-white/25" />
                        <div className="h-4 w-[520px] max-w-full rounded bg-white/15" />
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 mt-5">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-20 rounded-2xl bg-white/15 border border-white/10"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 bg-white rounded-[30px] p-1 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden">
                <div className="flex items-center justify-between mb-5 animate-pulse">
                    <div className="m-4 h-5 w-36 rounded bg-gray-200" />
                    <div className="m-4 flex gap-2">
                        <div className="h-9 w-9 rounded-xl border border-gray-200 bg-gray-100" />
                        <div className="h-9 w-9 rounded-xl border border-gray-200 bg-gray-100" />
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-3 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden">
                    <div className="mb-6 space-y-2 animate-pulse">
                        <div className="h-7 w-[320px] max-w-full rounded bg-[#DAD5EA]" />
                        <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
                    </div>

                    <div className="flex items-stretch gap-4 overflow-hidden pb-1">
                        <TestCardSkeleton count={4} />
                    </div>
                </div>
            </div>
        </div>
    )
}
