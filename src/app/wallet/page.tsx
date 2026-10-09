'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WALLET, WALLET_ORDER, WALLET_VERIFY } from '../../../api'
import { showRouteLoader } from '../../shared/utils/routeLoader'

type WalletPackage = { id: string; name: string; credits: number; priceRupees: number; active: boolean }
type WalletState = { enabled: boolean; balance: number; minimumCredits: number; packages: WalletPackage[] }

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } } }

async function loadRazorpay() {
  if (window.Razorpay) return true
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Payment checkout could not be loaded'))
    document.body.appendChild(script)
  })
  return Boolean(window.Razorpay)
}

export default function WalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletState>({ enabled: false, balance: 0, minimumCredits: 10, packages: [] })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(WALLET, { credentials: 'include', cache: 'no-store' })
      const data = await response.json()
      if (response.status === 401) { router.replace('/login?redirect=/wallet'); return }
      if (!response.ok || data.success === false) throw new Error(data.message || 'Unable to load wallet')
      setWallet({ enabled: Boolean(data.enabled), balance: Number(data.balance || 0), minimumCredits: Number(data.minimumCredits || 10), packages: Array.isArray(data.packages) ? data.packages : [] })
    } catch (value) { setError(value instanceof Error ? value.message : 'Unable to load wallet') } finally { setLoading(false) }
  }, [router])

  useEffect(() => { void load() }, [load])

  const buy = async (item: WalletPackage) => {
    setError(''); setNotice(''); setBusy(item.id)
    try {
      const response = await fetch(WALLET_ORDER, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageId: item.id }) })
      const data = await response.json()
      if (!response.ok || data.success === false) throw new Error(data.message || 'Unable to create wallet order')
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error('Payment checkout is unavailable')
      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Menturo',
        description: `${data.credits} wallet credits`,
        order_id: data.orderId,
        handler: async (payment: Record<string, string>) => {
          const verify = await fetch(WALLET_VERIFY, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payment) })
          const verified = await verify.json()
          if (!verify.ok || verified.success === false) throw new Error(verified.message || 'Wallet payment verification failed')
          setNotice(`${data.credits} credits added to your wallet.`)
          await load()
        },
        modal: { ondismiss: () => setBusy('') },
        theme: { color: '#4A3F77' },
      })
      checkout.open()
    } catch (value) { setError(value instanceof Error ? value.message : 'Wallet recharge failed') } finally { setBusy('') }
  }

  if (loading) return <main className="min-h-screen bg-[#F8F7FC] p-6 text-[#292342]">Loading wallet...</main>
  return <main className="min-h-screen bg-[#F8F7FC] px-4 py-8 text-[#292342] sm:px-8">
    <div className="mx-auto max-w-5xl space-y-6">
      <button onClick={() => { showRouteLoader(); router.back() }} className="text-sm font-bold text-[#6656D9]">← Back</button>
      <section className="rounded-[28px] bg-gradient-to-br from-[#292342] via-[#514080] to-[#7655E8] p-6 text-white shadow-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">Menturo wallet</p>
        <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-black">Your credits</h1><p className="mt-2 text-white/75">Use one credit whenever a new test attempt starts.</p></div><div className="text-5xl font-black">{wallet.balance}<span className="ml-2 text-base font-bold text-white/70">credits</span></div></div>
      </section>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      {notice && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{notice}</div>}
      {!wallet.enabled ? <section className="rounded-3xl bg-white p-8 text-center shadow-sm"><h2 className="text-xl font-black">Wallet recharge is currently unavailable</h2><p className="mt-2 text-slate-500">Please use an active test plan or try again later.</p></section> : <section className="space-y-4"><div><h2 className="text-2xl font-black">Recharge credits</h2><p className="text-sm text-slate-500">Minimum recharge: {wallet.minimumCredits} credits</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{wallet.packages.filter((item) => item.active !== false).map((item) => <article key={item.id} className="rounded-3xl border border-[#E8E3F8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-bold text-slate-500">{item.name}</p><p className="mt-4 text-4xl font-black text-[#4A3F77]">{item.credits}<span className="ml-2 text-sm text-slate-400">credits</span></p><p className="mt-1 font-bold text-slate-600">₹{item.priceRupees || item.credits}</p><button disabled={Boolean(busy)} onClick={() => void buy(item)} className="mt-5 w-full rounded-2xl bg-[#4A3F77] px-4 py-3 text-sm font-black text-white transition hover:bg-[#392f61] disabled:opacity-50">{busy === item.id ? 'Opening payment...' : 'Recharge wallet'}</button></article>)}</div>{!wallet.packages.length && <div className="rounded-2xl bg-white p-6 text-slate-500">No recharge packages are available.</div>}</section>}
      <p className="text-xs leading-5 text-slate-400">Credits are deducted only after the server creates a test attempt successfully. Refreshing, resuming, viewing solutions, and viewing results do not consume credits.</p>
    </div>
  </main>
}

