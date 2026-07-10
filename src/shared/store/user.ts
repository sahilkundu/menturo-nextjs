// shared/store/user.ts

import { create } from "zustand"
import { AUTH } from "../../../api"
import { getClientDeviceInfo } from "../utils/deviceIdentity"

interface UserData {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    mobile: string
    state: string
    status: string
    type: string
    mobileVerified: boolean
    emailVerified: boolean
    createdAt: number
    lastActive: number
}

interface UserStore {
    user: UserData | null

    access: Record<string, any>

    loading: boolean

    authenticated: boolean

    authChecked: boolean

    setUser: (user: UserData | null) => void

    setAccess: (access: Record<string, any>) => void

    logout: () => void

    fetchUser: () => Promise<boolean>
}

export const useUserStore =
    create<UserStore>((set, get) => ({

        user: null,

        access: {},

        loading: false,

        authenticated: false,

        authChecked: false,

        // =========================
        // Set User
        // =========================

        setUser: (user) =>
            set({
                user,
                authenticated: !!user,
            }),

        setAccess: (access) =>
            set({
                access:
                    access || {},
            }),

        // =========================
        // Logout
        // =========================

        logout: () =>
            set({
                user: null,
                access: {},
                authenticated: false,
                authChecked: true,
            }),

        // =========================
        // Fetch Auth User
        // =========================

        fetchUser: async () => {
            const state =
                get()

            if (state.loading) {
                return state.authenticated
            }

            try {

                set({
                    loading: true,
                })

                const response =
                    await fetch(
                        AUTH,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type": "application/json",
                            },

                            body: JSON.stringify(
                                getClientDeviceInfo()
                            ),
                        }
                    )

                const data =
                    await response.json()

                if (
                    response.ok &&
                    data.success
                ) {
                    set({
                        user: data.user,
                        access: data.access || {},
                        authenticated: true,
                        authChecked: true,
                        loading: false,
                    })

                    return true
                }
                else {
                    set({
                        user: null,
                        access: {},
                        authenticated: false,
                        authChecked: true,
                        loading: false,
                    })

                    return false
                }
            }
            catch {

                set({
                    user: null,
                    access: {},
                    authenticated: false,
                    authChecked: true,
                    loading: false,
                })

                return false
            }
        },
    }))
