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
    isAdmin: boolean
    mobileVerified: boolean
    emailVerified: boolean
    createdAt: number
    lastActive: number
}

interface NeedVerify {
    required?: boolean
    email?: boolean
    mobile?: boolean
    eOtp?: boolean
    mOtp?: boolean
    emailMasked?: string
    mobileMasked?: string
    hasEmail?: boolean
    hasMobile?: boolean
}

interface UserStore {
    user: UserData | null

    access: Record<string, any>

    loading: boolean

    authenticated: boolean

    authChecked: boolean

    securityBlockedUntil: number

    needVerify: NeedVerify

    setUser: (user: UserData | null) => void

    setAccess: (access: Record<string, any>) => void

    setSecurityBlockedUntil: (value: number) => void

    setNeedVerify: (value: NeedVerify) => void

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

        securityBlockedUntil: 0,

        needVerify: {},

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

        setSecurityBlockedUntil: (value) =>
            set({
                securityBlockedUntil:
                    Number(value || 0),
            }),

        setNeedVerify: (value) =>
            set({
                needVerify:
                    value || {},
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
                securityBlockedUntil: 0,
                needVerify: {},
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
                        securityBlockedUntil: 0,
                        needVerify: data.needVerify || {},
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
                        securityBlockedUntil: 0,
                        needVerify: {},
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
                    securityBlockedUntil: 0,
                    needVerify: {},
                })

                return false
            }
        },
    }))
