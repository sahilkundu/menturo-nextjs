
// stores/wsStore.ts

import { create } from 'zustand'

import { v4 as uuidv4 } from 'uuid'

import { WEBSOCKET } from '../../../api'

import { useTestSeriesStore } from '../store/testSeriesStore'
import { useSessionStore } from '../store/sessionStore'

import { showPopupMessage } from './popup'
import { useWSChatStore } from '../store/wsChat'
import { useTestDataStore } from '../store/testDataStore'
import { useUserStore } from '../store/user'
import { useTestCardMetadataStore } from '../store/testCardMetadataStore'
import {
    encryptedWebSocketUrl,
    readEncryptedWebSocket,
    sendEncryptedWebSocket
} from './encryptedTransport'
import { getClientDeviceInfo } from './deviceIdentity'
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
                    void (async () => {

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
                        if (get().userId === userId) {
                            return
                        }

                        current.onclose = null
                        current.onerror = null
                        current.close()
                    }

                    set({

                        status:
                            'connecting',

                        userId
                    })

                    // =================================
                    // CREATE SOCKET
                    // =================================

                    const encryptedSocket = await encryptedWebSocketUrl(WEBSOCKET)
                    const ws = new WebSocket(encryptedSocket.url)

                    set({
                        socket: ws
                    })

                    // =================================
                    // OPEN
                    // =================================

                    ws.onopen =
                        () => {

                            set({

                                socket: ws,

                                online: true,

                                status:
                                    'connected'
                            })

                            // =============================
                            // SEND USER CONNECT
                            // =============================

                            const clientDeviceInfo =
                                getClientDeviceInfo()

                            sendEncryptedWebSocket(ws, {

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
                                            navigator.userAgent,

                                        ...clientDeviceInfo
                                    }
                                })

                            sendEncryptedWebSocket(ws, {
                                    event:
                                        'site-stats'
                                })

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

                                            sendEncryptedWebSocket(socket, {

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
                                        }

                                    },
                                    30000
                                )
                        }

                    // =================================
                    // MESSAGE
                    // =================================

                    ws.onmessage =
                        async (
                            event
                        ) => {

                            try {

                                const data = JSON.parse(
                                    await readEncryptedWebSocket(event.data)
                                )

                                if (data.event === 'typing-test-updated') {
                                    window.dispatchEvent(
                                        new CustomEvent(
                                            'menturo-typing-test-updated',
                                            { detail: data }
                                        )
                                    )
                                    return
                                }

                                if (
                                    data.event ===
                                    'test-lifetime-stats-updated'
                                ) {
                                    useTestCardMetadataStore
                                        .getState()
                                        .applyLifetimeStats(
                                            String(data.seriesId || ''),
                                            String(data.testId || ''),
                                            Number(data.totalAttempts || 0),
                                            Number(data.totalUsers || 0)
                                        )

                                    return
                                }

                                if (
                                    data.event ===
                                    'test-ranking-updated'
                                ) {
                                    useTestCardMetadataStore
                                        .getState()
                                        .refreshRanking(
                                            String(data.seriesId || ''),
                                            String(data.testId || ''),
                                            Number(data.averageScore || 0),
                                            Number(data.rankedUsers || 0)
                                        )

                                    return
                                }

                                if (
                                    data.event ===
                                    'test-card-metadata-ready'
                                ) {
                                    useTestCardMetadataStore
                                        .getState()
                                        .refreshMetadata(
                                            String(data.seriesId || ''),
                                            String(data.testId || '')
                                        )

                                    return
                                }

                                if (data.event === "session-updated") {
                                    useSessionStore
                                        .getState()
                                        .refreshSessions();

                                    return;
                                }
                                if (
                                    data.event === 'session-revoked' ||
                                    data.event === 'auth-revoked'
                                ) {
                                    useUserStore
                                        .getState()
                                        .logout()

                                    useSessionStore
                                        .getState()
                                        .clearSessions()

                                    showPopupMessage(
                                        data.message ||
                                        'Your session was ended. Please sign in again.',
                                        false
                                    )

                                    get()
                                        .disconnect()

                                    return
                                }
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
                                            data.history,
                                            data
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
                                            data.history,
                                            data
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
                                            data.stats || {
                                                totalUsers:
                                                    data.totalUsers,

                                                totalOnline:
                                                    data.totalOnline ??
                                                    data.onlineUsers
                                            }
                                        )
                                }

                                // =========================
                                // USER ONLINE STATUS
                                // =========================
                                if (
                                    data.event ===
                                    'online-users'
                                ) {

                                    useWSChatStore
                                        .getState()
                                        .setUsersSnapshot(
                                            (
                                            data.users || []
                                        ).map((user: any) => ({
                                                userId:
                                                    user.userId,

                                                username:
                                                    user.username,

                                                isAdmin:
                                                    user.isAdmin === true,

                                                online:
                                                    user.online ??
                                                    true,

                                                connections:
                                                    user.connections || 0
                                            }))
                                        )

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

                                            isAdmin:
                                                data.isAdmin === true,

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
                                    useUserStore
                                        .getState()
                                        .logout()

                                    useSessionStore
                                        .getState()
                                        .clearSessions()

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

                            } catch {
                            }
                        }

                    // =================================
                    // CLOSE
                    // =================================

                    ws.onclose =
                        () => {

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

                            set({

                                online:
                                    false,

                                status:
                                    'disconnected'
                            })
                        }

                    })().catch(error => {
                        console.error('WS ENCRYPTION ERROR', error)
                        set({ socket: null, online: false, status: 'disconnected' })
                    })
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

                    sendEncryptedWebSocket(socket, {

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

                    sendEncryptedWebSocket(socket, data)
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
