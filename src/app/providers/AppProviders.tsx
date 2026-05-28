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