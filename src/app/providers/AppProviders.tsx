"use client"

import { ReactNode, useEffect } from "react"

import { ThemeProvider } from "./ThemeProvider"

import { useWSStore } from "../../shared/store/wsStore"
import { useUserStore } from "../../shared/store/user"

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

    // =====================================
    // WS USER
    // =====================================

    const wsUserId =
        useWSStore(
            (state) => state.userId
        )

    // =====================================
    // CONNECT WS
    // =====================================

    useEffect(() => {

        useWSStore
            .getState()
            .connect()

    }, [])

    // =====================================
    // LOGIN WS USER
    // =====================================

    useEffect(() => {

        if (!authenticated) {
            return
        }

        if (!user?.id) {
            return
        }

        if (wsUserId === user.id) {
            return
        }

        useWSStore
            .getState()
            .login(user.id)

    }, [
        authenticated,
        user?.id,
        wsUserId
    ])

    return (

        <ThemeProvider>

            {children}

        </ThemeProvider>
    )
}