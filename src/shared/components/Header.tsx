'use client'

import { useEffect, useState } from "react"
import { useLayoutStore } from "../store/uiResStore"
import { useUserStore } from "../store/user"
import Link from "next/link"
import { useRouter } from "next/navigation"




export default function Header() {
    const router = useRouter()

    const {
        user,
        authenticated,
        fetchUser,

    } = useUserStore()
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

            await fetchUser()

            const {
                authenticated
            } = useUserStore.getState()

            if (authenticated) {

                router.replace("/")
            }
        }

        checkAuth()

    }, [])
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
                            className="w-12 h-12 rounded-2xl bg-white/15  backdrop-blur-xl border border-white/15 flex items-center justify-center text-white text-xl">
                            🎓
                        </div>

                        <div>

                            <h2 className="text-white text-xl font-bold">
                                Mentor
                            </h2>

                            <p className="text-white/70 text-sm">
                                Education Dashboard
                            </p>

                        </div>

                    </div>

                    {/* <!-- RIGHT (ADDED mobile profile trigger) --> */}
                    <div className="flex items-center gap-3 flex-wrap">

                        {/* <!-- SEARCH --> */}
                        <div className="relative">

                            <input type="text" placeholder="Search courses..."
                                className="w-[170px] lg:w-[320px] h-11 rounded-full bg-white/15  backdrop-blur-xl border border-white/15 pl-11 pr-4 text-white placeholder:text-white/60 outline-none" />

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                🔍
                            </span>

                        </div>

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
                                        src="https://i.pravatar.cc/100?img=12"
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

                                <Link href="/login">

                                    <button
                                        className="
                                        cursor-pointer
                    bg-transparent
                    border-2
                    border-white
                    rounded-full
                    px-8
                    py-2.5
                    text-white
                    font-semibold
                "
                                    >
                                        Sign In
                                    </button>

                                </Link>
                            )
                        }

                    </div>

                </div>

                {/* <!-- TEXT --> */}
                <div className="mt-8">

                    <p id="greetingText" className="text-violet-200 font-semibold mb-2">
                        Good Morning 👋
                    </p>

                    <h1 id="welcomeUser" className="text-white text-3xl lg:text-4xl font-black leading-tight">
                        Welcome Back,  {user?.username}
                    </h1>

                    <p className="text-white/70 mt-4 leading-7 max-w-[650px]">
                        Manage students, online courses, mentors, analytics and performance from one modern
                        dashboard.
                    </p>

                </div>

                {/* <!-- STATS --> */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">

                    {/* <!-- CARD --> */}
                    <div className="bg-white/15  backdrop-blur-xl border border-white/15 rounded-3xl p-4 text-white">

                        <p className="text-xs text-white/70 mb-2">
                            Students
                        </p>

                        <div className="flex items-center justify-between">

                            <h2 className="text-2xl font-black">
                                2,635
                            </h2>

                            <button className="w-8 h-8 rounded-full bg-white text-black text-sm">
                                ↗
                            </button>

                        </div>

                    </div>

                    {/* <!-- CARD --> */}
                    <div className="bg-white/15  backdrop-blur-xl border border-white/15 rounded-3xl p-4 text-white">

                        <p className="text-xs text-white/70 mb-2">
                            Teachers
                        </p>

                        <div className="flex items-center justify-between">

                            <h2 className="text-2xl font-black">
                                29
                            </h2>

                            <button className="w-8 h-8 rounded-full bg-white text-black text-sm">
                                ↗
                            </button>

                        </div>

                    </div>

                    {/* <!-- CARD --> */}
                    <div className="bg-[#ebf46d] rounded-3xl p-4">

                        <p className="text-xs font-semibold mb-3">
                            Add Members
                        </p>

                        <div className="flex gap-2 flex-wrap">

                            <button className="bg-white px-3 py-2 rounded-xl text-xs font-medium">
                                + Student
                            </button>

                            <button className="bg-white px-3 py-2 rounded-xl text-xs font-medium">
                                + Courses
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}