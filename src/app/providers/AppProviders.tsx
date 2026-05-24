'use client'

import { ReactNode, useEffect } from 'react'

import { ThemeProvider } from './ThemeProvider'

import { useWSStore } from '../../shared/store/wsStore'

import { useUserStore } from '../../shared/store/user'

interface Props {
    children: ReactNode
}

export const AppProviders = ({
    children
}: Props) => {

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
    // CONNECT ONLY ONCE
    // =====================================

    useEffect(() => {

        useWSStore
            .getState()
            .connect()

    }, [])

    // =====================================
    // LOGIN AFTER AUTH
    // =====================================

    useEffect(() => {

        if (
            !authenticated
        ) {
            return
        }

        if (
            !user?.id
        ) {
            return
        }

        // =============================
        // ALREADY LOGGED
        // =============================

        if (
            wsUserId === user.id
        ) {
            return
        }

        useWSStore
            .getState()
            .login(
                user.id
            )

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