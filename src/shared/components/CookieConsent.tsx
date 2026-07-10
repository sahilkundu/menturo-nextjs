'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type ConsentChoice = 'accepted' | 'essential'

const STORAGE_KEY = 'menturo-cookie-consent-v1'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

const shouldShowOnPath = (
    pathname: string
) =>
    pathname === '/' ||
    pathname === '/series' ||
    pathname.startsWith('/series/') ||
    pathname === '/typingPro'

export default function CookieConsent() {
    const pathname =
        usePathname()
    const [choice, setChoice] = useState<ConsentChoice | null>(null)
    const [ready, setReady] = useState(false)
    const isAllowedPage =
        shouldShowOnPath(pathname)

    useEffect(() => {
        const saved =
            window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null

        if (saved === 'accepted' || saved === 'essential') {
            setChoice(saved)
        }

        setReady(true)
    }, [])

    useEffect(() => {
        window.dataLayer =
            window.dataLayer || []

        window.gtag =
            window.gtag ||
            function gtag(...args: unknown[]) {
                window.dataLayer.push(args)
            }

        window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
        })
    }, [])

    useEffect(() => {
        if (!choice) {
            return
        }

        const granted =
            choice === 'accepted'

        window.gtag?.('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied',
        })
    }, [choice])

    const saveChoice = (nextChoice: ConsentChoice) => {
        window.localStorage.setItem(STORAGE_KEY, nextChoice)
        setChoice(nextChoice)
        window.dispatchEvent(
            new Event('menturo-consent-changed')
        )
    }

    const shouldLoadAds =
        Boolean(adsenseClient)

    return (
        <>
            {shouldLoadAds ? (
                <Script
                    id="adsense-loader"
                    strategy="afterInteractive"
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
                    crossOrigin="anonymous"
                />
            ) : null}

            {ready && !choice && isAllowedPage ? (
                <div data-nosnippet className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-4xl rounded-3xl border border-violet-200 bg-white p-5 text-slate-800 shadow-2xl">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">
                                Privacy choices
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Menturo uses essential cookies for login, security, and site
                                features. With your permission, we may also use cookies or
                                similar technology to understand page visits, improve test-series
                                recommendations, measure ads, and personalize advertising. If you
                                decline optional cookies, eligible contextual or limited ads may
                                still appear without personalized ad storage.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                            <button
                                type="button"
                                onClick={() => saveChoice('accepted')}
                                className="rounded-xl bg-[#4b397c] px-5 py-3 text-sm font-black text-white"
                            >
                                Accept analytics and ads
                            </button>
                            <button
                                type="button"
                                onClick={() => saveChoice('essential')}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700"
                            >
                                Essential only
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

declare global {
    interface Window {
        dataLayer: unknown[][]
        gtag?: (...args: unknown[]) => void
    }
}
