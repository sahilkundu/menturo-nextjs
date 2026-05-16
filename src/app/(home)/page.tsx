'use client'

import { useEffect } from "react"

import HomeCenter from "../../shared/components/HomeCenter"
import LeftSidebar from "../../shared/components/LeftSidebar"
import RightSidebar from "../../shared/components/RightSidebar"
import Footer from "../../shared/components/Footer"

import { useLayoutStore } from "../../shared/store/uiResStore"

export default function HomePage() {

    const {

        leftMobile,
        rightMobile,

        setLeftMobile,
        setRightMobile

    } = useLayoutStore()

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

        </div>
    )
}