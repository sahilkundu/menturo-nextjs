"use client"

import { ReactNode, useEffect, useRef } from "react"

import { ThemeProvider } from "./ThemeProvider"

import { useWSStore } from "../../shared/utils/wsStore"

import { useUserStore } from "../../shared/store/user"
import { useWSChatStore } from "../../shared/store/wsChat"
import { SITE_STATUS } from "../../../api"
import { useRouter, usePathname } from "next/navigation"
import RouteTransitionProvider from "./RouteTransitionProvider"
import { showRouteLoader } from "../../shared/utils/routeLoader"

interface Props {
    children: ReactNode
}

export default function AppProviders({
    children
}: Props) {
    const router = useRouter()
    const pathname = usePathname()

    // =====================================
    // USER
    // =====================================

    const {
        user,
        authenticated
    } = useUserStore()



    const fetchedRef =
        useRef(false)

    useEffect(() => {

        if (fetchedRef.current && authenticated) {
            return
        }

        fetchedRef.current = true

        const fetchStats =
            async () => {

                try {

                    const res =
                        await fetch(
                            SITE_STATUS
                        )

                    const data =
                        await res.json()

                    if (data.success) {

                        useWSChatStore
                            .getState()
                            .setSiteStats({

                                totalUsers:
                                    data.totalUsers,

                                totalOnline:
                                    data.totalOnline
                            })
                    }
                }
                catch (err) {

                    console.log(err)
                }
            }

        fetchStats()

        const interval =
            setInterval(
                fetchStats,
                60000
            )

        return () =>
            clearInterval(interval)

    }, [])
    useEffect(() => {

        const originalFetch =
            window.fetch

        window.fetch = async (
            input: RequestInfo | URL,
            init?: RequestInit
        ) => {

            const response =
                await originalFetch(
                    input,
                    {
                        credentials: "include",
                        ...init
                    }
                )

            try {

                const cloned =
                    response.clone()

                const data =
                    await cloned.json()

                // =====================================
                // GLOBAL REDIRECT
                // =====================================

                if (
                    data &&
                    typeof data === "object" &&
                    "redirect" in data &&
                    typeof data.redirect === "string"
                ) {
                    // Ignore redirects on test detail pages
                    if (
                        pathname.startsWith("/series/")
                    ) {
                        return response
                    }

                    showRouteLoader()

                    router.push(
                        data.redirect
                    )
                }

            } catch (_) { }

            return response
        }

        return () => {

            window.fetch =
                originalFetch
        }

    }, [router, pathname])
    // =====================================
    // CONNECT WS
    // =====================================

    useEffect(() => {

        if (
            authenticated &&
            user?.id
        ) {

            useWSStore
                .getState()
                .connect(user.id)
        }

    }, [
        authenticated,
        user?.id
    ])

    // =====================================
    // DISCONNECT WS
    // =====================================

    useEffect(() => {

        if (!authenticated) {

            useWSStore
                .getState()
                .disconnect()
        }

    }, [authenticated])

    return (

        <ThemeProvider>
            <RouteTransitionProvider>
            {/* {pathname !== "/test" &&
                <div className="w-full min-w-[320px] backdrop-blur-md bg-red-500/80 border border-white/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] px-2 sm:px-2 py-0 sm:py-0 text-center">
                    <span className="text-white font-semibold text-[14px] sm:text-[16px] drop-shadow-lg block whitespace-nowrap sm:whitespace-normal">
                        Website under maintenance
                    </span>
                </div>
            } */}
            {children}
            </RouteTransitionProvider>

        </ThemeProvider>
    )
}
