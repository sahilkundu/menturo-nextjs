"use client"

import { ReactNode, useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import MenturoLoader from "../../shared/components/MenturoLoader"
import {
    ROUTE_LOADER_START_EVENT,
    ROUTE_LOADER_STOP_EVENT,
} from "../../shared/utils/routeLoader"

type Props = {
    children: ReactNode
}

const isModifiedClick = (event: MouseEvent) => {
    return (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
    )
}

const isSamePageUrl = (url: URL) => {
    return (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
    )
}

export default function RouteTransitionProvider({
    children
}: Props) {
    const pathname =
        usePathname()

    const searchParams =
        useSearchParams()

    const [visible, setVisible] =
        useState(false)

    const timeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearFallbackTimer = () => {
        if (!timeoutRef.current) {
            return
        }

        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
    }

    const start = () => {
        clearFallbackTimer()
        setVisible(true)

        timeoutRef.current =
            setTimeout(() => {
                setVisible(false)
                timeoutRef.current = null
            }, 12000)
    }

    const stop = () => {
        clearFallbackTimer()
        setVisible(false)
    }

    useEffect(() => {
        window.addEventListener(
            ROUTE_LOADER_START_EVENT,
            start
        )

        window.addEventListener(
            ROUTE_LOADER_STOP_EVENT,
            stop
        )

        return () => {
            window.removeEventListener(
                ROUTE_LOADER_START_EVENT,
                start
            )

            window.removeEventListener(
                ROUTE_LOADER_STOP_EVENT,
                stop
            )

            clearFallbackTimer()
        }
    }, [])

    useEffect(() => {
        stop()
    }, [pathname, searchParams])

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented || isModifiedClick(event)) {
                return
            }

            const target =
                event.target as HTMLElement | null

            const anchor =
                target?.closest("a[href]") as HTMLAnchorElement | null

            if (!anchor) {
                return
            }

            if (
                anchor.target &&
                anchor.target !== "_self"
            ) {
                return
            }

            const href =
                anchor.getAttribute("href")

            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {
                return
            }

            const url =
                new URL(
                    href,
                    window.location.href
                )

            if (
                url.origin !== window.location.origin ||
                isSamePageUrl(url)
            ) {
                return
            }

            start()
        }

        const handlePageShow = () => {
            stop()
        }

        document.addEventListener(
            "click",
            handleClick,
            true
        )

        window.addEventListener(
            "popstate",
            stop
        )

        window.addEventListener(
            "pageshow",
            handlePageShow
        )

        return () => {
            document.removeEventListener(
                "click",
                handleClick,
                true
            )

            window.removeEventListener(
                "popstate",
                stop
            )

            window.removeEventListener(
                "pageshow",
                handlePageShow
            )
        }
    }, [])

    return (
        <>
            {children}
            {visible && (
                <MenturoLoader mode="overlay" />
            )}
        </>
    )
}
