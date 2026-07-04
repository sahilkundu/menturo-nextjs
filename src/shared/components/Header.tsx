'use client'

import { useEffect, useState } from "react"
import { useLayoutStore } from "../store/uiResStore"
import { useUserStore } from "../store/user"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useWSChatStore } from "../store/wsChat"
import { showRouteLoader } from "../utils/routeLoader"
import { goToLoginAfterRememberingPage } from "../utils/loginRedirect"

import { Home, LogIn } from 'lucide-react'

type HeaderProps = {
    variant?: "hero" | "topbar"
}

function TypingTestSpotlight({
    onOpen
}: {
    onOpen: () => void
}) {
    return (
        <section className="relative z-10 px-5 pb-5 lg:px-6 lg:pb-6">
            <button
                type="button"
                onClick={onOpen}
                className="group grid w-full overflow-hidden rounded-2xl border border-[#C7F7D8] bg-[linear-gradient(135deg,#F8FFE8_0%,#DFF86A_45%,#BDF7E2_100%)] p-4 text-left shadow-[0_18px_42px_rgba(40,199,111,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(40,199,111,.28)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
            >
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#153B2E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                            Typing Test
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Live now
                        </span>
                    </div>
                    <h3 className="text-lg font-black text-[#153B2E] sm:text-xl">
                        Practice Hindi and English typing separately
                    </h3>
                    <p className="mt-1 max-w-2xl text-xs font-semibold leading-5 text-[#37544B] sm:text-sm">
                        Open the focused typing workspace for speed, accuracy, levels, and typing attempts.
                    </p>
                </div>

                <span className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-[#153B2E] shadow-sm transition group-hover:bg-[#153B2E] group-hover:text-white sm:mt-0">
                    Explore Typing ↗
                </span>
            </button>
        </section>
    )
}

export default function Header({
    variant = "hero"
}: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const handleTypingProClick = () => {
        showRouteLoader()
        router.push('/typingPro')
    }
    const user =
        useUserStore(
            (state) => state.user
        )
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const authChecked =
        useUserStore(
            (state) => state.authChecked
        )
    const loading =
        useUserStore(
            (state) => state.loading
        )
    const fetchUser =
        useUserStore(
            (state) => state.fetchUser
        )
    const site =
        useWSChatStore(
            s => s.site
        )
    const headRight = useLayoutStore(
        (state) => state.rightMobile
    )
    const headLeft = useLayoutStore(
        (state) => state.leftMobile
    )
    const rightSidebarOpen = useLayoutStore(
        (state) => state.rightSidebarOpen
    )
    const leftSidebarOpen = useLayoutStore(
        (state) => state.leftSidebarOpen
    )


    const setLeftSidebarOpen = useLayoutStore(
        (state) => state.setLeftSidebarOpen
    )
    const setRightSidebarOpen = useLayoutStore(
        (state) => state.setRightSidebarOpen
    )
    useEffect(() => {

        const checkAuth = async () => {
            if (
                authChecked ||
                loading
            ) {
                return
            }

            await fetchUser()

            const {
                authenticated
            } = useUserStore.getState()

            if (authenticated && variant === "hero") {

                if (pathname !== "/") {
                    showRouteLoader()
                    router.replace("/")
                }
            }
        }

        checkAuth()

    }, [
        authChecked,
        fetchUser,
        loading,
        pathname,
        router,
        variant
    ])

    if (variant === "topbar") {
        return (
            <div className="w-full border-b border-[#E2E8F0] bg-white px-3 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:px-5">
                <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] text-white shadow-[0_8px_18px_rgba(79,70,229,0.28)]">
                            <Image
                                src="https://cdn.menturo.in/avatar/avatar.png"
                                alt=""
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-base font-black text-[#1F2937] sm:text-lg">
                                {authenticated
                                    ? `Welcome ${user?.username || "Student"}`
                                    : "Sign in to continue"}
                            </h2>
                            <p className="truncate text-xs font-semibold text-[#64748B] sm:text-sm">
                                {authenticated
                                    ? `Rolling ID: ${user?.id || "guest"} · Prepare Like a Topper`
                                    : "Access your test series and attempts"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
                        <Link
                            href="/typingPro"
                            className="hidden text-sm font-black text-[#4F46E5] transition hover:text-[#312E81] sm:inline-flex"
                        >
                            🎯 Rank Booster
                        </Link>

                        {authenticated && (
                            <span className="hidden rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-black text-[#475569] md:inline-flex">
                                Active Plan: Premium
                            </span>
                        )}

                        {authenticated ? (
                            <Link
                                href="/"
                                aria-label="Home"
                                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:bg-[#F8FAFC]"
                            >
                                <Home size={17} strokeWidth={2.4} />
                            </Link>
                        ) : (
                            <button
                                onClick={() => void goToLoginAfterRememberingPage(router)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-[0_3px_8px_rgba(42,31,92,.25)] transition hover:bg-[#3D3466]"
                            >
                                <LogIn size={15} strokeWidth={2.5} />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <style>{`
        @keyframes zigzagMove {

            0% {
                transform: translate(0, 0);
            }

            25% {
                transform: translate(-18px, -35px);
            }

            50% {
                transform: translate(18px, -70px);
            }

            75% {
                transform: translate(-15px, -105px);
            }

            100% {
                transform: translate(0, -140px);
            }

        }
    `}</style>

                <span className="
        absolute
        left-[5%]
        top-[18%]
        w-[18px]
        h-[18px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_4s_linear_infinite]
    " />

                <span className="
        absolute
        left-[22%]
        top-[70%]
        w-[10px]
        h-[10px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_3s_linear_infinite]
    " />

                <span className="
        absolute
        left-[40%]
        top-[25%]
        w-[24px]
        h-[24px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_5s_linear_infinite]
    " />

                <span className="
        absolute
        left-[58%]
        top-[80%]
        w-[14px]
        h-[14px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_4s_linear_infinite]
    " />

                <span className="
        absolute
        left-[75%]
        top-[20%]
        w-[20px]
        h-[20px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_6s_linear_infinite]
    " />

                <span className="
        absolute
        left-[90%]
        top-[60%]
        w-[12px]
        h-[12px]
        rounded-full
        bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.95),rgba(255,255,255,.18))]
        shadow-[0_0_18px_rgba(255,255,255,.35),0_0_40px_rgba(255,255,255,.12)]
        animate-[zigzagMove_8s_linear_infinite]
    " />

            </div>


            {/* <!-- YOUR SAME CONTENT --> */}
            <div className="relative z-10 p-5 lg:p-6">

                {/* <!-- TOPBAR (MODIFIED: added mobile menu button + mobile profile trigger - original structure preserved) --> */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">

                    {/* <!-- LEFT (ADDED mobile menu button) --> */}
                    <div className="flex items-center gap-4">

                        {/* <!-- MOBILE MENU BUTTON (ADDED) --> */}
                        {authenticated &&
                            <div
                                id="mobileMenuBtn"
                                className="
        hidden
        max-[1280px]:flex

        w-10
        h-10

        rounded-full

        bg-white/15
        backdrop-blur-xl

        items-center
        justify-center

        text-white
        text-[20px]

        cursor-pointer

        transition-all
        duration-200
    "
                                onClick={() =>
                                    headLeft && !leftSidebarOpen ? setLeftSidebarOpen(true) : ""}

                            >
                                ☰
                            </div>}

                        <div
                            className="
        w-12
        h-12
        rounded-2xl
        bg-white/15
        backdrop-blur-xl
        border
        border-white/15
        flex
        items-center
        justify-center
        shrink-0
        p-1
    "
                        >
                            <Image
                                src="https://cdn.menturo.in/img/M3.png"
                                alt="logo"
                                width={40}
                                height={40}
                                loading="lazy"
                                className="object-contain mx-auto"
                            />
                        </div>

                        <div>

                            <h2 className="text-white text-xl font-bold">
                                Menturo
                            </h2>

                            <p className="text-white/70 text-sm">
                                Education Dashboard
                            </p>

                        </div>

                    </div>

                    {/* <!-- RIGHT (ADDED mobile profile trigger) --> */}
                    <div className="flex items-center gap-3 flex-wrap">

                        <Link href="/contact" className="inline-flex h-9 items-center rounded-xl bg-red-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-red-700">
                            Support / सहायता
                        </Link>



                        {/* <!-- MODE --> */}

                        {authenticated &&
                            <button className="w-10 h-10 rounded-full bg-white/15  backdrop-blur-xl border border-white/15 text-white">
                                🔔
                            </button>}

                        {/* DESKTOP PROFILE IMAGE */}


                        {/* MOBILE PROFILE IMAGE */}

                        {
                            authenticated ? (

                                headRight ? (

                                    <img
                                        // src="https://i.pravatar.cc/100?img=12"
                                        src="https://cdn.menturo.in/avatar/avatar.png"
                                        className="
                    w-10
                    h-10
                    rounded-full
                    border-2
                    border-white
                    cursor-pointer
                "
                                        onClick={() => {

                                            if (!rightSidebarOpen) {
                                                setRightSidebarOpen(true)
                                            }
                                        }}
                                    />

                                ) : null

                            ) : (

                                <button
                                    onClick={() => void goToLoginAfterRememberingPage(router)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#4A3F77] px-3 text-xs font-bold text-white shadow-[0_3px_8px_rgba(42,31,92,.25)] transition hover:bg-[#3D3466]"
                                >
                                        <LogIn size={15} strokeWidth={2.5} />
                                        <span>Sign In</span>
                                </button>
                            )
                        }

                    </div>

                </div>

                {/* <!-- TEXT --> */}
                <div className="mt-3">

                    <p id="greetingText" className="text-violet-200 font-semibold ">
                        <h4 className="text-sm md:text-base font-semibold mt-2">
                            {new Date().getHours() < 12
                                ? "Good Morning"
                                : new Date().getHours() < 17
                                    ? "Good Afternoon"
                                    : new Date().getHours() < 21
                                        ? "Good Evening"
                                        : "Good Night"}{" "}
                            👋
                        </h4>
                    </p>
                    {authenticated &&
                        <h3 id="welcomeUser" className="text-white text-1xl lg:text-1xl font-black leading-tight">
                            Welcome Back,  {user?.username}
                        </h3>
                    }
                    {/* <p className="text-white/70 mt-2 leading-7 max-w-[650px]">
                        Manage students, online courses, mentors, analytics and performance from one modern
                        dashboard.
                    </p> */}

                </div>

                {/* <!-- STATS --> */}
                <div className="grid grid-cols-2 gap-2 mt-2 auto-rows-min w-full">

                    {/* Students and Teachers cards are hidden for now, keeping the code here for later reuse.
                    <div className="bg-white/15 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 text-white h-fit">

                        <p className="text-[11px] text-white/70 mb-1 font-normal">
                            Students
                        </p>

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-normal">
                                {site?.totalUsers}
                            </h2>

                            <button className="w-6 h-6 rounded-full bg-white text-black text-xs font-normal">
                                ↗
                            </button>

                        </div>

                    </div>

                    <div className="bg-white/15 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 text-white h-fit">

                        <p className="text-[11px] text-white/70 mb-1 font-normal">
                            Teachers
                        </p>

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-normal">
                                29
                            </h2>

                            <button className="w-6 h-6 rounded-full bg-white text-black text-xs font-normal">
                                ↗
                            </button>

                        </div>

                    </div>
                    */}

                    {/* Add Members card is hidden for now, keeping the code here for later reuse.
                    <div className="bg-[#ebf46d] rounded-2xl p-2.5 h-fit">

                        <p className="text-[11px] font-normal mb-2">
                            Add Members
                        </p>

                        <div className="flex gap-1.5 flex-wrap">

                            <button className="bg-white px-2 py-1 rounded-lg text-[11px] font-normal">
                                + Student
                            </button>

                            <button className="bg-white px-2 py-1 rounded-lg text-[11px] font-normal">
                                + Courses
                            </button>

                        </div>

                    </div>
                    */}


                </div>

            </div >

            <TypingTestSpotlight onOpen={handleTypingProClick} />

        </>
    )
}
