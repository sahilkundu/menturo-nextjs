'use client'

import { create } from 'zustand'

// ========================================
// TYPES
// ========================================

export type OnlineUser = {

    username: string

    isAdmin?: boolean

    online: boolean

    connections: number
}
export type SiteUser = {

    totalUsers: string | number

    totalOnline: string | number

    onlineUsers?: string | number
}

const isOnlineValue = (
    value: unknown
) => {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' ||
            value === '1'
    }

    return value === true ||
        value === 1
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
    setUsersSnapshot: (
        users: OnlineUser[]
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

                    set((state) => ({

                        site: {
                            totalUsers:
                                data?.totalUsers ??
                                state.site.totalUsers ??
                                0,

                            totalOnline:
                                data?.totalOnline ??
                                data?.onlineUsers ??
                                state.site.totalOnline ??
                                0
                        }
                    })),

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

                                [data.username]: {
                                    ...data,
                                    online:
                                        isOnlineValue(
                                            data.online
                                        )
                                }
                            }
                        })
                    ),

            setUsersSnapshot:
                (
                    users
                ) =>

                    set(() => {
                        const nextUsers:
                            Record<string, OnlineUser> = {}

                        for (const user of users) {
                            if (!user?.username) {
                                continue
                            }

                            nextUsers[user.username] = {
                                ...user,
                                online:
                                    isOnlineValue(
                                        user.online
                                    )
                            }
                        }

                        return {
                            users:
                                nextUsers
                        }
                    }),

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
