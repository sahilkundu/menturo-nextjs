
// stores/wsStore.ts

import { create } from 'zustand'

import { v4 as uuidv4 } from 'uuid'

import { WEBSOCKET } from '../../../api'

import { useTestSeriesStore } from '../store/testSeriesStore'

import { showPopupMessage } from './popup'
import { useWSChatStore } from '../store/wsChat'
import { useTestDataStore } from '../store/testDataStore'
// =====================================================
// GLOBAL SESSION
// =====================================================

const sessionId =
    uuidv4()

declare global {

    interface Window {

        __wsHeartbeat: any

        __wsReconnect: any
    }
}

// =====================================================
// TYPES
// =====================================================

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

    sessionId:
    string

    currentRoute:
    string

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

    routeChange:
    (
        route: string
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
        ) => ({

            // =====================================
            // STATE
            // =====================================

            socket: null,

            status:
                'disconnected',

            online: false,

            userId: null,

            sessionId,

            currentRoute: '',

            // =====================================
            // CONNECT
            // =====================================

            connect:
                (
                    userId
                ) => {

                    const current =
                        get().socket

                    // =================================
                    // ALREADY CONNECTED
                    // =================================

                    if (
                        current &&
                        (
                            current.readyState === WebSocket.OPEN ||
                            current.readyState === WebSocket.CONNECTING
                        )
                    ) {
                        return
                    }

                    console.log(
                        'WS CONNECTING...'
                    )

                    set({

                        status:
                            'connecting',

                        userId
                    })

                    // =================================
                    // CREATE SOCKET
                    // =================================

                    const ws =
                        new WebSocket(
                            WEBSOCKET
                        )

                    set({
                        socket: ws
                    })

                    // =================================
                    // OPEN
                    // =================================

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

                            // =============================
                            // SEND USER CONNECT
                            // =============================

                            ws.send(

                                JSON.stringify({

                                    event:
                                        'user-connect',

                                    userId,

                                    sessionId,

                                    route:
                                        window.location.pathname,

                                    device: {

                                        browser:
                                            navigator.userAgent,

                                        os:
                                            navigator.platform,

                                        language:
                                            navigator.language,

                                        width:
                                            window.innerWidth,

                                        height:
                                            window.innerHeight,

                                        deviceType:
                                            window.innerWidth < 768
                                                ? 'mobile'
                                                : 'desktop',

                                        userAgent:
                                            navigator.userAgent
                                    }
                                })
                            )

                            // =============================
                            // CLEAR OLD HEARTBEAT
                            // =============================

                            if (
                                window.__wsHeartbeat
                            ) {

                                clearInterval(
                                    window.__wsHeartbeat
                                )
                            }

                            // =============================
                            // HEARTBEAT
                            // =============================

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
                                                        'ping',

                                                    userId:
                                                        get()
                                                            .userId,

                                                    sessionId:
                                                        get()
                                                            .sessionId,

                                                    route:
                                                        get()
                                                            .currentRoute ||
                                                        window.location.pathname
                                                })
                                            )
                                        }

                                    },
                                    30000
                                )
                        }

                    // =================================
                    // MESSAGE
                    // =================================

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
                                    'WS MESSAGE:',
                                    data
                                )

                                // =========================
                                // TEST UPDATED
                                // =========================

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
                                        data.message ||
                                        'Test started on another device',
                                        true
                                    )

                                    return
                                }
                                if (
                                    data.event ===
                                    'test-submitted'
                                ) {

                                    useTestSeriesStore
                                        .getState()
                                        .updateTestHistory(
                                            data.history
                                        )

                                    useTestDataStore
                                        .getState()
                                        .applySubmittedResult({
                                            result: data.result
                                        })

                                    showPopupMessage(
                                        data.message ||
                                        'Test was submitted',
                                        true
                                    )

                                    return
                                }
                                //if site status event
                                if (data.event === "site-stats") {

                                    useWSChatStore
                                        .getState()
                                        .setSiteStats(
                                            data.stats
                                        )
                                }

                                // =========================
                                // USER ONLINE STATUS
                                // =========================
                                if (
                                    data.event ===
                                    'online-users'
                                ) {

                                    const wsChat =
                                        useWSChatStore.getState()

                                    for (const user of data.users) {

                                        wsChat.setUserStatus({

                                            username:
                                                user.username,

                                            online: true,

                                            connections:
                                                user.connections || 1
                                        })
                                    }

                                    return
                                }
                                if (
                                    data.event ===
                                    'user-online-status'
                                ) {

                                    useWSChatStore
                                        .getState()
                                        .setUserStatus({

                                            username:
                                                data.username,

                                            online:
                                                data.online,

                                            connections:
                                                data.connections || 0
                                        })

                                    return
                                }



                                // =========================
                                // FORCE LOGOUT
                                // =========================

                                if (
                                    data.event ===
                                    'force-logout'
                                ) {

                                    showPopupMessage(
                                        'Logged in from another device',
                                        false
                                    )

                                    get()
                                        .disconnect()

                                    return
                                }

                                // =========================
                                // PONG
                                // =========================

                                if (
                                    data.event ===
                                    'pong'
                                ) {
                                    return
                                }

                            } catch (err) {

                                console.log(
                                    'WS PARSE ERROR',
                                    err
                                )
                            }
                        }

                    // =================================
                    // CLOSE
                    // =================================

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

                            // =============================
                            // CLEAR HEARTBEAT
                            // =============================

                            if (
                                window.__wsHeartbeat
                            ) {

                                clearInterval(
                                    window.__wsHeartbeat
                                )
                            }

                            // =============================
                            // AUTO RECONNECT
                            // =============================

                            if (
                                window.__wsReconnect
                            ) {

                                clearTimeout(
                                    window.__wsReconnect
                                )
                            }

                            window.__wsReconnect =
                                setTimeout(
                                    () => {

                                        const uid =
                                            get()
                                                .userId

                                        if (uid) {

                                            console.log(
                                                'WS RECONNECTING...'
                                            )

                                            get()
                                                .connect(
                                                    uid
                                                )
                                        }

                                    },
                                    3000
                                )
                        }

                    // =================================
                    // ERROR
                    // =================================

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
                },

            // =====================================
            // ROUTE CHANGE
            // =====================================

            routeChange:
                (
                    route
                ) => {

                    set({
                        currentRoute:
                            route
                    })

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

                        JSON.stringify({

                            event:
                                'route-change',

                            route,

                            userId:
                                get()
                                    .userId,

                            sessionId:
                                get()
                                    .sessionId
                        })
                    )
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

                    if (
                        window.__wsHeartbeat
                    ) {

                        clearInterval(
                            window.__wsHeartbeat
                        )
                    }

                    if (
                        window.__wsReconnect
                    ) {

                        clearTimeout(
                            window.__wsReconnect
                        )
                    }

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