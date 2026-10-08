'use client'

import { create } from 'zustand'

// ========================================
// TYPES
// ========================================

export type OnlineUser = {

    username: string

    userId?: string

    isAdmin?: boolean

    online: boolean

    connections: number
}
export type SiteUser = {
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
                totalOnline: 0
            },
            setSiteStats:
                (
                    data
                ) =>

                    set((state) => ({

                        site: {
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
                        ) => {
                            const online = isOnlineValue(data.online)
                            const key = data.userId
                            const updated = { ...state.users }

                            if (!online) {
                                for (const [storedKey, user] of Object.entries(updated)) {
                                    if (storedKey === key) delete updated[storedKey]
                                }
                                return { users: updated }
                            }

                            if (!key || key.startsWith('guest-')) return state
                            updated[key] = {
                                ...data,
                                username: data.username || data.userId || 'Unknown user',
                                online: true
                            }
                            return { users: updated }
                        }
                    ),

            setUsersSnapshot:
                (
                    users
                ) =>

                    set(() => {
                        const nextUsers:
                            Record<string, OnlineUser> = {}

                        for (const user of users) {
                            if (!user) {
                                continue
                            }

                            // Presence is authenticated WebSocket presence.
                            // Never render anonymous/guest records as real users.
                            if (!user.userId || user.userId.startsWith('guest-')) {
                                continue
                            }

                            if (user.online !== undefined && !isOnlineValue(user.online)) {
                                continue
                            }

                            const key = user.userId
                            nextUsers[key] = {
                                ...user,
                                username: user.username || user.userId || 'Unknown user',
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
                            totalOnline: 0
                        }
                    })

        })
    )
