'use client'

interface TestCardSkeletonProps {
    count?: number
}

export default function TestCardSkeleton({
    count = 1
}: TestCardSkeletonProps) {

    return (

        <>
            {
                Array.from({
                    length: count
                }).map((_, index) => (

                    <div
                        key={index}
                        className="
                            min-w-[240px]
                            max-w-[240px]
                            shrink-0
                            rounded-[28px]
                            overflow-hidden
                            border
                            border-gray-100
                            bg-white
                            shadow-md
                            snap-start
                            animate-pulse
                        "
                    >

                        {/* IMAGE */}
                        <div className="relative">

                            <div
                                className="
                                    w-full
                                    h-[130px]
                                    bg-gray-200
                                "
                            />

                            {/* BADGE */}
                            <div
                                className="
                                    absolute
                                    top-2
                                    left-2
                                    h-6
                                    w-24
                                    rounded-full
                                    bg-orange-200
                                "
                            />

                        </div>

                        {/* CONTENT */}
                        <div className="p-4">

                            {/* TOP */}
                            <div className="flex items-center justify-between mb-2">

                                <div
                                    className="
                                        h-3
                                        w-10
                                        rounded
                                        bg-violet-200
                                    "
                                />

                                <div
                                    className="
                                        h-5
                                        w-14
                                        rounded-full
                                        bg-violet-100
                                    "
                                />

                            </div>

                            {/* TITLE */}
                            <div className="mb-2">

                                <div
                                    className="
                                        h-4
                                        w-full
                                        rounded
                                        bg-gray-200
                                        mb-2
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-[70%]
                                        rounded
                                        bg-gray-200
                                    "
                                />

                            </div>

                            {/* PRICE */}
                            <div className="flex items-center justify-between mb-2">

                                <div
                                    className="
                                        h-3
                                        w-20
                                        rounded
                                        bg-gray-100
                                    "
                                />

                                <div className="flex items-center gap-1">

                                    <div
                                        className="
                                            h-3
                                            w-10
                                            rounded
                                            bg-gray-100
                                        "
                                    />

                                    <div
                                        className="
                                            h-6
                                            w-14
                                            rounded
                                            bg-violet-200
                                        "
                                    />

                                </div>

                            </div>

                            {/* DEMO */}
                            <div className="flex items-center gap-1 mt-1 mb-3">

                                <div
                                    className="
                                        h-3
                                        w-3
                                        rounded-full
                                        bg-amber-200
                                    "
                                />

                                <div
                                    className="
                                        h-3
                                        w-28
                                        rounded
                                        bg-amber-100
                                    "
                                />

                            </div>

                            {/* BUTTON */}
                            <div
                                className="
                                    w-full
                                    h-10
                                    rounded-xl
                                    bg-violet-200
                                "
                            />

                        </div>

                    </div>

                ))
            }
        </>

    )
}