"use client"

import { ReactNode, useEffect, useRef } from "react"

import { ThemeProvider } from "./ThemeProvider"

import { useWSStore } from "../../shared/utils/wsStore"

import { useUserStore } from "../../shared/store/user"
import { useWSChatStore } from "../../shared/store/wsChat"
import { SITE_STATUS } from "../../../api"

interface Props {
    children: ReactNode
}

export default function AppProviders({
    children
}: Props) {

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

            {children}

        </ThemeProvider>
    )
}