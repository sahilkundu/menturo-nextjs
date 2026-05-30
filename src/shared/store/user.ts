// shared/store/user.ts

import { create } from "zustand"
import { AUTH } from "../../../api"

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

    loading: boolean

    authenticated: boolean

    setUser: (user: UserData | null) => void

    logout: () => void

    fetchUser: () => Promise<void>
}

export const useUserStore =
    create<UserStore>((set) => ({

        user: null,

        loading: false,

        authenticated: false,

        // =========================
        // Set User
        // =========================

        setUser: (user) =>
            set({
                user,
                authenticated: !!user,
            }),

        // =========================
        // Logout
        // =========================

        logout: () =>
            set({
                user: null,
                authenticated: false,
            }),

        // =========================
        // Fetch Auth User
        // =========================

        fetchUser: async () => {
            const state = useUserStore.getState()

            if (
                state.authenticated &&
                state.user
            ) {
                return
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
                        authenticated: true,
                        loading: false,
                    })
                }
                else {
                    set({
                        user: null,
                        authenticated: false,
                        loading: false,
                    })
                }
            }
            catch (error) {

                console.log(error)

                set({
                    user: null,
                    authenticated: false,
                    loading: false,
                })
            }
        },
    }))