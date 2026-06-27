'use client'

import { memo, useCallback, useEffect, useMemo, useRef } from "react"

import { useLayoutStore } from "../store/uiResStore"
import { useWSChatStore } from "../store/wsChat"

interface LiveBubbleProps {
    count?: number
}

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

function LiveBubbleBtn({
    count = 3
}: LiveBubbleProps) {
    const wsUsers =
        useWSChatStore(
            (state) =>
                state.users
        )
    const site =
        useWSChatStore(
            (state) =>
                state.site
        )

    const onlineUsersCount =
        useMemo(
            () =>
                Object.values(wsUsers)
                    .filter(
                        user =>
                            isUserOnline(
                                user?.online
                            )
                    ).length,
            [wsUsers]
        )
    const onlineCount =
        onlineUsersCount ||
        Number(site?.totalOnline) ||
        0

    const bubbleRef = useRef<HTMLButtonElement | null>(null)

    const setLiveBubbleOpen = useLayoutStore(
        (state) => state.setLiveBubbleOpen
    )

    const setRightSidebarOpen = useLayoutStore(
        (state) => state.setRightSidebarOpen
    )
    const openLive =
        useCallback(() => {
            setLiveBubbleOpen(true)
            setRightSidebarOpen(true)
        }, [
            setLiveBubbleOpen,
            setRightSidebarOpen
        ])

    // CLOSE WHEN CLICK OUTSIDE
    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (
                bubbleRef.current &&
                !bubbleRef.current.contains(event.target as Node)
            ) {

                setLiveBubbleOpen(false)

                setRightSidebarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])

    return (
        <button
            ref={bubbleRef}
            onClick={openLive}
            className="
                relative
                w-[74px]
                h-[74px]
                flex
                items-center
                justify-center
                hover:scale-105
                active:scale-95
                transition-all
                duration-300
            "
        >

            {/* MAIN PURPLE BLOB */}
            <div
                className="
                    w-[58px]
                    h-[58px]
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-violet-700
                    shadow-[0_8px_20px_rgba(109,40,217,0.35)]
                "
            />

            {/* COUNT BADGE */}
            <div
                className="
                    absolute
                    top-[2px]
                    left-[2px]
                    w-7
                    h-7
                    rounded-full
                    bg-red-500
                    text-white
                    text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-[3px]
                    border-white
                    shadow-md
                "
            >
                {onlineCount}
            </div>

            {/* LIVE BADGE */}
            <div
                className="
                    absolute
                    bottom-[4px]
                    right-[0px]
                    px-[10px]
                    py-[2px]
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    tracking-wide
                    shadow-md
                "
            >
                LIVE
            </div>

        </button>
    )
}

export default memo(LiveBubbleBtn)
