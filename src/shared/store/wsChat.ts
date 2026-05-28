'use client'

import { create } from 'zustand'

// ========================================
// TYPES
// ========================================

export type OnlineUser = {

    username: string

    online: boolean

    connections: number
}

interface WSChatStore {

    // ====================================
    // ALL ONLINE USERS
    // ====================================

    users: Record<
        string,
        OnlineUser
    >

    // ====================================
    // SET USER STATUS
    // ====================================

    setUserStatus: (
        data: OnlineUser
    ) => void

    // ====================================
    // REMOVE USER
    // ====================================

    removeUser: (
        username: string
    ) => void

    // ====================================
    // CLEAR
    // ====================================

    clearUsers: () => void
}

// ========================================
// STORE
// ========================================

export const useWSChatStore =
    create<WSChatStore>(
        (
            set
        ) => ({

            // ====================================
            // STATE
            // ====================================

            users: {},

            // ====================================
            // SET USER STATUS
            // ====================================

            setUserStatus:
                (
                    data
                ) =>

                    set(
                        (
                            state
                        ) => ({

                            users: {

                                ...state.users,

                                [data.username]: data
                            }
                        })
                    ),

            // ====================================
            // REMOVE USER
            // ====================================

            removeUser:
                (
                    username
                ) =>

                    set(
                        (
                            state
                        ) => {

                            const updated =
                            {
                                ...state.users
                            }

                            delete updated[
                                username
                            ]

                            return {
                                users:
                                    updated
                            }
                        }
                    ),

            // ====================================
            // CLEAR
            // ====================================

            clearUsers:
                () =>

                    set({

                        users: {}
                    })
        })
    )