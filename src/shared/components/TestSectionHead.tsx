'use client'

import { Home, LogIn } from "lucide-react"
import { useUserStore } from "../store/user"
import TestSectionHeadSkeleton from "./Skeleton/TestSection/TestSectionHeadSkeleton"

interface TestSectionHeadProps {
    userName: string
    rollingId: string
    activePlan: string
    badgeText?: string
    onHome?: () => void
    onLogin?: () => void
    showSignIn?: boolean

    className?: string
}

export default function TestSectionHead({
    userName,
    rollingId,
    activePlan,
    badgeText = '🎯 Rank Booster',
    onHome,
    onLogin,
    showSignIn = false,
    className = '',
}: TestSectionHeadProps) {
    const user = useUserStore((state) => state.user)
    const loadingUser = useUserStore((state) => state.loading)

    if (loadingUser || !user) {
        if (!loadingUser) {
            return (
                <div
                    className={`
                        flex justify-between items-center
                        flex-wrap gap-3
                        border-b border-indigo-100
                        px-2
                        pb-3
                        ${className}
                    `}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-md">
                            👤
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-black tracking-tight text-gray-800">
                                Welcome Guest
                            </h1>

                            <p className="text-xs text-gray-500 font-medium truncate">
                                Sign in to save test progress
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex text-gray-600 text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-full">
                            Active Plan: {activePlan}
                        </span>

                        {onHome && (
                            <button
                                type="button"
                                onClick={onHome}
                                title="Home"
                                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                <Home size={16} />
                            </button>
                        )}

                        {showSignIn && onLogin && (
                            <button
                                type="button"
                                onClick={onLogin}
                                title="Sign In"
                                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#3D3466]"
                            >
                                <LogIn size={15} />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            )
        }

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
                px-2
                pb-3
                ${className}
            `}
        >

            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0">

                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-md">
                    👤
                </div>

                <div className="min-w-0">
                    <h1 className="text-lg md:text-xl font-black tracking-tight text-gray-800">
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

                    <p className="text-xs text-gray-500 font-medium truncate">
                        Rolling ID: {user?.id} · Prepare Like a Topper
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

                <span className="hidden sm:inline-flex text-indigo-500 text-sm font-bold bg-white/60 backdrop-blur-sm rounded-full px-3 py-2">
                    {badgeText}
                </span>

                <span className="text-gray-600 text-xs font-semibold bg-indigo-50 px-2 py-1 rounded-full">
                    Active Plan: {activePlan}
                </span>

                {onHome && (
                    <button
                        type="button"
                        onClick={onHome}
                        title="Home"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <Home size={16} />
                    </button>
                )}

                {showSignIn && onLogin && (
                    <button
                        type="button"
                        onClick={onLogin}
                        title="Sign In"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#3D3466]"
                    >
                        <LogIn size={15} />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </div>
    )
}
