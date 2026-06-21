'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Mail,
    Smartphone,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react'

import { LOGIN } from '../../../../api'
import { useUserStore } from '../../../shared/store/user'
import { showRouteLoader } from '../../../shared/utils/routeLoader'

export default function Login() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email')

    const [password, setPassword] =
        useState('')

    const [showPassword, setShowPassword] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    // =========================
    // EMAIL VALIDATION
    // =========================

    const validateEmail = (email: string) => {

        const emailRegex =
            /^[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/

        if (!email || !emailRegex.test(email)) {
            return {
                valid: false,
                message: 'Please enter a valid email address',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    // =========================
    // MOBILE VALIDATION
    // =========================

    const validateMobile = (mobile: string) => {
        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return {
                valid: false,
                message:
                    'Mobile number must be exactly 10 digits',
            }
        }

        if (/^(\d)\1{9}$/.test(mobile)) {
            return {
                valid: false,
                message:
                    'Repeated digits are not allowed',
            }
        }

        const sequential = '1234567890'

        if (
            mobile === sequential ||
            mobile ===
            sequential
                .split('')
                .reverse()
                .join('')
        ) {
            return {
                valid: false,
                message:
                    'Sequential numbers are not allowed',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    // =========================
    // LOGIN API
    // =========================

    async function apiLogin(
        email: string,
        mobile: string,
        password: string
    ) {
        if (!email && !mobile) {
            return {
                success: false,
                message:
                    'Email or mobile is required',
            }
        }

        if (!password) {
            return {
                success: false,
                message:
                    'Password required',
            }
        }

        try {
            const response =
                await fetch(LOGIN, {
                    method: 'POST',

                    credentials: 'include',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        mobile,
                        email,

                        password,
                    }),
                })

            const data =
                await response.json()

            if (
                response.ok &&
                data.success
            ) {
                useUserStore
                    .getState()
                    .setUser(data.user)

                useUserStore
                    .getState()
                    .setAccess(data.access || {})

                showRouteLoader()

                setTimeout(() => {
                    router.replace(
                        decodeURIComponent(
                            data.redirect || '/'
                        )
                    )
                }, 500)
            }

            return data
        } catch {
            return {
                success: false,
                message: 'Network error',
            }
        }
    }

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        setError('')

        if (!email && !mobile) {
            setError('Enter your email address or mobile number')
            return
        }

        if (email && mobile) {
            setError('Use either your email address or mobile number')
            return
        }

        if (email) {
            const validation = validateEmail(email)
            if (!validation.valid) { setError(validation.message); return }
        }

        if (mobile) {
            const validation = validateMobile(mobile)
            if (!validation.valid) { setError(validation.message); return }
        }

        if (!password.trim()) {
            setError(
                'Password required'
            )
            return
        }

        setLoading(true)

        const result =
            await apiLogin(
                email,
                mobile,
                password
            )

        setLoading(false)

        if (!result.success) {
            setError(
                result.message ||
                'Login failed'
            )
        }
    }
    const authChecked =
        useUserStore((state) => state.authChecked)
    const fetchUser =
        useUserStore((state) => state.fetchUser)

    useEffect(() => {

        const checkAuth = async () => {

            if (!authChecked) {
                await fetchUser()
            }

            const {
                authenticated
            } = useUserStore.getState()

            if (authenticated) {

                showRouteLoader()
                router.replace("/")
            }
        }

        checkAuth()

    }, [authChecked, fetchUser, router])

    return (
        <div className="min-h-[100dvh] overflow-y-auto bg-[#4A3F77] lg:bg-transparent">
            <div className="flex min-h-[100dvh] w-full items-start justify-center px-4 py-6 lg:px-4 lg:py-10">
                <div className="relative w-full max-w-md my-auto">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-transparent rounded-3xl -z-10" />

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-6 md:p-8">
                        <div className="space-y-5">

                            {/* Heading */}
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome Back
                                </h1>
                                <p className="mt-2 text-sm text-gray-500">
                                    Sign in to continue
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1">
                                    <button type="button" onClick={() => { setLoginMethod('email'); setMobile(''); setError('') }} className={loginMethod === 'email' ? 'rounded-lg bg-white py-2 text-sm font-semibold text-purple-700 shadow-sm' : 'rounded-lg py-2 text-sm font-semibold text-gray-500'}>Email</button>
                                    <button type="button" onClick={() => { setLoginMethod('mobile'); setEmail(''); setError('') }} className={loginMethod === 'mobile' ? 'rounded-lg bg-white py-2 text-sm font-semibold text-purple-700 shadow-sm' : 'rounded-lg py-2 text-sm font-semibold text-gray-500'}>Mobile</button>
                                </div>

                                {/* Email */}
                                {loginMethod === 'email' && <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="login-email"
                                        name="username"
                                        type="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (!/^\d{10,}$/.test(value)) { setMobile(''); setEmail(value) }
                                        }}
                                        placeholder="Email address (optional)"
                                        className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    />
                                </div>}

                                {/* Mobile */}
                                {loginMethod === 'mobile' && <div className="relative">
                                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="login-mobile"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        inputMode="numeric"
                                        value={mobile}
                                        onChange={(e) => { setEmail(''); setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)) }}
                                        placeholder="Mobile number (optional)"
                                        className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    />
                                </div>}

                                {/* Password */}
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="login-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Password"
                                        className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-10 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                                        <p className="text-red-600 text-xs">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            showRouteLoader()
                                            router.push("/forgot-password")
                                        }}
                                        type="button"
                                        className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {loading
                                        ? "Signing In..."
                                        : "Sign In"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs text-gray-400 font-medium">
                                    OR
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* Signup */}
                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => {
                                        showRouteLoader()
                                        router.push("/register")
                                    }}
                                    type="button"
                                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
