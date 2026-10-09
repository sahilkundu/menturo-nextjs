'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { useLayoutStore } from "../store/uiResStore"
import Live from "./Live"
import { useUserStore } from "../store/user"
import { LOGOUT, WALLET } from "../../../api"
import { useWSChatStore } from "../store/wsChat"

const isUserOnline = (
    value: unknown
) => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true" ||
            value === "1"
    }

    return value === true ||
        value === 1
}

export default function RightSidebar() {

    const router = useRouter()

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
    const head = useLayoutStore(
        (state) => state.rightMobile
    )

    const rightSidebarOpen = useLayoutStore(
        (state) => state.rightSidebarOpen
    )
    const setRightSidebarOpen = useLayoutStore(
        (state) => state.setRightSidebarOpen
    )
    const liveBubbleOpen = useLayoutStore(
        (state) => state.liveBubbleOpen
    )
    const setLiveBubbleOpen = useLayoutStore(
        (state) => state.setLiveBubbleOpen
    )
    const wsUsers =
        useWSChatStore(
            (state) =>
                state.users
        )
    const users =
        useMemo(
            () =>
                Object.values(wsUsers),
            [wsUsers]
        )
    const onlineUsers =
        useMemo(
            () =>
                users.filter(
                    (user) =>
                        isUserOnline(
                            user.online
                        )
                ),
            [users]
        )

    // MOUNT ANIMATION FIX
    const [mounted, setMounted] = useState(false)
    const [walletBalance, setWalletBalance] = useState<number | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!authenticated) {
            setWalletBalance(null)
            return
        }

        let cancelled = false
        fetch(WALLET, { credentials: "include", cache: "no-store" })
            .then((response) => response.json())
            .then((data) => {
                if (!cancelled && data?.success !== false) {
                    setWalletBalance(Number(data?.balance || 0))
                }
            })
            .catch(() => {
                if (!cancelled) setWalletBalance(null)
            })

        return () => {
            cancelled = true
        }
    }, [authenticated])

    const logoutDisabled =
        securityBlockedUntil > Math.floor(Date.now() / 1000)

    const handleLogout = useCallback(async () => {
        if (logoutDisabled) {
            return
        }

        try {

            // =========================
            // Logout API
            // =========================

            await fetch(
                LOGOUT,
                {
                    method: "POST",

                    credentials: "include",
                }
            )

            // =========================
            // Clear Zustand State
            // =========================

            logout()

            // =========================
            // Redirect
            // =========================

            // router.replace("/login")

        } catch {
        }
    }, [logout, logoutDisabled])

    return (

        <>

            {/* OVERLAY */}
            <div
                onClick={() => setRightSidebarOpen(false)}
                className={`
                    fixed
                    inset-0
                    bg-black/40
                    z-[1001]

                    transition-all
                    duration-500
                    ease-in-out

                    ${rightSidebarOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }
                `}
                style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)'
                }}
            />

            {/* SIDEBAR / BOTTOM SHEET */}
            <div
                id="profileBottomSheet"
                className={`
        bg-white
        overflow-y-auto
        scrollbar-hidden
        transform-gpu

        ${head
                        ? `
                fixed
                left-0
                right-0
                bottom-0
                max-h-[66vh]
                z-[1002]

                rounded-t-[30px]

                shadow-[0_-10px_40px_rgba(0,0,0,0.18)]
              `
                        : `
                relative
                h-screen
                w-full
              `
                    }
    `}
                style={{
                    transform: head
                        ? mounted && rightSidebarOpen
                            ? "translateY(0) scale(1)"
                            : "translateY(100%) scale(0.96)"
                        : "translateY(0) scale(1)",

                    opacity: head
                        ? mounted && rightSidebarOpen
                            ? 1
                            : 0.92
                        : 1,

                    transition:
                        "transform 850ms cubic-bezier(0.16,1,0.3,1), opacity 500ms ease",

                    willChange: "transform, opacity",

                    transformOrigin: "bottom center",

                    backfaceVisibility: "hidden",

                    WebkitFontSmoothing: "antialiased"
                }}
            >

                {/* HEADER */}
                {!liveBubbleOpen &&
                    <div
                        className={
                            head
                                ? `
                                sticky
                                top-0
                                z-10
                                bg-white
                                px-5
                                pt-5
                                pb-4
                                border-b
                                border-gray-100
                                rounded-t-[30px]
                                flex
                                justify-between
                                items-center
                              `
                                : `
                                flex
                                justify-between
                                items-center
                                mb-5
                                p-2
                              `
                        }
                    >

                        {/* DRAG HANDLE */}
                        {head && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-2">
                                <div className="w-16 h-1.5 rounded-full bg-gray-300"></div>
                            </div>
                        )}

                        <span className="text-lg text-center md:text-xl font-semibold mt-2">
                            Your Profile
                        </span>

                        {head && (
                            <button
                                onClick={() => setRightSidebarOpen(false)}
                                className="
                                w-10
                                h-10
                                rounded-full
                                bg-gray-100
                                flex
                                items-center
                                justify-center
                                hover:bg-gray-200
                                active:scale-95
                                transition-all
                                duration-200
                                cursor-pointer
                                mt-1
                                text-lg
                            "
                            >
                                ✕
                            </button>
                        )}

                    </div>}

                <div className="p-1 lg:-mt-4">

                    {/* PROFILE INFO */}
                    {!liveBubbleOpen &&
                        <div className="text-center">

                            <div className="w-24 h-24 rounded-full border-[5px] border-violet-600 p-1 mx-auto">
                                <img
                                    // src="https://i.pravatar.cc/100?img=12"
                                    src="https://cdn.menturo.in/avatar/avatar.png"
                                    className="w-full h-full rounded-full object-cover"
                                    alt=""
                                />
                            </div>

                            <h4 className="text-sm md:text-base font-semibold mt-2">
                                {new Date().getHours() < 12
                                    ? "Good Morning"
                                    : new Date().getHours() < 17
                                        ? "Good Afternoon"
                                        : new Date().getHours() < 21
                                            ? "Good Evening"
                                            : "Good Night"}{" "}
                                {user?.username}
                            </h4>

                            <p className="text-sm md:text-base text-gray-500 mt-2 leading-6">
                                Continue Your Journey And Achieve Target
                            </p>

                            {/* Pro Member and Rank badges hidden for now, keeping the code here for later reuse.
                            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">

                                <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold text-violet-700 inline-block mr-2">
                                    ⭐ Pro Member
                                </div>

                                <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold text-violet-700 inline-block">
                                    ⭐ Your Rank
                                </div>

                            </div>
                            */}

                        </div>}

                    {/* ACTIONS */}
                    {!liveBubbleOpen &&
                        <div className="mt-6 pt-4 border-t border-gray-100">

                            <button
                                className="
                                w-full
                                py-3
                                rounded-2xl
                                bg-red-50
                                text-red-600
                                text-sm
                                md:text-base
                                font-semibold
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition-all
                                duration-300
                                hover:bg-red-100
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                                disabled={logoutDisabled}
                                onClick={() => {
                                    handleLogout()
                                }}
                            >
                                Logout
                            </button>

                        </div>}

                    {/* STATS */}
                    {authenticated && !liveBubbleOpen &&
                        <div className="mt-6 grid grid-cols-1 gap-2">

                            <div className="min-w-0 rounded-2xl bg-green-50 p-3">

                                <p className="text-xs text-gray-500 mb-2">
                                    Currently Live
                                </p>

                                <div className="flex min-w-0 items-center gap-2">

                                    <span className="h-3 w-3 shrink-0 rounded-full bg-green-500 animate-pulse"></span>

                                    <h2 className="min-w-0 truncate text-2xl md:text-3xl font-black text-green-600">
                                    {onlineUsers.length}
                                    </h2>

                                </div>

                            </div>

                        </div>}

                    {authenticated && !liveBubbleOpen && walletBalance !== null &&
                        <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">Wallet balance</p>
                                    <p className="mt-1 text-2xl font-black text-violet-700">{walletBalance} <span className="text-xs font-bold text-violet-500">credits</span></p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRightSidebarOpen(false)
                                        router.push("/wallet")
                                    }}
                                    className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
                                >
                                    Buy credits
                                </button>
                            </div>
                        </div>}

                    {/* ACTIVE USERS */}
                    {authenticated && (
                    <div
                        className={`
        mt-7

        ${liveBubbleOpen
                                ? `
                
                max-h-[66vh]
                overflow-y-auto
                pr-1
              `
                                : ""
                            }
    `}
                    >
                        {!liveBubbleOpen &&
                            <div className="mb-5">

                                <h3 className="text-base md:text-lg font-semibold">
                                    Active Users
                                </h3>

                            </div>
                        }

                        {!liveBubbleOpen && (
                            <Live
                                activeDot={false}
                                users={onlineUsers}
                            />
                        )}
                        {liveBubbleOpen &&
                            <Live
                                activeDot={true}
                                users={users}
                            />
                        }
                    </div>
                    )}

                </div>

            </div>

        </>
    )
}
