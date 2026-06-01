'use client'

import dynamic from 'next/dynamic'

import { useEffect } from "react"

import { useLayoutStore } from "../../shared/store/uiResStore"
import { useUserStore } from "../../shared/store/user"

import { useRouter } from "next/navigation"

// ========================================
// LAZY LOAD COMPONENTS
// ========================================

const HomeCenter = dynamic(
    () => import("../../shared/components/HomeCenter"),
)

const LeftSidebar = dynamic(
    () => import("../../shared/components/LeftSidebar"),
    {
        ssr: false
    }
)

const RightSidebar = dynamic(
    () => import("../../shared/components/RightSidebar"),
    {
        ssr: false
    }
)

const Footer = dynamic(
    () => import("../../shared/components/Footer")
)

const LiveBubbleBtn = dynamic(
    () => import("../../shared/components/LiveBubbleBtn"),
    {
        ssr: false
    }
)

export default function HomePage() {

    const router =
        useRouter()

    // ================= USER =================

    const {
        authenticated
    } =
        useUserStore()

    // ================= WS =================







    // ================= LAYOUT =================

    const {
        leftMobile,
        rightMobile,

        setLeftMobile,
        setRightMobile

    } =
        useLayoutStore()

    const rightSidebarOpen =
        useLayoutStore(
            (state) => state.rightSidebarOpen
        )

    const setRightSidebarOpen =
        useLayoutStore(
            (state) => state.setRightSidebarOpen
        )



    useEffect(() => {

        const handleResize =
            () => {

                setRightMobile(
                    window.innerWidth < 900
                )

                setLeftMobile(
                    window.innerWidth < 1280
                )
            }

        handleResize()

        window.addEventListener(
            "resize",
            handleResize
        )


        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            )
        }

    }, [])

    // =========================================
    // UI
    // =========================================

    return (

        <div
            className="
                min-h-screen
                bg-gray-100
                flex
                flex-col
            "
        >

            {/* MAIN */}
            <div
                className="
                    flex
                    w-full
                    items-start
                "
            >

                {/* LEFT */}
                {
                    !leftMobile &&
                    authenticated && (

                        <div
                            className="
                                w-[250px]
                                shrink-0
                                sticky
                                top-0
                                h-screen
                                overflow-y-auto
                            "
                        >
                            <LeftSidebar />
                        </div>
                    )
                }

                {/* CENTER */}
                <div
                    className="
                        flex-1
                        min-w-0
                        w-[300px]
                    "
                >
                    <HomeCenter />
                </div>

                {/* RIGHT */}
                {
                    !rightMobile &&
                    authenticated && (

                        <div
                            className="
                                w-[250px]
                                shrink-0
                                sticky
                                top-0
                                h-screen
                                overflow-y-auto
                            "
                        >
                            <RightSidebar />
                        </div>
                    )
                }

                {/* MOBILE DRAWERS */}
                {
                    leftMobile &&
                    authenticated && (
                        <LeftSidebar />
                    )
                }

                {
                    rightMobile &&
                    authenticated && (
                        <RightSidebar />
                    )
                }

            </div>

            {/* FOOTER */}


            <Footer />

            {/* FLOAT BUTTON */}
            {
                rightMobile &&
                leftMobile &&
                !rightSidebarOpen && (

                    <div
                        className="
                            fixed
                            bottom-5
                            right-5
                            z-[1200]
                        "
                    >

                        <div
                            onClick={() =>
                                authenticated
                                    ? setRightSidebarOpen(true)
                                    : router.push("/login")
                            }
                        >
                            <LiveBubbleBtn />
                        </div>

                    </div>
                )
            }

        </div>
    )
}