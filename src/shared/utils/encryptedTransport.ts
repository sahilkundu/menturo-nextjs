import { BASE_URL } from '../../../api'

type Direction = 'http-c2s' | 'http-s2c' | 'ws-c2s' | 'ws-s2c'
export interface CryptoSession {
    enabled: boolean
    sessionId: string
    expiresAt: number
    keys?: Record<Direction, CryptoKey>
}
interface Envelope { v: number; sid: string; iv: string; ct: string; tag: string }

const encoder = new TextEncoder()
const decoder = new TextDecoder()
let sessionPromise: Promise<CryptoSession> | null = null
let currentSession: CryptoSession | null = null
const REFRESH_EARLY_MS = 15 * 60 * 1000
const INVALID_ENCRYPTED_REQUEST_MESSAGE = 'invalid encrypted request'
const INVALID_ENCRYPTED_RELOAD_KEY = 'menturo_invalid_encrypted_reload_at'
const INVALID_ENCRYPTED_RELOAD_WINDOW_MS = 10 * 1000
const activeSockets = new Set<WebSocket>()
const restartSockets = () => {
    for (const socket of activeSockets) {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close(4001, 'encryption mode changed')
    }
    activeSockets.clear()
}

const toBase64 = (bytes: Uint8Array) => {
    let value = ''
    for (let index = 0; index < bytes.length; index += 0x8000)
        value += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
    return btoa(value)
}
const fromBase64 = (value: string) => Uint8Array.from(atob(value), c => c.charCodeAt(0))
const isPublicPath = (url: URL) => url.pathname === '/api/encryption/session' ||
    url.pathname === '/health' || url.pathname.startsWith('/api/seo/') ||
    url.pathname.startsWith('/payment/webhook') || url.pathname.startsWith('/webhook')

const shouldRefreshForInvalidEncryptedRequest = (value: unknown) => {
    if (!value || typeof value !== 'object') return false

    const message =
        typeof (value as { message?: unknown }).message === 'string'
            ? (value as { message: string }).message
            : ''

    return message.trim().toLowerCase() === INVALID_ENCRYPTED_REQUEST_MESSAGE
}

const refreshCurrentPageForInvalidEncryptedRequest = () => {
    try {
        const lastReload =
            Number(sessionStorage.getItem(INVALID_ENCRYPTED_RELOAD_KEY)) || 0

        if (Date.now() - lastReload < INVALID_ENCRYPTED_RELOAD_WINDOW_MS) {
            return
        }

        sessionStorage.setItem(
            INVALID_ENCRYPTED_RELOAD_KEY,
            String(Date.now())
        )

        resetEncryptionSession()
        window.location.reload()
    } catch (_) {
        resetEncryptionSession()
        window.location.reload()
    }
}

const refreshIfInvalidEncryptedRequest = async (response: Response) => {
    try {
        const data =
            await response.clone().json()

        if (shouldRefreshForInvalidEncryptedRequest(data)) {
            refreshCurrentPageForInvalidEncryptedRequest()
        }
    } catch (_) { }
}

const refreshIfInvalidEncryptedRequestText = (text: string) => {
    try {
        const data =
            JSON.parse(text)

        if (shouldRefreshForInvalidEncryptedRequest(data)) {
            refreshCurrentPageForInvalidEncryptedRequest()
        }
    } catch (_) { }
}

async function createSession(nativeFetch: typeof window.fetch): Promise<CryptoSession> {
    const clientKeys = await crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
    const clientPublicKey = new Uint8Array(await crypto.subtle.exportKey('spki', clientKeys.publicKey))
    const response = await nativeFetch(`${BASE_URL}/api/encryption/session`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientPublicKey: toBase64(clientPublicKey) })
    })
    if (!response.ok) throw new Error(`Encryption handshake failed (${response.status})`)
    const handshake = await response.json()
    if (!handshake.enabled) return { enabled: false, sessionId: '', expiresAt: Number.POSITIVE_INFINITY }
    const pinnedKey = process.env.NEXT_PUBLIC_APP_ENCRYPTION_PUBLIC_KEY?.replace(/\s/g, '')
    if (!pinnedKey) throw new Error('NEXT_PUBLIC_APP_ENCRYPTION_PUBLIC_KEY is required when encryption is enabled')
    const serverPublicKey = await crypto.subtle.importKey('spki', fromBase64(pinnedKey),
        { name: 'ECDH', namedCurve: 'P-256' }, false, [])
    const sharedSecret = await crypto.subtle.deriveBits(
        { name: 'ECDH', public: serverPublicKey }, clientKeys.privateKey, 256)
    const hkdfKey = await crypto.subtle.importKey('raw', sharedSecret, 'HKDF', false, ['deriveBits'])
    const material = new Uint8Array(await crypto.subtle.deriveBits({
        name: 'HKDF', hash: 'SHA-256', salt: encoder.encode(handshake.sessionId),
        info: encoder.encode('menturo-transport-v1')
    }, hkdfKey, 1024))
    const names: Direction[] = ['http-c2s', 'http-s2c', 'ws-c2s', 'ws-s2c']
    const keys = {} as Record<Direction, CryptoKey>
    for (let index = 0; index < names.length; index++) {
        keys[names[index]] = await crypto.subtle.importKey('raw',
            material.slice(index * 32, index * 32 + 32), { name: 'AES-GCM' }, false,
            names[index].endsWith('c2s') ? ['encrypt'] : ['decrypt'])
    }
    return {
        enabled: true,
        sessionId: handshake.sessionId,
        expiresAt: Date.now() + Math.max(60, Number(handshake.expiresIn) || 28800) * 1000,
        keys
    }
}

const resetEncryptionSession = (restartWebSocket = true) => {
    sessionPromise = null
    currentSession = null
    if (restartWebSocket) restartSockets()
}

export async function getEncryptionSession(nativeFetch: typeof window.fetch = window.fetch) {
    if (currentSession?.enabled && currentSession.expiresAt - Date.now() <= REFRESH_EARLY_MS) {
        resetEncryptionSession()
    }
    if (currentSession) return currentSession
    sessionPromise ??= createSession(nativeFetch).catch(error => {
        sessionPromise = null
        throw error
    })
    currentSession = await sessionPromise
    return currentSession
}

async function encrypt(session: CryptoSession, direction: Direction, plaintext: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const result = new Uint8Array(await crypto.subtle.encrypt({
        name: 'AES-GCM', iv, additionalData: encoder.encode(`menturo-${direction}-v1`), tagLength: 128
    }, session.keys![direction], encoder.encode(plaintext)))
    return JSON.stringify({ v: 1, sid: session.sessionId, iv: toBase64(iv),
        ct: toBase64(result.slice(0, -16)), tag: toBase64(result.slice(-16)) } satisfies Envelope)
}

async function decrypt(session: CryptoSession, direction: Direction, text: string) {
    const envelope = JSON.parse(text) as Envelope
    if (envelope.v !== 1 || envelope.sid !== session.sessionId) throw new Error('Invalid encrypted envelope')
    const ciphertext = fromBase64(envelope.ct), tag = fromBase64(envelope.tag)
    const combined = new Uint8Array(ciphertext.length + tag.length)
    combined.set(ciphertext); combined.set(tag, ciphertext.length)
    return decoder.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(envelope.iv),
        additionalData: encoder.encode(`menturo-${direction}-v1`), tagLength: 128 },
    session.keys![direction], combined))
}

export function installEncryptedFetch() {
    const nativeFetch = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(input instanceof Request ? input.url : input.toString(), window.location.href)
        if (url.origin !== new URL(BASE_URL).origin || isPublicPath(url)) return nativeFetch(input, init)
        const session = await getEncryptionSession(nativeFetch)
        if (!session.enabled) {
            const response = await nativeFetch(input, init)
            if (response.status === 426) {
                resetEncryptionSession()
                return window.fetch(input, init)
            }
            await refreshIfInvalidEncryptedRequest(response)
            return response
        }
        const request = input instanceof Request ? input : null
        const headers = new Headers(request?.headers)
        if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value))
        headers.set('X-Menturo-Session', session.sessionId)
        headers.set('X-Menturo-Encrypted', '1')
        headers.set('Content-Type', 'application/json')
        let body = init?.body
        if (body === undefined && request && !['GET', 'HEAD'].includes(request.method)) body = await request.clone().text()
        if (body != null) {
            if (typeof body !== 'string') throw new Error('Encrypted transport supports text/JSON bodies')
            body = await encrypt(session, 'http-c2s', body)
        }
        const response = await nativeFetch(url, { ...(request ? { method: request.method,
            credentials: request.credentials, cache: request.cache, redirect: request.redirect,
            referrer: request.referrer, referrerPolicy: request.referrerPolicy, signal: request.signal } : {}),
            ...init, credentials: init?.credentials ?? request?.credentials ?? 'include', headers, body })
        if (response.headers.get('X-Menturo-Rekey') === '1' && headers.get('X-Menturo-Retry') !== '1') {
            resetEncryptionSession()
            const retryHeaders = new Headers(init?.headers ?? request?.headers)
            retryHeaders.set('X-Menturo-Retry', '1')
            return window.fetch(input, { ...init, headers: retryHeaders })
        }
        let encryptedResponse = response.headers.get('X-Menturo-Encrypted') === '1'
        if (!encryptedResponse) {
            try {
                const candidate = await response.clone().json() as Partial<Envelope>
                encryptedResponse = candidate.v === 1 && candidate.sid === session.sessionId &&
                    typeof candidate.iv === 'string' && typeof candidate.ct === 'string' &&
                    typeof candidate.tag === 'string'
            } catch (_) { }
        }
        if (!encryptedResponse) {
            await refreshIfInvalidEncryptedRequest(response)
            return response
        }
        const plaintext = await decrypt(session, 'http-s2c', await response.text())
        refreshIfInvalidEncryptedRequestText(plaintext)
        if (response.headers.get('X-Menturo-Mode') === 'off') {
            resetEncryptionSession()
        }
        const responseHeaders = new Headers(response.headers)
        responseHeaders.delete('Content-Length'); responseHeaders.delete('Content-Encoding')
        return new Response(plaintext, { status: response.status, statusText: response.statusText, headers: responseHeaders })
    }
    return () => { window.fetch = nativeFetch }
}

export async function encryptedWebSocketUrl(url: string) {
    const session = await getEncryptionSession()
    if (!session.enabled) return { url, session }
    const value = new URL(url); value.searchParams.set('encSession', session.sessionId)
    return { url: value.toString(), session }
}
export async function encryptWebSocketMessage(session: CryptoSession, value: unknown) {
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    return session.enabled ? encrypt(session, 'ws-c2s', text) : text
}
export async function decryptWebSocketMessage(session: CryptoSession, value: string) {
    return session.enabled ? decrypt(session, 'ws-s2c', value) : value
}
export function sendEncryptedWebSocket(socket: WebSocket, value: unknown) {
    activeSockets.add(socket)
    void getEncryptionSession()
        .then(session => encryptWebSocketMessage(session, value))
        .then(payload => {
            if (socket.readyState === WebSocket.OPEN) socket.send(payload)
        })
}
export async function readEncryptedWebSocket(value: string) {
    return decryptWebSocketMessage(await getEncryptionSession(), value)
}
