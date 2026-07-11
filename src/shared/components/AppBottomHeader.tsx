'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpenCheck, Home, LogIn, LogOut, Settings, ShoppingBag } from 'lucide-react'
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
    const securityBlockedUntil =
        useUserStore(
            (state) => state.securityBlockedUntil
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
    const logoutDisabled =
        securityBlockedUntil > Math.floor(Date.now() / 1000)

    const handleLogout = async () => {
        if (logoutDisabled) {
            return
        }

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

    const navItemClass = (active: boolean) =>
        [
            'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black transition',
            active
                ? 'text-[#4A3F77]'
                : 'text-[#8B86A3] hover:text-[#4A3F77]'
        ].join(' ')

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-[1000] px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] sm:px-5">
                <nav
                    aria-label="Primary"
                    className="mx-auto grid h-[72px] w-full max-w-[1280px] grid-cols-[1fr_1fr_76px_1fr_1fr] items-center gap-1 rounded-[28px] border border-[#E7E2F6] bg-white/95 px-2 shadow-[0_-10px_34px_rgba(42,31,92,0.18)] backdrop-blur-md"
                >
                    <Link
                        href="/"
                        aria-label="Home"
                        aria-current={pathname === '/' ? 'page' : undefined}
                        className={navItemClass(pathname === '/')}
                    >
                        <Home size={20} strokeWidth={2.5} />
                        <span className="truncate">Home</span>
                    </Link>

                    <Link
                        href="/my-purchase"
                        aria-label="My Purchase"
                        aria-current={pathname === '/my-purchase' ? 'page' : undefined}
                        className={navItemClass(pathname === '/my-purchase')}
                    >
                        <ShoppingBag size={20} strokeWidth={2.5} />
                        <span className="truncate">Purchase</span>
                    </Link>

                    <div className="relative flex h-full items-center justify-center">
                        <Link
                            href="/series"
                            aria-label="All Series"
                            aria-current={pathname === '/series' || pathname.startsWith('/series/') ? 'page' : undefined}
                            className="absolute -top-6 grid h-[68px] w-[68px] place-items-center rounded-full border-[6px] border-white bg-[#4A3F77] text-white shadow-[0_14px_28px_rgba(74,63,119,0.32)] transition hover:-translate-y-0.5 hover:bg-[#3D3466]"
                        >
                            <BookOpenCheck size={26} strokeWidth={2.5} />
                        </Link>
                        <span className="mt-10 text-[10px] font-black text-[#4A3F77]">Series</span>
                    </div>

                    <Link
                        href="/setting"
                        aria-label="Settings"
                        aria-current={onSettingPage ? 'page' : undefined}
                        className={navItemClass(onSettingPage)}
                    >
                        <Settings size={20} strokeWidth={2.5} />
                        <span className="truncate">Settings</span>
                    </Link>

                    {authenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={logoutDisabled}
                            title={displayName}
                            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black text-[#8B86A3] transition hover:text-[#4A3F77] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOut size={20} strokeWidth={2.5} />
                            <span className="truncate">Sign Out</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => void goToLoginAfterRememberingPage(router)}
                            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black text-[#8B86A3] transition hover:text-[#4A3F77]"
                        >
                            <LogIn size={20} strokeWidth={2.5} />
                            <span className="truncate">Sign In</span>
                        </button>
                    )}
                </nav>
            </div>
            <div aria-hidden="true" className="h-24" />
        </>
    )
}
