'use client'

export default function RightSidebarSkeleton() {
    return (
        <div className="w-[250px] h-screen bg-white p-2 animate-pulse">
            <div className="flex justify-between items-center mb-5">
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="h-9 w-9 rounded-full bg-gray-100" />
            </div>

            <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full border-[5px] border-violet-100 bg-gray-100" />
                <div className="mx-auto mt-3 h-4 w-32 rounded bg-gray-200" />
                <div className="mx-auto mt-3 h-3 w-44 rounded bg-gray-100" />
                <div className="mx-auto mt-2 h-3 w-36 rounded bg-gray-100" />

                <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                    <div className="inline-block h-7 w-24 rounded-full bg-violet-100" />
                    <div className="ml-2 inline-block h-7 w-20 rounded-full bg-violet-100" />
                </div>
            </div>

            <div className="mt-6 h-12 rounded-2xl bg-red-50" />

            <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="h-[84px] rounded-2xl bg-violet-50" />
                <div className="h-[84px] rounded-2xl bg-green-50" />
            </div>

            <div className="mt-7 flex items-center justify-between">
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="h-4 w-14 rounded bg-violet-100" />
            </div>

            <div className="mt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl p-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-24 rounded bg-gray-200" />
                                <div className="h-3 w-16 rounded bg-gray-100" />
                            </div>
                        </div>
                        <div className="h-9 w-16 rounded-full bg-violet-100" />
                    </div>
                ))}
            </div>
        </div>
    )
}
