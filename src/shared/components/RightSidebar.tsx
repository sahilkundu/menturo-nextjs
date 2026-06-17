'use client'

import { useEffect, useState } from "react"

import { useLayoutStore } from "../store/uiResStore"
import Live from "./Live"
import { useUserStore } from "../store/user"
import { LOGOUT } from "../../../api"
import { useWSChatStore } from "../store/wsChat"
export default function RightSidebar() {

    const {
        user,
        logout
    } = useUserStore()
    const head = useLayoutStore(
        (state) => state.rightMobile
    )

    const rightSidebarOpen = useLayoutStore(
        (state) => state.rightSidebarOpen
    )
    const site =
        useWSChatStore(
            s => s.site
        )
    // console.log(site)
    const setRightSidebarOpen = useLayoutStore(
        (state) => state.setRightSidebarOpen
    )
    const liveBubbleOpen = useLayoutStore(
        (state) => state.liveBubbleOpen
    )

    // MOUNT ANIMATION FIX
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    const handleLogout = async () => {

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

        } catch (error) {

            console.log(error)
        }
    }

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

                            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">

                                <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold text-violet-700 inline-block mr-2">
                                    ⭐ Pro Member
                                </div>

                                <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold text-violet-700 inline-block">
                                    ⭐ Your Rank
                                </div>

                            </div>

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
                            "
                                onClick={() => {
                                    handleLogout()
                                }}
                            >
                                Logout
                            </button>

                        </div>}

                    {/* STATS */}
                    {!liveBubbleOpen &&
                        <div className="grid grid-cols-2 gap-3 mt-6">

                            <div className="rounded-2xl bg-violet-50 p-4">

                                <p className="text-xs md:text-sm text-gray-500 mb-2">
                                    Total Users
                                </p>

                                <h2 className="text-2xl md:text-3xl font-black text-violet-700">
                                    {site?.totalUsers}
                                </h2>

                            </div>

                            <div className="rounded-2xl bg-green-50 p-4">

                                <p className="text-xs md:text-sm text-gray-500 mb-2">
                                    Online
                                </p>

                                <div className="flex items-center gap-2">

                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

                                    <h2 className="text-2xl md:text-3xl font-black text-green-600">
                                        {site.totalOnline}
                                    </h2>

                                </div>

                            </div>

                        </div>}

                    {/* ACTIVE USERS */}
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
                            <div className="flex items-center justify-between mb-5">

                                <h3 className="text-base md:text-lg font-semibold">
                                    Active Users
                                </h3>

                                <button className="text-sm md:text-base text-violet-600 font-medium">
                                    View All
                                </button>

                            </div>
                        }

                        {!liveBubbleOpen &&
                            <Live activeDot={false} />
                        }
                        {liveBubbleOpen &&
                            <Live activeDot={true} />
                        }
                    </div>

                </div>

            </div>

        </>
    )
}