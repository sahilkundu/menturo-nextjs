'use client'

type Props = {
    count?: number
}

export default function TestCardSkeleton({
    count = 1
}: Props) {

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (

                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-pulse"
                >

                    {/* LEFT */}
                    <div className="space-y-3 min-w-0 w-full sm:w-auto flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                            <div className="h-4 w-40 bg-gray-200 rounded-md"></div>

                            <div className="h-5 w-20 bg-amber-100 rounded-full"></div>

                        </div>

                        <div className="flex gap-3 flex-wrap">

                            <div className="h-3 w-24 bg-gray-200 rounded"></div>

                            <div className="h-3 w-20 bg-gray-200 rounded"></div>

                            <div className="h-3 w-16 bg-gray-200 rounded"></div>

                        </div>

                        <div className="h-3 w-28 bg-sky-100 rounded"></div>

                    </div>

                    {/* BUTTON */}
                    <div className="w-full sm:w-[130px] h-10 bg-[#4A3F77]/20 rounded-xl shrink-0"></div>

                </div>
            ))}
        </>
    )
}