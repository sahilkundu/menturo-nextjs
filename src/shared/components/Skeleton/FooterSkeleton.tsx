'use client'

export default function FooterSkeleton() {
    return (
        <div className="w-full bg-white border-t border-gray-100 p-4 animate-pulse">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-4 w-48 rounded bg-gray-200" />
                <div className="flex gap-3">
                    <div className="h-4 w-16 rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                    <div className="h-4 w-14 rounded bg-gray-100" />
                </div>
            </div>
        </div>
    )
}
