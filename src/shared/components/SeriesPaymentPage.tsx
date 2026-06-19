'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CHECK_COUPON, CREATE_ORDER } from '../../../api'
import { useUserStore } from '../store/user'
import { showRouteLoader } from '../utils/routeLoader'

interface FullSeries {
    series?: any
}

interface CouponState {
    applied: boolean
    saved: number
    message: string
}

declare global {
    interface Window {
        Razorpay?: any
    }
}

const getSeriesId = (series: any) => {
    const id = series?._id

    if (typeof id === 'string') {
        return id
    }

    return id?.$oid || id?.oid || series?.id || ''
}

const getSavedValue = (data: any) => {
    const rawSaved =
        data?.saved ??
        data?.save ??
        data?.savedAmount ??
        data?.discount ??
        0

    const parsed =
        Number(String(rawSaved).replace(/[^\d.]/g, ''))

    return Number.isFinite(parsed) ? parsed : 0
}

const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script =
            document.createElement('script')

        script.src =
            'https://checkout.razorpay.com/v1/checkout.js'
        script.onload =
            () => resolve(true)
        script.onerror =
            () => resolve(false)

        document.body.appendChild(script)
    })
}

export default function SeriesPaymentPage({ series }: FullSeries) {

    const router =
        useRouter()

    const authenticated =
        useUserStore(
            (state) =>
                state.authenticated
        )

    const scrollRef =
        useRef<HTMLDivElement>(null)

    const [couponCodes, setCouponCodes] =
        useState<Record<string, string>>({})

    const [couponStates, setCouponStates] =
        useState<Record<string, CouponState>>({})

    const [couponLoading, setCouponLoading] =
        useState<Record<string, boolean>>({})

    const [buyLoading, setBuyLoading] =
        useState<Record<string, boolean>>({})

    const updateCouponCode = (
        planID: string,
        value: string
    ) => {
        setCouponCodes((prev) => ({
            ...prev,
            [planID]: value
        }))

        setCouponStates((prev) => ({
            ...prev,
            [planID]: {
                applied: false,
                saved: 0,
                message: ''
            }
        }))
    }

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
            left: -320,
            behavior: 'smooth',
        })
    }

    const scrollRight = () => {
        scrollRef.current?.scrollBy({
            left: 320,
            behavior: 'smooth',
        })
    }

    const redirectToLogin = async () => {
        showRouteLoader()

        await fetch(
            "/redirect",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    path:
                        window.location.pathname,
                }),
            }
        )

        router.push("/login")
    }

    const applyCoupon = async (plan: any) => {
        const planKey =
            String(plan.planID)

        const coupon =
            (couponCodes[planKey] || '').trim()

        if (!coupon) {
            setCouponStates((prev) => ({
                ...prev,
                [planKey]: {
                    applied: false,
                    saved: 0,
                    message: 'Enter coupon code'
                }
            }))
            return
        }

        setCouponLoading((prev) => ({
            ...prev,
            [planKey]: true
        }))

        try {
            const response =
                await fetch(
                    CHECK_COUPON,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            ts:
                                getSeriesId(series),
                            planID:
                                Number(plan.planID),
                            coupon
                        }),
                    }
                )

            const data =
                await response.json().catch(() => ({}))

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message ||
                    'Coupon could not be applied'
                )
            }

            const saved =
                getSavedValue(data)

            setCouponStates((prev) => ({
                ...prev,
                [planKey]: {
                    applied: true,
                    saved,
                    message:
                        data?.message ||
                        `Applied successfully. You saved Rs ${saved}`
                }
            }))
        }
        catch (error: any) {
            setCouponStates((prev) => ({
                ...prev,
                [planKey]: {
                    applied: false,
                    saved: 0,
                    message:
                        error?.message ||
                        'Coupon could not be applied'
                }
            }))
        }
        finally {
            setCouponLoading((prev) => ({
                ...prev,
                [planKey]: false
            }))
        }
    }

    const buyNow = async (plan: any) => {
        if (!authenticated) {
            await redirectToLogin()
            return
        }

        const planKey =
            String(plan.planID)

        setBuyLoading((prev) => ({
            ...prev,
            [planKey]: true
        }))

        try {
            const razorpayReady =
                await loadRazorpayScript()

            if (!razorpayReady) {
                throw new Error('Unable to load Razorpay checkout')
            }

            const couponState =
                couponStates[planKey]

            const response =
                await fetch(
                    CREATE_ORDER,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify({
                            ts:
                                getSeriesId(series),
                            planID:
                                Number(plan.planID),
                            coupon:
                                couponCodes[planKey] || '',
                            saved:
                                couponState?.saved || 0
                        }),
                    }
                )

            const order =
                await response.json().catch(() => ({}))

            if (!response.ok || order?.success === false) {
                throw new Error(
                    order?.message ||
                    'Unable to create payment order'
                )
            }

            const checkout =
                new window.Razorpay({
                    key:
                        order.key,
                    amount:
                        order.amount,
                    currency:
                        order.currency || 'INR',
                    name:
                        'Menturo',
                    description:
                        `${series?.n || 'Test Series'} - ${plan.name}`,
                    order_id:
                        order.orderId,
                    handler:
                        () => {
                            alert('Payment completed successfully')
                        },
                    prefill:
                        {},
                    theme:
                        {
                            color:
                                '#4A3F77'
                        }
                })

            checkout.open()
        }
        catch (error: any) {
            alert(
                error?.message ||
                'Payment could not be started'
            )
        }
        finally {
            setBuyLoading((prev) => ({
                ...prev,
                [planKey]: false
            }))
        }
    }

    const availablePlans =
        series?.plans || []

    if (!series || availablePlans.length === 0) {
        return null
    }

    return (
        <div className="m-3 lg:col-span-2 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-gray-900">
                        <span className="bg-[#4A3F77] w-2 h-7 rounded-full"></span>
                        🔥 Current Test Series
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Choose your exam pack. One-time payment gets full access.
                    </p>
                </div>

                <div className="flex gap-2 md:hidden">
                    <button
                        onClick={scrollLeft}
                        className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ‹
                    </button>

                    <button
                        onClick={scrollRight}
                        className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="
                    flex
                    gap-4
                    overflow-x-auto
                    overflow-y-hidden
                    scroll-smooth
                    pb-4
                    pr-1
                    max-w-full
                    scrollbar-thin
                    scrollbar-thumb-indigo-300
                    scrollbar-track-indigo-100
                "
            >
                {availablePlans.map((plan: any, index: number) => {
                    const planKey =
                        String(plan.planID)

                    const discountPercent =
                        Math.round(
                            ((plan.price - plan.offerPrice) / plan.price) * 100
                        )

                    const savedAmount =
                        plan.price - plan.offerPrice

                    const planCouponCode =
                        couponCodes[planKey] || ''

                    const couponState =
                        couponStates[planKey]

                    const couponSaved =
                        couponState?.applied
                            ? couponState.saved
                            : 0

                    const totalAmount =
                        Math.max(0, plan.offerPrice - couponSaved)

                    const cardStyles = [
                        {
                            badge: "STARTER",
                            header:
                                "from-cyan-500 via-sky-500 to-blue-600",
                            ring:
                                "border-cyan-200",
                            glow:
                                "hover:shadow-cyan-200/60"
                        },
                        {
                            badge: "🔥 MOST POPULAR",
                            header:
                                "from-indigo-600 via-violet-600 to-purple-600",
                            ring:
                                "border-violet-200",
                            glow:
                                "hover:shadow-violet-300/60"
                        },
                        {
                            badge: "⭐ BEST VALUE",
                            header:
                                "from-emerald-500 via-green-500 to-teal-600",
                            ring:
                                "border-green-200",
                            glow:
                                "hover:shadow-green-300/60"
                        },
                        {
                            badge: "👑 ELITE",
                            header:
                                "from-orange-500 via-amber-500 to-yellow-500",
                            ring:
                                "border-yellow-200",
                            glow:
                                "hover:shadow-yellow-300/60"
                        }
                    ]

                    const style =
                        cardStyles[index % cardStyles.length]

                    return (
                        <div
                            key={plan.planID}
                            className={`
                                flex-shrink-0
                                w-[300px]
                                bg-white
                                rounded-[22px]
                                overflow-hidden
                                border
                                ${style.ring}
                                shadow-lg
                                ${style.glow}
                                transition-all
                                duration-300
                            `}
                        >
                            <div
                                className={`
                                    relative
                                    bg-gradient-to-r
                                    ${style.header}
                                    px-4
                                    py-3
                                `}
                            >
                                <span
                                    className="
                                        absolute
                                        right-3
                                        top-3
                                        bg-white/20
                                        backdrop-blur
                                        text-white
                                        text-[9px]
                                        font-bold
                                        px-2.5
                                        py-1
                                        rounded-full
                                    "
                                >
                                    {style.badge}
                                </span>

                                <p className="text-white/80 text-[11px]">
                                    Premium Test Series
                                </p>

                                <h3 className="text-white text-xl font-black mt-1 pr-24">
                                    {plan.name}
                                </h3>

                                <p className="text-white/90 text-[11px] mt-1 line-clamp-1">
                                    {series.n}
                                </p>
                            </div>

                            <div className="p-3.5">
                                <div className="flex justify-between items-center">
                                    <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                        ⏳ {plan.duration}
                                    </span>

                                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                        {discountPercent}% OFF
                                    </span>
                                </div>

                                <p className="text-gray-500 text-xs mt-2 line-clamp-2 min-h-[32px]">
                                    {plan.tagline}
                                </p>

                                <div className="mt-2.5">
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-black text-gray-900">
                                            ₹{totalAmount}
                                        </span>

                                        <span className="line-through text-gray-400 mb-1 text-sm">
                                            ₹{plan.price}
                                        </span>
                                    </div>

                                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                        <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                            Save ₹{savedAmount + couponSaved}
                                        </span>

                                        {couponSaved > 0 ? (
                                            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                                Coupon -₹{couponSaved}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                                        <div className="font-black text-indigo-700">
                                            {plan.allowedAttempt}
                                        </div>

                                        <div className="text-[10px] text-gray-500">
                                            Attempts
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                                        <div className="font-black text-indigo-700">
                                            {plan.duration}
                                        </div>

                                        <div className="text-[10px] text-gray-500">
                                            Validity
                                        </div>
                                    </div>
                                </div>

                                

                                <div className="mt-3">
                                    <div className="flex items-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-1">
                                        <input
                                            id={`coupon-${plan.planID}`}
                                            type="text"
                                            value={planCouponCode}
                                            onChange={(event) =>
                                                updateCouponCode(
                                                    planKey,
                                                    event.target.value.toUpperCase()
                                                )
                                            }
                                            aria-label="Apply coupon code"
                                            placeholder="Coupon code"
                                            className="min-w-0 flex-1 bg-white text-xs text-gray-800 placeholder:text-gray-400 border border-gray-200 rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-400"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => applyCoupon(plan)}
                                            disabled={couponLoading[planKey]}
                                            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-[11px] font-black px-3 py-2 rounded-xl transition"
                                        >
                                            {couponLoading[planKey]
                                                ? '...'
                                                : 'Apply'}
                                        </button>
                                    </div>

                                    {couponState?.message ? (
                                        <p
                                            className={`mt-1.5 text-[11px] font-semibold ${couponState.applied
                                                ? 'text-emerald-600'
                                                : 'text-rose-500'
                                                }`}
                                        >
                                            {couponState.applied
                                                ? `Applied successfully. Saved ₹${couponState.saved}`
                                                : couponState.message}
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => buyNow(plan)}
                                    disabled={buyLoading[planKey]}
                                    className={`
                                        w-full
                                        mt-3
                                        bg-gradient-to-r
                                        ${style.header}
                                        text-white
                                        font-black
                                        py-3
                                        rounded-2xl
                                        shadow-md
                                        transition-all
                                        duration-300
                                        hover:scale-[1.01]
                                        disabled:opacity-70
                                    `}
                                >
                                    {buyLoading[planKey]
                                        ? 'Starting Payment...'
                                        : 'Buy Now'}
                                </button>

                                <div className="mt-2.5 text-center">
                                    <p className="text-[10px] text-gray-500">
                                        🔒 Secure Payments • Instant Access
                                    </p>

                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        💳 UPI • Cards • Net Banking
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
