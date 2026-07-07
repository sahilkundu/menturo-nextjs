'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { TRACK_VISITOR } from '../../../api'

const CONSENT_KEY = 'menturo-cookie-consent-v1'
const VISITOR_KEY = 'menturo-visitor-id-v1'
const DEDUPE_KEY_PREFIX = 'menturo-track-dedupe:'
const TRACKING_CONSENT_EVENT = 'menturo-consent-changed'
const TRACKING_CUSTOM_EVENT = 'menturo-track'

type TrackingPayload = Record<string, string>

declare global {
    interface WindowEventMap {
        [TRACKING_CUSTOM_EVENT]: CustomEvent<TrackingPayload>
    }
}

const createVisitorId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`
}

const setVisitorCookie = (visitorId: string) => {
    const secure =
        window.location.protocol === 'https:'
            ? '; Secure'
            : ''

    document.cookie =
        `${VISITOR_KEY}=${visitorId}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
}

const getVisitorId = () => {
    let visitorId =
        window.localStorage.getItem(VISITOR_KEY)

    if (!visitorId) {
        visitorId =
            createVisitorId()

        window.localStorage.setItem(
            VISITOR_KEY,
            visitorId
        )
    }

    setVisitorCookie(visitorId)

    return visitorId
}

const getSeriesIdFromPath = (pathname: string) => {
    if (!pathname.startsWith('/series/')) {
        return ''
    }

    const slug =
        pathname
            .split('/')
            .filter(Boolean)
            .pop() || ''
    const match =
        decodeURIComponent(slug)
            .match(/[a-f0-9]{24}$/i)

    return match?.[0] || ''
}

const normalizeKey = (
    value: string,
    fallback = 'page'
) => {
    const normalized =
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 40)

    return normalized || fallback
}

const getRouteSection = (pathname: string) => {
    const [firstSegment] =
        pathname
            .split('/')
            .filter(Boolean)

    return firstSegment
        ? normalizeKey(firstSegment)
        : 'home'
}

const createPayload = (
    pathname: string,
    search: string
) => {
    const section =
        getRouteSection(pathname)
    const payload: TrackingPayload = {
        event: `${section}_view`,
        page: pathname,
        interest: section,
    }

    if (pathname === '/') {
        payload.event = 'home_view'
        payload.interest = 'home'
    } else if (pathname.startsWith('/series/')) {
        payload.event = 'series_view'
        payload.seriesId =
            getSeriesIdFromPath(pathname)
        payload.interest = 'series'
    } else if (pathname === '/series') {
        payload.interest = 'series'

        if (search) {
            payload.event = 'series_search'
            payload.search =
                search.slice(0, 80)
        }
    } else if (pathname === '/typingPro') {
        payload.event = 'typing_start'
        payload.interest = 'typing'
    }

    return payload
}

const shouldTrack = () =>
    window.localStorage.getItem(CONSENT_KEY) === 'accepted'

const recentlySent = (
    key: string,
    windowMs = 30000
) => {
    const storageKey =
        `${DEDUPE_KEY_PREFIX}${key}`
    const now =
        Date.now()
    const previous =
        Number(window.sessionStorage.getItem(storageKey) || 0)

    if (previous && now - previous < windowMs) {
        return true
    }

    window.sessionStorage.setItem(
        storageKey,
        String(now)
    )

    return false
}

export default function VisitorTracker() {
    const pathname =
        usePathname()
    const searchParams =
        useSearchParams()

    useEffect(() => {
        const sendPayload = (payload: TrackingPayload) => {
            // if (!shouldTrack()) {
            //     return
            // }

            const dedupeKey =
                `${payload.event}:${payload.page}:${payload.seriesId || ''}:${payload.search || ''}`

            if (recentlySent(dedupeKey)) {
                return
            }

            const visitorId =
                getVisitorId()

            void fetch(
                TRACK_VISITOR,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        visitorId,
                        ...payload,
                    }),
                }
            ).catch(() => undefined)
        }

        const sendPageView = () => {
            const query =
                searchParams.get('q') ||
                searchParams.get('search') ||
                ''

            sendPayload(
                createPayload(
                    pathname,
                    query
                )
            )
        }

        const sendCustomEvent = (
            event: CustomEvent<TrackingPayload>
        ) => {
            sendPayload({
                page: pathname,
                ...event.detail,
            })
        }

        sendPageView()

        window.addEventListener(
            TRACKING_CONSENT_EVENT,
            sendPageView
        )
        window.addEventListener(
            TRACKING_CUSTOM_EVENT,
            sendCustomEvent
        )

        return () => {
            window.removeEventListener(
                TRACKING_CONSENT_EVENT,
                sendPageView
            )
            window.removeEventListener(
                TRACKING_CUSTOM_EVENT,
                sendCustomEvent
            )
        }
    }, [
        pathname,
        searchParams,
    ])

    return null
}
