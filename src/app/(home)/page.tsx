'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useEffect } from "react"

import { useLayoutStore } from "../../shared/store/uiResStore"
import { useUserStore } from "../../shared/store/user"
import { showRouteLoader } from "../../shared/utils/routeLoader"
import FooterSkeleton from "../../shared/components/Skeleton/FooterSkeleton"
import HomeCenterSkeleton from "../../shared/components/Skeleton/HomeCenterSkeleton"
import HomePageSkeleton from "../../shared/components/Skeleton/HomePageSkeleton"
import LeftSidebarSkeleton from "../../shared/components/Skeleton/LeftSidebarSkeleton"
import LiveBubbleSkeleton from "../../shared/components/Skeleton/LiveBubbleSkeleton"
import RightSidebarSkeleton from "../../shared/components/Skeleton/RightSidebarSkeleton"
import AdSenseAd from "../../shared/components/AdSenseAd"

import { useRouter } from "next/navigation"

// ========================================
// LAZY LOAD COMPONENTS
// ========================================

const HomeCenter = dynamic(
    () => import("../../shared/components/HomeCenter"),
    {
        loading: HomeCenterSkeleton
    }
)

const LeftSidebar = dynamic(
    () => import("../../shared/components/LeftSidebar"),
    {
        loading: LeftSidebarSkeleton,
        ssr: false
    }
)

const RightSidebar = dynamic(
    () => import("../../shared/components/RightSidebar"),
    {
        loading: RightSidebarSkeleton,
        ssr: false
    }
)

const Footer = dynamic(
    () => import("../../shared/components/Footer"),
    {
        loading: FooterSkeleton
    }
)

const LiveBubbleBtn = dynamic(
    () => import("../../shared/components/LiveBubbleBtn"),
    {
        loading: LiveBubbleSkeleton,
        ssr: false
    }
)

export default function HomePage() {

    const router =
        useRouter()

    // ================= USER =================

    const {
        authenticated,
        loading
    } =
        useUserStore()

    // ================= WS =================

    // Add this useEffect to clear cache when needed (optional - for debugging)
    useEffect(() => {
        // Check for clear cache flag in URL (for debugging)
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('clearCache') === 'true') {
            localStorage.clear() // Clears all localStorage
            // Or use your specific clearStore() if imported
            window.location.href = window.location.pathname // Remove param and reload
        }
    }, [])





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

    if (loading) {
        return (
            <HomePageSkeleton authenticated={authenticated} />
        )
    }

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

            <AdSenseAd
                slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT}
                className="mx-auto mt-6 w-[calc(100%-24px)] max-w-6xl"
            />

            <section className="mx-auto mt-8 grid w-[calc(100%-24px)] max-w-6xl gap-3 rounded-3xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                {[
                    { href: '/typingPro', label: 'Typing Practice' },
                    { href: '/', label: 'Test Series' },
                    { href: '/about', label: 'About' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/privacy-policy', label: 'Privacy' },
                    { href: '/terms-and-conditions', label: 'Terms' },
                ].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-center text-sm font-black text-[#4b397c] transition hover:bg-violet-100"
                    >
                        {item.label}
                    </Link>
                ))}
            </section>

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
                            onClick={() => {
                                if (authenticated) {
                                    setRightSidebarOpen(true)
                                    return
                                }

                                showRouteLoader()
                                router.push("/login")
                            }}
                        >
                            <LiveBubbleBtn />
                        </div>

                    </div>
                )
            }

        </div>
    )
}
