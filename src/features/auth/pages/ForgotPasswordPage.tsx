'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
} from 'lucide-react'

// import { FORGOT_PASSWORD } from '@/lib/api'
import { FORGOT_PASS } from '../../../../api'
import { showRouteLoader } from '../../../shared/utils/routeLoader'
export default function ForgotPasswordPage() {
    const router = useRouter()


    const [step, setStep] =
        useState<
            'identify' |
            'otp' |
            'password'
        >('identify')
    const [otp, setOtp] =
        useState('')

    const [otpLength, setOtpLength] =
        useState(6)

    const [email, setEmail] =
        useState('')

    const [mobile, setMobile] =
        useState('')

    const [password, setPassword] =
        useState('')
    const [recipient, setRecipient] =
        useState('')

    const [sentTo, setSentTo] =
        useState('')
    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState('')

    const [showPassword, setShowPassword] =
        useState(false)

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const [message, setMessage] =
        useState('')
    const [resendTimer, setResendTimer] = useState(60)
    const [resending, setResending] = useState(false)
    const validatePassword = (
        password: string
    ) => {
        if (
            !password ||
            password.length < 6
        ) {
            return {
                valid: false,
                message:
                    'Password must be at least 6 characters long',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        setError('')
        setMessage('')

        try {
            setLoading(true)

            // STEP 1
            if (step === 'identify') {
                if (
                    !email.trim() &&
                    !mobile.trim()
                ) {
                    setError(
                        'Enter email or mobile number'
                    )
                    return
                }

                const response =
                    await fetch(
                        FORGOT_PASS,
                        {
                            method: 'POST',
                            credentials:
                                'include',
                            headers: {
                                'Content-Type':
                                    'application/json',
                            },
                            body: JSON.stringify(
                                {
                                    email:
                                        email ||
                                        undefined,
                                    mobile:
                                        mobile ||
                                        undefined,
                                }
                            ),
                        }
                    )

                const data =
                    await response.json()

                if (
                    !response.ok
                ) {
                    setError(
                        data.message ||
                        'Request failed'
                    )
                    return
                }

                setMessage(
                    data.message ||
                    'Account verified'
                )

                if (data.otpRequired === true) {
                    setOtpLength(Number(data.len) || 6)

                    setRecipient(data.recipient || '')
                    setSentTo(data.sentTo || '')

                    setStep('otp')
                } else {
                    setStep('password')
                }

                return
            }
            if (step === 'otp') {
                const response =
                    await fetch(
                        FORGOT_PASS,
                        {
                            method: 'POST',
                            credentials:
                                'include',
                            headers: {
                                'Content-Type':
                                    'application/json',
                            },
                            body: JSON.stringify({
                                otp,
                            }),
                        }
                    )

                const data =
                    await response.json()

                if (!response.ok) {
                    setError(
                        data.message ||
                        'Invalid OTP'
                    )
                    return
                }

                setMessage(
                    data.message ||
                    'OTP verified'
                )

                setStep('password')

                return
            }
            // STEP 2
            const passwordValidation =
                validatePassword(
                    password
                )

            if (
                !passwordValidation.valid
            ) {
                setError(
                    passwordValidation.message
                )
                return
            }

            if (
                password !==
                confirmPassword
            ) {
                setError(
                    'Passwords do not match'
                )
                return
            }

            const response =
                await fetch(
                    FORGOT_PASS,
                    {
                        method: 'POST',
                        credentials:
                            'include',
                        headers: {
                            'Content-Type':
                                'application/json',
                        },
                        body: JSON.stringify(
                            {
                                password,
                            }
                        ),
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {
                setError(
                    data.message ||
                    'Password reset failed'
                )
                return
            }

            setMessage(
                data.message ||
                'Password updated successfully'
            )

            showRouteLoader()

            setTimeout(() => {
                router.replace(
                    '/login'
                )
            }, 1500)
        } catch (err) {
            console.error(err)

            setError(
                'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }
    const handleResendOtp = async () => {
        try {
            setResending(true)
            setError('')
            setMessage('')

            const response = await fetch(
                FORGOT_PASS,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'resend-otp',
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                setError(
                    data.message ||
                    'Failed to resend OTP'
                )
                return
            }

            setMessage(
                data.message ||
                'OTP resent successfully'
            )

            setResendTimer(60)
        } catch {
            setError(
                'Failed to resend OTP'
            )
        } finally {
            setResending(false)
        }
    }
    useEffect(() => {
        if (step !== 'otp') return

        setResendTimer(60)

        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }

                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [step])

    return (
        <div className="min-h-[100dvh] overflow-y-auto bg-[#4A3F77] lg:bg-transparent">
            <div className="flex min-h-[100dvh] w-full items-start justify-center px-4 py-6 lg:px-4 lg:py-10">
                <div className="relative w-full max-w-md my-auto">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-transparent rounded-3xl -z-10" />

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/10 p-6 md:p-8">
                        <div className="space-y-5">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-[#000000]">
                                    Forgot Password
                                </h1>

                                <p className="mt-2 text-sm text-gray-500">
                                    {step === 'identify'
                                        ? 'Verify your account using email or mobile number'
                                        : step === 'otp'
                                            ? 'Enter OTP'
                                            : 'Create your new password'}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {step === 'identify' && (
                                    <>
                                        {/* Email */}
                                        <div className="relative">
                                            <Mail
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="Email Address"
                                                className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-[#000000] placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-px flex-1 bg-gray-200" />

                                            <span className="text-xs text-gray-400 font-medium">
                                                OR
                                            </span>

                                            <div className="h-px flex-1 bg-gray-200" />
                                        </div>

                                        {/* Mobile */}
                                        <div className="relative">
                                            <Phone
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="tel"
                                                maxLength={10}
                                                value={mobile}
                                                onChange={(e) =>
                                                    setMobile(
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ''
                                                        )
                                                    )
                                                }
                                                placeholder="Mobile Number"
                                                className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-[#000000] placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 'otp' && (
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">
                                                Verification code sent to
                                            </p>

                                            <p className="text-sm font-medium text-[#000000] break-all">
                                                {recipient}
                                            </p>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Please check your{" "}
                                                <span className="text-red-600 font-semibold">
                                                    Inbox
                                                </span>{" "}
                                                or{" "}
                                                <span className="text-red-600 font-semibold">
                                                    Spam
                                                </span>{" "}
                                                folder.
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 flex-wrap">
                                            {Array.from({
                                                length: otpLength,
                                            }).map((_, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength={1}
                                                    value={otp[index] || ''}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ''
                                                            )

                                                        const otpArray =
                                                            otp.split('')

                                                        otpArray[index] =
                                                            value

                                                        setOtp(
                                                            otpArray.join(
                                                                ''
                                                            )
                                                        )

                                                        if (
                                                            value &&
                                                            e.target
                                                                .nextElementSibling
                                                        ) {
                                                            (
                                                                e.target.nextElementSibling as HTMLInputElement
                                                            ).focus()
                                                        }
                                                    }}
                                                    className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-200 text-center text-lg text-[#000000] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center">
                                            {resendTimer > 0 ? (
                                                <p className="text-sm text-gray-500">
                                                    Resend OTP in {resendTimer}s
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resending}
                                                    className="text-purple-600 font-medium"
                                                >
                                                    {resending
                                                        ? 'Sending...'
                                                        : 'Resend OTP'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 'password' && (
                                    <>
                                        {/* New Password */}
                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="New Password"
                                                className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-10 text-[#000000] placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
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

                                        {/* Confirm Password */}
                                        <div className="relative">
                                            <Lock
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm Password"
                                                className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-10 text-[#000000] placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                                        <p className="text-red-600 text-xs">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {message && (
                                    <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                                        <p className="text-green-600 text-xs">
                                            {message}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {loading
                                        ? 'Please wait...'
                                        : step === 'identify'
                                            ? 'Verify Account'
                                            : step === 'otp'
                                                ? 'Verify OTP'
                                                : 'Reset Password'}
                                </button>
                            </form>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        showRouteLoader()
                                        router.push('/login')
                                    }}
                                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}
