'use client'

import { showRouteLoader } from './routeLoader'

type LoginRouter = {
    push: (href: string) => void
}

const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/'

    return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

const normalizeRedirectPath = (path: string) => {
    if (!path || !path.startsWith('/')) return '/'
    if (path.startsWith('/login')) return '/'
    return path
}

export const rememberRedirectAfterLogin = async (
    path = getCurrentPath()
) => {
    if (typeof window === 'undefined') return

    try {
        await fetch('/redirect', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: normalizeRedirectPath(path),
            }),
        })
    } catch (_) { }
}

export const goToLoginAfterRememberingPage = async (
    router: LoginRouter,
    path?: string
) => {
    showRouteLoader()
    await rememberRedirectAfterLogin(path)
    router.push('/login')
}
