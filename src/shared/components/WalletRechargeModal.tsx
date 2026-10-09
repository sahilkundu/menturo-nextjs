'use client'

import { useEffect, useState } from 'react'
import { WALLET, WALLET_ORDER, WALLET_VERIFY } from '../../../api'

type WalletPackage = {
    id: string
    name: string
    credits: number
    priceRupees?: number
    active?: boolean
}

type WalletState = {
    enabled: boolean
    balance: number
    minimumCredits: number
    packages: WalletPackage[]
}

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
    }
}

let razorpayScriptPromise: Promise<boolean> | null = null

const loadRazorpay = () => {
    if (window.Razorpay) return Promise.resolve(true)
    if (razorpayScriptPromise) return razorpayScriptPromise

    razorpayScriptPromise = new Promise<boolean>((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => resolve(Boolean(window.Razorpay))
        script.onerror = () => {
            razorpayScriptPromise = null
            resolve(false)
        }
        document.body.appendChild(script)
    })

    return razorpayScriptPromise
}

export default function WalletRechargeModal({
    open,
    onClose,
    onBalanceChange,
}: {
    open: boolean
    onClose: () => void
    onBalanceChange?: (balance: number) => void
}) {
    const [wallet, setWallet] = useState<WalletState | null>(null)
    const [loading, setLoading] = useState(false)
    const [busy, setBusy] = useState('')
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    const loadWallet = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch(WALLET, { credentials: 'include', cache: 'no-store' })
            const data = await response.json()
            if (!response.ok || data?.success === false) throw new Error(data?.message || 'Unable to load wallet')
            const next = {
                enabled: Boolean(data.enabled),
                balance: Number(data.balance || 0),
                minimumCredits: Number(data.minimumCredits || 10),
                packages: Array.isArray(data.packages) ? data.packages : [],
            }
            setWallet(next)
            onBalanceChange?.(next.balance)
        } catch (value) {
            setError(value instanceof Error ? value.message : 'Unable to load wallet')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) void loadWallet()
    }, [open])

    const buy = async (item: WalletPackage) => {
        setBusy(item.id)
        setError('')
        setNotice('')
        try {
            const response = await fetch(WALLET_ORDER, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: item.id }),
            })
            const order = await response.json()
            if (!response.ok || order?.success === false) throw new Error(order?.message || 'Unable to create wallet order')
            if (!(await loadRazorpay()) || !window.Razorpay) throw new Error('Payment checkout could not be loaded')

            const checkout = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency || 'INR',
                name: 'Menturo',
                description: `${order.credits} wallet credits`,
                order_id: order.orderId,
                handler: async (payment: Record<string, string>) => {
                    try {
                        const verifyResponse = await fetch(WALLET_VERIFY, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payment),
                        })
                        const verified = await verifyResponse.json()
                        if (!verifyResponse.ok || verified?.success === false) throw new Error(verified?.message || 'Wallet payment verification failed')
                        setNotice(`${order.credits} credits added successfully.`)
                        await loadWallet()
                    } catch (value) {
                        setError(value instanceof Error ? value.message : 'Wallet payment verification failed')
                    } finally {
                        setBusy('')
                    }
                },
                modal: { ondismiss: () => setBusy('') },
                theme: { color: '#4A3F77' },
            })
            checkout.open()
        } catch (value) {
            setError(value instanceof Error ? value.message : 'Wallet recharge failed')
            setBusy('')
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#F8F7FC] p-4 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-label="Buy wallet credits">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Menturo wallet</p>
                        <h2 className="mt-1 text-2xl font-black text-[#292342]">Buy credits</h2>
                        <p className="mt-1 text-sm text-slate-500">1 credit = ₹1 · Minimum recharge: {wallet?.minimumCredits || 10} credits</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-slate-500 shadow-sm hover:text-slate-900" aria-label="Close">×</button>
                </div>
                {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
                {notice && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{notice}</div>}
                {loading ? <div className="py-12 text-center text-sm font-semibold text-slate-500">Loading recharge plans...</div> : !wallet?.enabled ? <div className="py-12 text-center text-sm font-semibold text-slate-500">No recharge plans are available right now.</div> : <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{wallet.packages.filter((item) => item.active !== false).map((item) => <article key={item.id} className="rounded-3xl border border-[#E8E3F8] bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{item.name}</p><p className="mt-4 text-4xl font-black text-[#4A3F77]">{item.credits}<span className="ml-2 text-sm text-slate-400">credits</span></p><p className="mt-1 font-bold text-slate-600">₹{item.priceRupees || item.credits}</p><button type="button" disabled={Boolean(busy)} onClick={() => void buy(item)} className="mt-5 w-full rounded-2xl bg-[#4A3F77] px-4 py-3 text-sm font-black text-white hover:bg-[#392f61] disabled:opacity-50">{busy === item.id ? 'Opening payment...' : 'Buy credits'}</button></article>)}{wallet.packages.filter((item) => item.active !== false).length === 0 && <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-white p-6 text-center text-sm text-slate-500">No recharge plans are available.</div>}</div>}
            </section>
        </div>
    )
}
