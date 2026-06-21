"use client"

import { ReactNode, Suspense, useEffect, useLayoutEffect } from "react"

import { ThemeProvider } from "./ThemeProvider"

import { useWSStore } from "../../shared/utils/wsStore"

import { useUserStore } from "../../shared/store/user"
import { useTestSeriesStore } from "../../shared/store/testSeriesStore"
import { useRouter, usePathname } from "next/navigation"
import RouteTransitionProvider from "./RouteTransitionProvider"
import { showRouteLoader } from "../../shared/utils/routeLoader"
import { installEncryptedFetch } from "../../shared/utils/encryptedTransport"

interface Props {
    children: ReactNode
}

export default function AppProviders({
    children
}: Props) {
    useLayoutEffect(() => installEncryptedFetch(), [])

    const router = useRouter()
    const pathname = usePathname()

    // =====================================
    // USER
    // =====================================

    const user =
        useUserStore(
            (state) => state.user
        )
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const access =
        useUserStore(
            (state) => state.access
        )
    const loading =
        useUserStore(
            (state) => state.loading
        )
    const authChecked =
        useUserStore(
            (state) => state.authChecked
        )
    const fetchUser =
        useUserStore(
            (state) => state.fetchUser
        )
    const refreshSeriesAccess =
        useTestSeriesStore(
            (state) => state.refreshSeriesAccess
        )
    const wsSessionId =
        useWSStore(
            (state) => state.sessionId
        )


    useEffect(() => {
        if (
            !authChecked &&
            !loading
        ) {
            void fetchUser()
        }
    }, [
        authChecked,
        loading,
        fetchUser
    ])
    useEffect(() => {
        refreshSeriesAccess(access)
    }, [access, refreshSeriesAccess])
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
        if (!authChecked) {
            return
        }

        const wsUserId =
            authenticated && user?.id
                ? user.id
                : `guest-${wsSessionId}`

        useWSStore
            .getState()
            .connect(wsUserId)

    }, [
        authChecked,
        authenticated,
        user?.id,
        wsSessionId
    ])

    return (

        <ThemeProvider>
            <Suspense fallback={null}>
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
            </Suspense>

        </ThemeProvider>
    )
}
