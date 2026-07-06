'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CreditCard, FolderOpen, RefreshCcw } from 'lucide-react'
import { USER_MY_COURSES, USER_SUBSCRIPTIONS } from '../../../api'
import { createSeriesSlug } from '../seo'
import { goToLoginAfterRememberingPage } from '../utils/loginRedirect'
import { useRouter } from 'next/navigation'

type SeriesSummary = {
    _id?: string
    name?: string
    image?: string
    tags?: string[]
}

type CourseItem = {
    accessId?: string
    seriesId?: string
    series?: SeriesSummary
    isExpired?: boolean
    validity?: {
        from?: number
        to?: number
    } | null
    paidPlan?: Array<Record<string, any>>
    oldPlans?: Array<Record<string, any>>
    updatedAt?: number
}

type PaymentItem = {
    paymentRecordId?: string
    seriesId?: string
    series?: SeriesSummary
    planID?: number
    amount?: number
    amountPaise?: number
    currency?: string
    status?: string
    razorpayOrderId?: string
    paymentId?: string
    verified?: boolean
    accessGranted?: boolean
    createdAt?: number
    verifiedAt?: number
    accessGrantedAt?: number
    plan?: Record<string, any> | null
}

const formatDate = (value?: number) => {
    if (!value) return '-'

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value))
}

const formatMoney = (amount?: number, currency = 'INR') => {
    const rupees =
        Number(amount || 0)

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(rupees)
}

const getPlanName = (plan?: Record<string, any> | null) =>
    String(plan?.name || plan?.title || plan?.planName || 'Plan')

const getPaymentStatusClass = (status?: string) => {
    const normalized =
        String(status || '').toLowerCase()

    if (normalized === 'paid') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    }

    if (
        normalized === 'failed' ||
        normalized.includes('mismatch')
    ) {
        return 'bg-rose-50 text-rose-700 ring-rose-200'
    }

    if (
        normalized === 'created' ||
        normalized === 'creating'
    ) {
        return 'bg-blue-50 text-blue-700 ring-blue-200'
    }

    if (
        normalized === 'expired'
    ) {
        return 'bg-amber-50 text-amber-700 ring-amber-200'
    }

    return 'bg-slate-100 text-slate-700 ring-slate-200'
}

const getSeriesHref = (series?: SeriesSummary, seriesId?: string) => {
    const id =
        series?._id || seriesId || ''

    return id
        ? `/series/${createSeriesSlug(series?.name || 'test-series', id)}`
        : '/series'
}

function EmptyState({
    icon,
    title,
    text,
}: {
    icon: ReactNode
    title: string
    text: string
}) {
    return (
        <div className="rounded-2xl border border-[#E2DDF3] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#F8F6FF] text-[#4A3F77]">
                {icon}
            </div>
            <h2 className="mt-4 text-lg font-black text-[#171426]">{title}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">{text}</p>
            <Link href="/series" className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#4A3F77] px-4 text-xs font-black text-white">
                Browse Series
            </Link>
        </div>
    )
}

function PageShell({
    title,
    subtitle,
    loading,
    error,
    onRetry,
    children,
}: {
    title: string
    subtitle: string
    loading: boolean
    error: string
    onRetry: () => void
    children: ReactNode
}) {
    return (
        <main className="min-h-[100dvh] bg-slate-100 px-2 py-3 pb-20 text-[#171426] sm:px-3 lg:px-4">
            <section className="mx-auto max-w-7xl rounded-[24px] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,.05)] sm:rounded-[30px] sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EEEAFB] pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#5B21B6] sm:text-[28px]">{title}</h1>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
                    </div>

                    <button
                        onClick={onRetry}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E2DDF3] bg-[#F8F6FF] px-3 text-xs font-black text-[#4A3F77]"
                    >
                        <RefreshCcw size={15} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {error}
                    </div>
                )}

                {loading
                    ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="h-52 animate-pulse rounded-2xl bg-[#F4F1FA]" />
                            ))}
                        </div>
                    )
                    : children}
            </section>
        </main>
    )
}

export function MyCoursePage() {
    const router =
        useRouter()
    const [courses, setCourses] =
        useState<CourseItem[]>([])
    const [loading, setLoading] =
        useState(true)
    const [error, setError] =
        useState('')

    const load = async () => {
        setLoading(true)
        setError('')

        try {
            const response =
                await fetch(USER_MY_COURSES, {
                    credentials: 'include',
                })
            const data =
                await response.json()

            if (response.status === 401) {
                await goToLoginAfterRememberingPage(router)
                return
            }

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Unable to load courses')
            }

            setCourses(data.courses || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load courses')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    return (
        <PageShell
            title="My Course"
            subtitle="Your paid test series access, validity, and archived plans."
            loading={loading}
            error={error}
            onRetry={() => void load()}
        >
            {courses.length === 0 ? (
                <div className="mt-5">
                    <EmptyState icon={<FolderOpen size={22} />} title="No courses yet" text="Purchased test series will appear here." />
                </div>
            ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => {
                        const activePlan =
                            course.paidPlan?.[0]
                        const series =
                            course.series
                        const href =
                            getSeriesHref(series, course.seriesId)

                        return (
                            <Link key={course.accessId || course.seriesId} href={href} className="overflow-hidden rounded-2xl border border-[#E2DDF3] bg-[#FBFAFF] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="relative h-36 bg-[#EEEAFB]">
                                    {series?.image ? (
                                        <Image src={series.image} alt={series?.name || 'Test series'} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                                    ) : null}
                                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${course.isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {course.isExpired ? 'Expired' : 'Active'}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs font-black uppercase text-[#5B21B6]">{series?.tags?.[0] || 'Test Series'}</p>
                                    <h2 className="mt-1 line-clamp-2 min-h-10 text-base font-black leading-5 text-[#171426]">{series?.name || 'Test Series'}</h2>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
                                        <div className="rounded-xl bg-white p-3">
                                            <p className="text-[10px] uppercase text-slate-400">Paid</p>
                                            <p className="mt-1 truncate text-[#4A3F77]">{formatDate(course.validity?.from)}</p>
                                        </div>
                                        <div className="rounded-xl bg-white p-3">
                                            <p className="text-[10px] uppercase text-slate-400">Expire</p>
                                            <p className="mt-1 truncate text-[#4A3F77]">{formatDate(course.validity?.to)}</p>
                                        </div>
                                    </div>

                                    <p className="mt-3 truncate text-xs font-black text-[#4A3F77]">
                                        {getPlanName(activePlan)}
                                    </p>

                                    {course.oldPlans?.length ? (
                                        <p className="mt-1 text-[11px] font-bold text-slate-500">
                                            {course.oldPlans.length} old plan{course.oldPlans.length === 1 ? '' : 's'} archived
                                        </p>
                                    ) : null}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </PageShell>
    )
}

export function SubscriptionPage() {
    const router =
        useRouter()
    const [payments, setPayments] =
        useState<PaymentItem[]>([])
    const [accessHistory, setAccessHistory] =
        useState<CourseItem[]>([])
    const [loading, setLoading] =
        useState(true)
    const [error, setError] =
        useState('')

    const load = async () => {
        setLoading(true)
        setError('')

        try {
            const response =
                await fetch(USER_SUBSCRIPTIONS, {
                    credentials: 'include',
                })
            const data =
                await response.json()

            if (response.status === 401) {
                await goToLoginAfterRememberingPage(router)
                return
            }

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Unable to load subscriptions')
            }

            setPayments(data.payments || [])
            setAccessHistory(data.accessHistory || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load subscriptions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    const oldPlanCount =
        useMemo(
            () => accessHistory.reduce((total, item) => total + (item.oldPlans?.length || 0), 0),
            [accessHistory]
        )

    return (
        <PageShell
            title="Subscription"
            subtitle="Payment history, access history, and archived old plans."
            loading={loading}
            error={error}
            onRetry={() => void load()}
        >
            {payments.length === 0 && accessHistory.length === 0 ? (
                <div className="mt-5">
                    <EmptyState icon={<CreditCard size={22} />} title="No subscriptions yet" text="Payments and plan history will appear here." />
                </div>
            ) : (
                <div className="mt-5 space-y-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#F8F6FF] p-4">
                            <p className="text-xs font-black uppercase text-slate-400">Payments</p>
                            <p className="mt-1 text-2xl font-black text-[#4A3F77]">{payments.length}</p>
                        </div>
                        <div className="rounded-2xl bg-[#F8F6FF] p-4">
                            <p className="text-xs font-black uppercase text-slate-400">Access Records</p>
                            <p className="mt-1 text-2xl font-black text-[#4A3F77]">{accessHistory.length}</p>
                        </div>
                        <div className="rounded-2xl bg-[#F8F6FF] p-4">
                            <p className="text-xs font-black uppercase text-slate-400">Old Plans</p>
                            <p className="mt-1 text-2xl font-black text-[#4A3F77]">{oldPlanCount}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#E2DDF3]">
                        <div className="grid grid-cols-[1.2fr_.8fr_.7fr_.7fr] gap-3 bg-[#F8F6FF] px-4 py-3 text-xs font-black uppercase text-[#4A3F77] max-md:hidden">
                            <span>Series</span>
                            <span>Plan</span>
                            <span>Amount</span>
                            <span>Status</span>
                        </div>

                        <div className="divide-y divide-[#EEEAFB]">
                            {payments.map((payment) => {
                                const href =
                                    getSeriesHref(payment.series, payment.seriesId)

                                return (
                                    <Link key={payment.paymentRecordId || payment.razorpayOrderId} href={href} className="grid gap-3 px-4 py-4 text-sm transition hover:bg-[#FBFAFF] md:grid-cols-[1.2fr_.8fr_.7fr_.7fr]">
                                        <div>
                                            <p className="font-black text-[#171426]">{payment.series?.name || 'Test Series'}</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(payment.createdAt)}</p>
                                        </div>
                                        <p className="font-bold text-slate-600">{getPlanName(payment.plan)}</p>
                                        <p className="font-black text-[#059669]">{formatMoney(payment.amount, payment.currency)}</p>
                                        <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${payment.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {payment.status || 'unknown'}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {oldPlanCount ? (
                        <div className="rounded-2xl border border-[#E2DDF3] bg-white p-4">
                            <h2 className="text-lg font-black text-[#171426]">Old Plans</h2>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                {accessHistory.flatMap((item) =>
                                    (item.oldPlans || []).map((plan, index) => (
                                        <Link key={`${item.accessId}-${index}`} href={getSeriesHref(item.series, item.seriesId)} className="rounded-xl bg-[#FBFAFF] p-3">
                                            <p className="text-xs font-black uppercase text-[#5B21B6]">{item.series?.name || 'Test Series'}</p>
                                            <p className="mt-1 font-black text-[#171426]">{getPlanName(plan)}</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">
                                                Archived before latest access
                                            </p>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </PageShell>
    )
}

export function MyPurchasePage() {
    const router =
        useRouter()
    const [payments, setPayments] =
        useState<PaymentItem[]>([])
    const [accessHistory, setAccessHistory] =
        useState<CourseItem[]>([])
    const [loading, setLoading] =
        useState(true)
    const [error, setError] =
        useState('')

    const load = async () => {
        setLoading(true)
        setError('')

        try {
            const response =
                await fetch(USER_SUBSCRIPTIONS, {
                    credentials: 'include',
                })
            const data =
                await response.json()

            if (response.status === 401) {
                await goToLoginAfterRememberingPage(router)
                return
            }

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Unable to load purchases')
            }

            setPayments(data.payments || [])
            setAccessHistory(data.accessHistory || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load purchases')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    const oldPlanCount =
        useMemo(
            () => accessHistory.reduce((total, item) => total + (item.oldPlans?.length || 0), 0),
            [accessHistory]
        )

    return (
        <PageShell
            title="My Purchase"
            subtitle="Your courses, payment history, access validity, and old plans in one place."
            loading={loading}
            error={error}
            onRetry={() => void load()}
        >
            {payments.length === 0 && accessHistory.length === 0 ? (
                <div className="mt-5">
                    <EmptyState icon={<CreditCard size={22} />} title="No purchases yet" text="Purchased test series, payments, and plans will appear here." />
                </div>
            ) : (
                <div className="mt-4 space-y-5">
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl bg-[#F8F6FF] px-3 py-2.5">
                            <p className="text-[10px] font-black uppercase text-slate-400">Courses</p>
                            <p className="mt-0.5 text-xl font-black text-[#4A3F77]">{accessHistory.length}</p>
                        </div>
                        <div className="rounded-xl bg-[#F8F6FF] px-3 py-2.5">
                            <p className="text-[10px] font-black uppercase text-slate-400">Payments</p>
                            <p className="mt-0.5 text-xl font-black text-[#4A3F77]">{payments.length}</p>
                        </div>
                        <div className="rounded-xl bg-[#F8F6FF] px-3 py-2.5">
                            <p className="text-[10px] font-black uppercase text-slate-400">Old Plans</p>
                            <p className="mt-0.5 text-xl font-black text-[#4A3F77]">{oldPlanCount}</p>
                        </div>
                    </div>

                    {accessHistory.length ? (
                        <section>
                            <h2 className="text-lg font-black text-[#171426]">My Course</h2>
                            <div className="mt-2 grid gap-2 lg:grid-cols-2">
                                {accessHistory.map((course) => {
                                    const activePlan =
                                        course.paidPlan?.[0]
                                    const series =
                                        course.series

                                    return (
                                        <Link key={course.accessId || course.seriesId} href={getSeriesHref(series, course.seriesId)} className="flex min-h-[112px] overflow-hidden rounded-xl border border-[#E2DDF3] bg-[#FBFAFF] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                            <div className="relative h-auto w-[96px] shrink-0 bg-[#EEEAFB] sm:w-[112px]">
                                                {series?.image ? (
                                                    <Image src={series.image} alt={series?.name || 'Test series'} fill sizes="112px" className="object-contain p-1" />
                                                ) : null}
                                            </div>

                                            <div className="min-w-0 flex-1 p-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="min-w-0 truncate text-[10px] font-black uppercase text-[#5B21B6]">{series?.tags?.[0] || 'Test Series'}</p>
                                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${course.isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {course.isExpired ? 'Expired' : 'Active'}
                                                    </span>
                                                </div>

                                                <h3 className="mt-1 line-clamp-2 text-sm font-black leading-[18px] text-[#171426]">{series?.name || 'Test Series'}</h3>

                                                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] font-bold text-slate-600">
                                                    <div className="rounded-lg bg-white px-2 py-1.5">
                                                        <p className="text-[8px] uppercase text-slate-400">Paid</p>
                                                        <p className="truncate text-[#4A3F77]">{formatDate(course.validity?.from)}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-white px-2 py-1.5">
                                                        <p className="text-[8px] uppercase text-slate-400">Expire</p>
                                                        <p className="truncate text-[#4A3F77]">{formatDate(course.validity?.to)}</p>
                                                    </div>
                                                </div>

                                                <p className="mt-1.5 truncate text-[11px] font-black text-[#4A3F77]">{getPlanName(activePlan)}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>
                    ) : null}

                    {payments.length ? (
                        <section>
                            <div className="flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <h2 className="text-lg font-black text-[#171426]">Payment History</h2>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">Tap any payment to open the related test series.</p>
                                </div>
                            </div>

                            <div className="mt-3 grid gap-3">
                                {payments.map((payment) => (
                                    <Link
                                        key={payment.paymentRecordId || payment.razorpayOrderId}
                                        href={getSeriesHref(payment.series, payment.seriesId)}
                                        className="group rounded-2xl border border-[#E2DDF3] bg-white p-4 shadow-[0_8px_24px_rgba(74,63,119,0.06)] transition hover:-translate-y-0.5 hover:border-[#CFC5EA] hover:bg-[#FBFAFF] hover:shadow-[0_14px_30px_rgba(74,63,119,0.10)]"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase leading-none ring-1 ${getPaymentStatusClass(payment.status)}`}>
                                                        {payment.status || 'unknown'}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {formatDate(payment.createdAt)}
                                                    </span>
                                                </div>

                                                <h3 className="mt-2 line-clamp-2 text-base font-black leading-5 text-[#171426] transition group-hover:text-[#5B21B6]">
                                                    {payment.series?.name || 'Test Series'}
                                                </h3>

                                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                                                    <span className="rounded-full bg-[#F8F6FF] px-3 py-1.5 text-[#4A3F77]">
                                                        {getPlanName(payment.plan)}
                                                    </span>
                                                    {payment.razorpayOrderId ? (
                                                        <span className="max-w-full truncate rounded-full bg-slate-50 px-3 py-1.5 text-slate-500">
                                                            {payment.razorpayOrderId}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#EEEAFB] pt-3 md:min-w-[170px] md:flex-col md:items-end md:border-t-0 md:pt-0">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-black uppercase text-slate-400">Amount</p>
                                                    <p className="mt-1 text-xl font-black leading-none text-[#059669]">
                                                        {formatMoney(payment.amount, payment.currency)}
                                                    </p>
                                                </div>

                                                <span className="text-xs font-black text-[#5B21B6]">
                                                    View Series
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {oldPlanCount ? (
                        <section className="rounded-2xl border border-[#E2DDF3] bg-white p-4">
                            <h2 className="text-lg font-black text-[#171426]">Old Plans</h2>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                {accessHistory.flatMap((item) =>
                                    (item.oldPlans || []).map((plan, index) => (
                                        <Link key={`${item.accessId}-${index}`} href={getSeriesHref(item.series, item.seriesId)} className="rounded-xl bg-[#FBFAFF] p-3">
                                            <p className="text-xs font-black uppercase text-[#5B21B6]">{item.series?.name || 'Test Series'}</p>
                                            <p className="mt-1 font-black text-[#171426]">{getPlanName(plan)}</p>
                                            <p className="mt-1 text-xs font-semibold text-slate-500">Archived before latest access</p>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>
                    ) : null}
                </div>
            )}
        </PageShell>
    )
}
