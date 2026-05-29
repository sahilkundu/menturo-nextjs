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
export type SiteUser = {

    totalUsers: string | number

    totalOnline: string | number
}

interface WSChatStore {

    // ====================================
    // ALL ONLINE USERS
    // ====================================

    users: Record<
        string,
        OnlineUser
    >
    site: SiteUser

    // ====================================
    // SET USER STATUS
    // ====================================
    setSiteStats: (
        data: SiteUser
    ) => void
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
            site: {

                totalUsers: 0,

                totalOnline: 0
            },
            setSiteStats:
                (
                    data
                ) =>

                    set({

                        site: data
                    }),

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

                        users: {},
                        site: {

                            totalUsers: 0,

                            totalOnline: 0
                        }
                    })

        })
    )