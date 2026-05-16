'use client'

import { useEffect } from "react"

import HomeCenter from "../../shared/components/HomeCenter"
import LeftSidebar from "../../shared/components/LeftSidebar"
import RightSidebar from "../../shared/components/RightSidebar"
import Footer from "../../shared/components/Footer"
import LiveBubbleBtn from "../../shared/components/LiveBubbleBtn"
import { useLayoutStore } from "../../shared/store/uiResStore"

export default function HomePage() {

    const {

        leftMobile,
        rightMobile,

        setLeftMobile,
        setRightMobile

    } = useLayoutStore()
    const rightSidebarOpen = useLayoutStore(
        (state) => state.rightSidebarOpen
    )

    const setRightSidebarOpen = useLayoutStore(
        (state) => state.setRightSidebarOpen
    )

    const liveBubbleOpen = useLayoutStore(
        (state) => state.liveBubbleOpen
    )

    useEffect(() => {

        const handleResize = () => {

            setRightMobile(window.innerWidth < 900)

            setLeftMobile(window.innerWidth < 1280)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])
    //

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* MAIN */}
            <div className="flex w-full items-start">

                {/* LEFT */}
                {!leftMobile && (
                    <div className="w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto">
                        <LeftSidebar />
                    </div>
                )}

                {/* CENTER */}
                <div className="flex-1 min-w-0">
                    <HomeCenter />
                </div>

                {/* RIGHT */}
                {!rightMobile && (
                    <div className="w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto">
                        <RightSidebar />
                    </div>
                )}

                {/* MOBILE DRAWERS */}
                {leftMobile && (
                    <LeftSidebar />
                )}

                {rightMobile && (
                    <RightSidebar />
                )}

            </div>

            {/* FOOTER */}
            <Footer />
            {/* FLOATING LIVE BUTTON */}
            {/* FLOATING LIVE BUTTON */}
            {/* FLOATING LIVE BUTTON */}
            {rightMobile && leftMobile && !rightSidebarOpen && (
                <div
                    className="
            fixed
            bottom-5
            right-5
            z-[1200]
        "
                >

                    <div
                        onClick={() => setRightSidebarOpen(true)}
                    >
                        <LiveBubbleBtn />
                    </div>

                </div>
            )}

        </div>
    )
}