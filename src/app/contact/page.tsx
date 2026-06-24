'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CREATE_GRIEVANCE } from '../../../api'
import Spinner from '../../shared/components/Spinner'
import TestSectionHead from '../../shared/components/TestSectionHead'
import { useUserStore } from '../../shared/store/user'
import { goToLoginAfterRememberingPage } from '../../shared/utils/loginRedirect'

export default function ContactPage() {
    const router = useRouter()
    const user = useUserStore((state) => state.user)
    const authenticated = useUserStore((state) => state.authenticated)
    const [email, setEmail] = useState(authenticated ? user?.email || '' : '')
    const [mobile, setMobile] = useState(authenticated ? user?.mobile || '' : '')
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [rateLimited, setRateLimited] = useState(false)
    const count = query.trim() ? query.trim().split(/\s+/).length : 0

    useEffect(() => {
        setEmail(authenticated ? user?.email || '' : '')
        setMobile(authenticated ? user?.mobile || '' : '')
        setQuery('')
        setStatus('')
        setSubmitting(false)
        setRateLimited(false)
    }, [authenticated, user?.email, user?.mobile])

    useEffect(() => {
        if (!email) {
            setRateLimited(false)
            return
        }

        const now = Date.now()
        const key = 'menturo-grievances-' + email.toLowerCase()
        const recent = (JSON.parse(localStorage.getItem(key) || '[]') as number[])
            .filter((time) => now - time < 21600000)
        localStorage.setItem(key, JSON.stringify(recent))
        setRateLimited(recent.length >= 2)
    }, [email])

    const submit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (submitting || rateLimited) return

        const key = 'menturo-grievances-' + email.toLowerCase()
        const now = Date.now()
        const recent = (JSON.parse(localStorage.getItem(key) || '[]') as number[])
            .filter((time) => now - time < 21600000)

        if (recent.length >= 2) {
            setRateLimited(true)
            setStatus('You can submit only 2 grievances in 6 hours. / आप 6 घंटों में केवल 2 शिकायतें दर्ज कर सकते हैं।')
            return
        }

        setSubmitting(true)
        setStatus('')
        try {
            const response = await fetch(CREATE_GRIEVANCE, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user?.username || '', email, mobile, query }),
            })
            const data = await response.json()
            setStatus(data.message || 'Unable to submit grievance')
            if (data.success) {
                localStorage.setItem(key, JSON.stringify([...recent, now]))
                setQuery('')
                if (recent.length + 1 >= 2) setRateLimited(true)
            }
        } catch {
            setStatus('Network error. Please try again. / नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।')
        } finally {
            setSubmitting(false)
        }
    }

    return <main className="min-h-[100dvh] bg-slate-50 px-2 py-2 text-slate-800 sm:px-3">
        <TestSectionHead userName={user?.username || ''} rollingId="" activePlan={authenticated ? 'Menturo User' : 'Guest'} badgeText="Menturo Support" onHome={() => router.push('/')} onLogin={() => void goToLoginAfterRememberingPage(router)} showSignIn={!authenticated} />
        <div className="mx-auto mt-4 grid max-w-5xl gap-6 md:grid-cols-[.8fr_1.2fr]">
            <section className="rounded-3xl bg-[#4b397c] p-7 text-white">
                <p className="text-sm font-bold text-violet-200">MENTURO SUPPORT / सहायता</p>
                <h1 className="mt-2 text-3xl font-black">How can we help?<br/><span className="text-xl text-violet-200">हम आपकी कैसे सहायता कर सकते हैं?</span></h1>
                <p className="mt-5 leading-7 text-violet-100">Send your query. / अपनी समस्या भेजें। हमारी सहायता टीम इसकी समीक्षा करेगी।</p>
                <div className="mt-8 space-y-4 text-sm"><p><b>Email / ईमेल</b><br/>support@menturo.in</p><p><b>Address / पता</b><br/>Narwana, District Jind, Haryana, India — 126116</p></div>
            </section>
            <form onSubmit={submit} autoComplete="off" className="rounded-3xl bg-white p-7 shadow-sm">
                <h2 className="text-xl font-black">Submit a grievance / शिकायत दर्ज करें</h2>
                <div className="mt-5 grid gap-3">
                    <input value={email} onChange={(event) => { setRateLimited(false); setEmail(event.target.value) }} type="email" autoComplete="off" required placeholder="Email address / ईमेल" className="rounded-xl border p-3" />
                    <input value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" autoComplete="off" required placeholder="Mobile number / मोबाइल नंबर" className="rounded-xl border p-3" />
                    <textarea value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" required maxLength={5000} placeholder="Describe your query / अपनी समस्या विस्तार से लिखें" className="min-h-40 rounded-xl border p-3" />
                    <p className="text-right text-xs text-slate-500">{count}/500 words / शब्द</p>
                    <button disabled={!email || !mobile || !query || count > 500 || submitting || rateLimited} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                        {submitting ? <><Spinner size={16}/>Submitting / भेजा जा रहा है…</> : rateLimited ? '6 hours limit reached / 6 घंटे की सीमा पूरी हुई' : 'Submit grievance / शिकायत दर्ज करें'}
                    </button>
                    {status && <p role="status" className="text-sm text-slate-600">{status}</p>}
                </div>
            </form>
        </div>
    </main>
}
