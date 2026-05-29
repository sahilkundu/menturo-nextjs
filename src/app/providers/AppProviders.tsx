"use client"

import { ReactNode, useEffect } from "react"

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



    setInterval(async () => {

        try {
            const res =
                await fetch(
                    SITE_STATUS
                )

            const data =
                await res.json()

            if (
                data.success
            ) {
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

    }, 10000)

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