'use client'

import { useEffect, useRef, useState } from 'react'

type ConsentChoice = 'accepted' | 'essential'

type AdSenseAdProps = {
    slot?: string
    className?: string
}

const STORAGE_KEY = 'menturo-cookie-consent-v1'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const defaultAdsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT

export default function AdSenseAd({
    slot,
    className = '',
}: AdSenseAdProps) {
    const [, setChoice] = useState<ConsentChoice | null>(null)
    const requestedRef = useRef(false)
    const adSlot =
        slot ||
        defaultAdsenseSlot

    useEffect(() => {
        const readChoice = () => {
            const saved =
                window.localStorage.getItem(STORAGE_KEY)

            setChoice(
                saved === 'accepted' || saved === 'essential'
                    ? saved
                    : null
            )
        }

        readChoice()
        window.addEventListener('menturo-consent-changed', readChoice)

        return () => {
            window.removeEventListener('menturo-consent-changed', readChoice)
        }
    }, [])

    useEffect(() => {
        if (
            !adsenseClient ||
            !adSlot ||
            requestedRef.current
        ) {
            return
        }

        requestedRef.current = true

        try {
            window.adsbygoogle =
                window.adsbygoogle || []

            window.adsbygoogle.push({})
        } catch {
            requestedRef.current = false
        }
    }, [adSlot])

    if (!adsenseClient || !adSlot) {
        return null
    }

    return (
        <aside
            aria-label="Advertisement"
            className={`overflow-hidden rounded-2xl bg-white p-2 text-center ${className}`}
        >
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                Advertisement
            </span>
            <ins
                className="adsbygoogle block"
                style={{ display: 'block' }}
                data-ad-client={adsenseClient}
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </aside>
    )
}

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>
    }
}
