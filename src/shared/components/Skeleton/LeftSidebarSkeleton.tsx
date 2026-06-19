'use client'

export default function LeftSidebarSkeleton() {
    return (
        <div className="w-[250px] h-screen bg-white rounded-r-[24px] shadow-[5px_0_30px_rgba(0,0,0,0.08)] p-2 animate-pulse">
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className={`
                            h-11
                            rounded-2xl
                            ${index === 0
                                ? "bg-violet-100"
                                : "bg-gray-100"
                            }
                        `}
                    />
                ))}
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div className="mb-4 h-3 w-20 rounded bg-gray-200" />

            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-11 rounded-2xl bg-gray-100"
                    />
                ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gray-100 p-3">
                <div className="h-10 w-10 rounded-xl bg-violet-200" />
                <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-full rounded bg-gray-200" />
                <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
            </div>
        </div>
    )
}
