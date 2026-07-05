'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Home, LogIn, LogOut, Settings } from 'lucide-react'
import { LOGOUT } from '../../../api'
import { useUserStore } from '../store/user'
import { goToLoginAfterRememberingPage } from '../utils/loginRedirect'

const hiddenRoutes = [
    '/',
    '/test',
    '/typingTest',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
]

const shouldHideHeader = (pathname: string) => {
    if (hiddenRoutes.includes(pathname)) {
        return true
    }

    return pathname.startsWith('/test/') ||
        pathname.startsWith('/typingTest/')
}

export default function AppBottomHeader() {
    const pathname =
        usePathname()
    const router =
        useRouter()
    const user =
        useUserStore(
            (state) => state.user
        )
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const logout =
        useUserStore(
            (state) => state.logout
        )

    if (shouldHideHeader(pathname)) {
        return null
    }

    const displayName =
        authenticated
            ? (user?.username || user?.firstName || 'User')
            : 'Guest'
    const onSettingPage =
        pathname === '/setting'
    const onMyPurchasePage =
        pathname === '/my-purchase'

    const handleLogout = async () => {
        try {
            await fetch(
                LOGOUT,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            )
        } catch {
        } finally {
            logout()

            if (onSettingPage) {
                router.replace('/')
            }
        }
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
            return
        }

        router.push('/')
    }

    return (
        <>
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] px-1.5 py-2 min-[360px]:px-2 sm:px-3 lg:px-4">
                <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-t-[20px] border border-b-0 border-[#E2E8F0] bg-white/95 px-3 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur min-[360px]:rounded-t-[24px] sm:rounded-t-[30px] sm:px-5">
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Back"
                        className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#4A3F77] shadow-sm transition hover:bg-[#F8FAFC]"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>

                    <div className="flex min-w-0 items-center justify-end gap-2">
                        <span
                            title={displayName}
                            className="min-w-0 max-w-[34vw] truncate rounded-full bg-[#F8F6FF] px-3 py-2 text-xs font-black text-[#4A3F77] sm:max-w-none"
                        >
                            {displayName}
                        </span>

                        <Link
                            href="/"
                            aria-label="Home"
                            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#4A3F77] shadow-sm transition hover:bg-[#F8FAFC]"
                        >
                            <Home size={18} strokeWidth={2.5} />
                        </Link>

                        {!onMyPurchasePage && (
                            <Link
                                href="/my-purchase"
                                aria-label="My Purchase"
                                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#4A3F77] shadow-sm transition hover:bg-[#F8FAFC]"
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} />
                            </Link>
                        )}

                        {!onSettingPage && (
                            <Link
                                href="/setting"
                                aria-label="Settings"
                                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#4A3F77] shadow-sm transition hover:bg-[#F8FAFC]"
                            >
                                <Settings size={18} strokeWidth={2.5} />
                            </Link>
                        )}

                        {authenticated ? (
                            <button
                                onClick={handleLogout}
                                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-[0_3px_8px_rgba(42,31,92,.25)] transition hover:bg-[#3D3466]"
                            >
                                <LogOut size={15} strokeWidth={2.5} />
                                <span>Sign Out</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => void goToLoginAfterRememberingPage(router)}
                                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-[0_3px_8px_rgba(42,31,92,.25)] transition hover:bg-[#3D3466]"
                            >
                                <LogIn size={15} strokeWidth={2.5} />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div aria-hidden="true" className="h-16" />
        </>
    )
}
