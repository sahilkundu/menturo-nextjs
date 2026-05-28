// stores/wsStore.ts

import { create } from 'zustand'

import { WEBSOCKET } from '../../../api'

import { useTestSeriesStore } from './testSeriesStore'

import { showPopupMessage } from '../utils/popup'
declare global {
    interface Window {
        __wsHeartbeat: any
    }
}

type WSStatus =
    'connecting' |
    'connected' |
    'disconnected'

interface WSStore {

    socket:
    WebSocket | null

    status:
    WSStatus

    online:
    boolean

    userId:
    string | null

    connect:
    (
        userId: string
    ) => void

    disconnect:
    () => void

    send:
    (
        data: any
    ) => void
}

export const useWSStore =
    create<WSStore>(
        (
            set,
            get
        ) => ({

            socket: null,

            status:
                'disconnected',

            online: false,

            userId: null,

            // =====================================
            // CONNECT
            // =====================================

            connect:
                (
                    userId
                ) => {

                    const current =
                        get().socket

                    // =========================
                    // ALREADY CONNECTED
                    // =========================

                    if (
                        current &&
                        (
                            current.readyState === WebSocket.OPEN ||
                            current.readyState === WebSocket.CONNECTING
                        )
                    ) {
                        return
                    }

                    set({

                        status:
                            'connecting'
                    })

                    // =========================
                    // CREATE SOCKET
                    // =========================

                    const ws =
                        new WebSocket(
                            WEBSOCKET
                        )

                    set({
                        socket: ws,
                        userId
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

                                socket: ws,

                                online: true,

                                status:
                                    'connected'
                            })

                            // =====================
                            // AUTH USER
                            // =====================

                            ws.send(
                                JSON.stringify({

                                    event:
                                        'user-connect',

                                    userId
                                })
                            )
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

                                // =====================
                                // TEST UPDATE
                                // =====================

                                if (
                                    data.event ===
                                    'test-updated'
                                ) {

                                    useTestSeriesStore
                                        .getState()
                                        .updateTestHistory(
                                            data.history
                                        )
                                    showPopupMessage(
                                        "Test started on another device",
                                        true
                                    )
                                    return
                                }

                                // =====================
                                // PONG
                                // =====================

                                if (
                                    data.event ===
                                    'pong'
                                ) {
                                    return
                                }

                            } catch (err) {

                                console.log(err)
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

                                socket: null,

                                online: false,

                                status:
                                    'disconnected'
                            })

                            // AUTO RECONNECT

                            setTimeout(
                                () => {

                                    const uid =
                                        get()
                                            .userId

                                    if (uid) {

                                        get()
                                            .connect(
                                                uid
                                            )
                                    }

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

                    if (
                        typeof window !==
                        'undefined'
                    ) {

                        const existing =
                            window.__wsHeartbeat

                        if (existing) {
                            clearInterval(
                                existing
                            )
                        }

                        window.__wsHeartbeat =
                            setInterval(
                                () => {

                                    const socket =
                                        get()
                                            .socket

                                    if (
                                        socket &&
                                        socket.readyState === WebSocket.OPEN
                                    ) {

                                        socket.send(
                                            JSON.stringify({
                                                event:
                                                    'ping'
                                            })
                                        )
                                    }

                                },
                                30000
                            )
                    }
                },

            // =====================================
            // SEND
            // =====================================

            send:
                (
                    data
                ) => {

                    const socket =
                        get()
                            .socket

                    if (
                        !socket ||
                        socket.readyState !== WebSocket.OPEN
                    ) {
                        return
                    }

                    socket.send(
                        JSON.stringify(
                            data
                        )
                    )
                },

            // =====================================
            // DISCONNECT
            // =====================================

            disconnect:
                () => {

                    get()
                        .socket
                        ?.close()

                    set({

                        socket: null,

                        online: false,

                        status:
                            'disconnected',

                        userId: null
                    })
                }
        }))