'use client'

import { useUserStore } from "../store/user"
import TestSectionHeadSkeleton from "./Skeleton/TestSection/TestSectionHeadSkeleton"

interface TestSectionHeadProps {
    userName: string
    rollingId: string
    activePlan: string
    badgeText?: string

    className?: string
}

export default function TestSectionHead({
    userName,
    rollingId,
    activePlan,
    badgeText = '🎯 Rank Booster',
    className = '',
}: TestSectionHeadProps) {
    const user = useUserStore((state) => state.user)
    const loadingUser = useUserStore((state) => state.loading)

    if (loadingUser || !user) {
        return (
            <TestSectionHeadSkeleton />

        )
    }
    return (
        <div
            className={`
                flex justify-between items-center
                flex-wrap gap-3
                border-b border-indigo-100
                m-2
                pb-4
                ${className}
            `}
        >

            {/* LEFT */}
            <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-md">
                    👤
                </div>

                <div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-800">
                        Welcome{' '}
                        {user?.firstName &&
                            <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                                {`${user?.firstName}`.slice(0, 1).toUpperCase()}{`${user?.firstName}`.slice(1).toLowerCase()}
                            </span>
                        }
                        <span>&nbsp;</span>
                        {user?.lastName &&
                            <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                                {`${user?.lastName}`.slice(0, 1).toUpperCase()}{`${user?.lastName}`.slice(1).toLowerCase()}
                            </span>
                        }
                        {user?.username && (!user?.firstName || !user?.lastName) &&
                            <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                                {` ${user?.username}`}
                            </span>
                        }

                    </h1>

                    <p className="text-xs text-gray-500 font-medium">
                        Rolling ID: {user?.id} · Prepare Like a Topper
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 ">

                <span className="text-indigo-500 text-sm font-bold">
                    {badgeText}
                </span>

                <span className="text-gray-600 text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-full">
                    Active Plan: {activePlan}
                </span>
            </div>
        </div>
    )
}