'use client'

import { useEffect, useState } from "react"

import HomeCenter from "../../shared/components/HomeCenter"
import LeftSidebar from "../../shared/components/LeftSidebar"
import RightSidebar from "../../shared/components/RightSidebar"

export default function HomePage() {

    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])

    // RIGHT SIDEBAR MOBILE BELOW 1280
    const rightMobile = windowWidth < 1280

    // LEFT SIDEBAR MOBILE BELOW 950
    const leftMobile = windowWidth < 980

    return (
        <div className="flex w-full min-h-screen">

            {/* LEFT SIDEBAR */}
            {!leftMobile && (
                <div className="w-[280px] shrink-0">
                    <LeftSidebar head={false} />
                </div>
            )}

            {/* CENTER */}
            <div className="flex-1 min-w-0">
                <HomeCenter />
            </div>

            {/* RIGHT SIDEBAR */}
            {!rightMobile && (
                <div className="w-[280px] shrink-0">
                    <RightSidebar head={false} />
                </div>
            )}

            {/* MOBILE LEFT DRAWER */}
            {leftMobile && (
                <LeftSidebar head={true} />
            )}

            {/* MOBILE RIGHT DRAWER */}
            {rightMobile && (
                <RightSidebar head={true} />
            )}

        </div>
    )
}