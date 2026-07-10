'use client'

const DEVICE_ID_KEY = 'menturo_device_id'

const randomPart = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export const getDeviceId = () => {
    if (typeof window === 'undefined') {
        return ''
    }

    const existing =
        window.localStorage.getItem(DEVICE_ID_KEY)

    if (existing) {
        return existing
    }

    const deviceId =
        `web-${randomPart()}`

    window.localStorage.setItem(
        DEVICE_ID_KEY,
        deviceId
    )

    return deviceId
}

export const getClientDeviceInfo = () => {
    if (typeof window === 'undefined') {
        return {
            deviceId: '',
            screen: '',
            timezone: '',
            language: '',
            platform: '',
        }
    }

    return {
        deviceId:
            getDeviceId(),
        screen:
            `${window.screen.width}x${window.screen.height}`,
        timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        language:
            navigator.language || '',
        platform:
            navigator.platform || '',
    }
}
