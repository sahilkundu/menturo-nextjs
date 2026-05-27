// stores/wsStore.ts

import { create } from 'zustand'

import { v4 as uuidv4 } from 'uuid'
import { WEBSOCKET } from '../../../api'
declare global {
    interface Window {
        __wsHeartbeat: any
    }
}
// =====================================================
// TYPES
// =====================================================

type WSStatus =
    'connecting' |
    'connected' |
    'disconnected'

type AuthType =
    'guest' |
    'user'

// =====================================================
// STORE
// =====================================================

interface WSStore {
    // =========================================
    // SOCKET
    // =========================================

    socket:
    WebSocket | null

    // =========================================
    // STATUS
    // =========================================

    status:
    WSStatus

    online:
    boolean

    // =========================================
    // USER
    // =========================================

    authType:
    AuthType

    guestId:
    string

    userId:
    string | null

    // =========================================
    // ACTIONS
    // =========================================

    connect:
    () => void

    disconnect:
    () => void

    login:
    (
        userId: string
    ) => void

    send:
    (
        data: any
    ) => void
}

// =====================================================
// STORE
// =====================================================

export const useWSStore =
    create<WSStore>(
        (
            set,
            get
        ) => {
            // =====================================
            // GUEST ID
            // =====================================

            let guestId =
                ''

            if (
                typeof window !==
                'undefined'
            ) {
                guestId =
                    localStorage.getItem(
                        'guestId'
                    ) || ''

                // ===============================
                // CREATE NEW
                // ===============================

                if (!guestId) {
                    guestId =
                        uuidv4()

                    localStorage.setItem(
                        'guestId',
                        guestId
                    )
                }
            }

            return {

                // =================================
                // DEFAULTS
                // =================================

                socket:
                    null,

                status:
                    'disconnected',

                online:
                    false,

                authType:
                    'guest',

                guestId,

                userId:
                    null,

                // =================================
                // CONNECT
                // =================================

                connect:
                    () => {
                        // =========================
                        // ALREADY CONNECTED
                        // =========================

                        const current =
                            get()
                                .socket

                        // if (
                        //     current &&
                        //     current
                        //         .readyState === 1
                        // ) {
                        //     return
                        // }
                        if (
                            current &&
                            (
                                current.readyState === WebSocket.OPEN ||
                                current.readyState === WebSocket.CONNECTING
                            )
                        ) {
                            return
                        }

                        // =========================
                        // STATUS
                        // =========================


                        set({

                            status:
                                'connecting',

                            socket:
                                current || null
                        })
                        // =========================
                        // CREATE SOCKET
                        // =========================

                        const ws =
                            new WebSocket(
                                WEBSOCKET
                            )
                        set({
                            socket: ws
                        })

                        // =========================
                        // OPEN
                        // =========================

                        ws.onopen =
                            () => {
                                console.log(
                                    'WS CONNECTED'
                                )

                                set({

                                    socket:
                                        ws,

                                    online:
                                        true,

                                    status:
                                        'connected'
                                })

                                // =================
                                // GUEST CONNECT
                                // =================

                                ws.send(

                                    JSON.stringify({

                                        event:
                                            'guest-connect',

                                        guestId:
                                            get()
                                                .guestId
                                    }))
                            }

                        // =========================
                        // MESSAGE
                        // =========================

                        ws.onmessage =
                            (
                                event
                            ) => {
                                try {

                                    const data =
                                        JSON.parse(
                                            event.data
                                        )

                                    console.log(
                                        'WS:',
                                        data
                                    )

                                    // ============================
                                    // TEST HISTORY SAVED
                                    // ============================

                                    if (
                                        data.event ===
                                        'test-history-saved'
                                    ) {

                                        alert(
                                            `Test Saved Successfully\nAttempt: ${data.attempt}`
                                        )

                                        console.log(
                                            'History Saved:',
                                            data
                                        )

                                        return
                                    }

                                    // ============
                                    // PONG
                                    // ============

                                    if (
                                        data.event ===
                                        'pong'
                                    ) {
                                        return
                                    }

                                    // ============
                                    // USER
                                    // ============

                                    if (
                                        data.event ===
                                        'user-connected'
                                    ) {

                                        set({

                                            authType:
                                                'user'
                                        })

                                        return
                                    }

                                }

                                catch (
                                err
                                ) {

                                    console.log(
                                        err
                                    )
                                }
                            }

                        // =========================
                        // CLOSE
                        // =========================

                        ws.onclose =
                            () => {
                                console.log(
                                    'WS CLOSED'
                                )

                                set({

                                    socket:
                                        null,

                                    online:
                                        false,

                                    status:
                                        'disconnected'
                                })

                                // =================
                                // AUTO RECONNECT
                                // =================

                                setTimeout(
                                    () => {
                                        get()
                                            .connect()
                                    },
                                    3000
                                )
                            }

                        // =========================
                        // ERROR
                        // =========================

                        ws.onerror =
                            (
                                err
                            ) => {
                                console.log(
                                    'WS ERROR',
                                    err
                                )

                                set({

                                    online:
                                        false,

                                    status:
                                        'disconnected'
                                })
                            }

                        // =========================
                        // HEARTBEAT
                        // =========================

                        //     setInterval(
                        //         () => {
                        //             const socket =
                        //                 get()
                        //                     .socket

                        //             if (
                        //                 socket &&
                        //                 socket
                        //                     .readyState === 1
                        //             ) {
                        //                 socket.send(

                        //                     JSON.stringify({

                        //                         event:
                        //                             'ping'
                        //                     }))
                        //             }

                        //         },
                        //         30000
                        //     )
                        // },
                        // =========================
                        // HEARTBEAT
                        // =========================

                        if (
                            typeof window !== 'undefined'
                        ) {

                            const existing =
                                window.__wsHeartbeat

                            if (existing) {
                                clearInterval(existing)
                            }

                            window.__wsHeartbeat =
                                setInterval(
                                    () => {

                                        const socket =
                                            get().socket

                                        if (
                                            socket &&
                                            socket.readyState === WebSocket.OPEN
                                        ) {

                                            socket.send(
                                                JSON.stringify({
                                                    event: 'ping'
                                                })
                                            )
                                        }

                                    },
                                    30000
                                )
                        }
                    },

                // =================================
                // LOGIN
                // =================================

                login:
                    (
                        userId
                    ) => {
                        const socket =
                            get()
                                .socket

                        if (
                            !socket ||
                            socket
                                .readyState !== 1
                        ) {
                            return
                        }

                        socket.send(

                            JSON.stringify({

                                event:
                                    'user-login',

                                guestId:
                                    get()
                                        .guestId,

                                userId
                            }))

                        set({

                            userId,

                            authType:
                                'user'
                        })
                    },

                // =================================
                // SEND
                // =================================

                send:
                    (
                        data
                    ) => {
                        const socket =
                            get()
                                .socket

                        if (
                            !socket ||
                            socket
                                .readyState !== 1
                        ) {
                            return
                        }

                        socket.send(
                            JSON.stringify(
                                data
                            ))
                    },

                // =================================
                // DISCONNECT
                // =================================

                disconnect:
                    () => {
                        get()
                            .socket
                            ?.close()

                        set({

                            socket:
                                null,

                            online:
                                false,

                            status:
                                'disconnected'
                        })
                    }
            }
        })