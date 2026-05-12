'use client'
import { useState } from "react"
import { useTheme } from "../../../app/providers/ThemeProvider"
import LoginExtraFeatures from "../../../shared/components/LoginExtraFeatures"
import Input from "../../../shared/components/Input"
import Link from 'next/link';
import {
    Lock,
    Smartphone,
    SmartphoneIcon
} from "lucide-react"

export default function LoginPage() {
    const { system, theme } = useTheme()
    const [mode, setMode] = useState<'password' | 'otp'>('password')
    const [isLoading, setIsLoading] = useState(false)
    const useDesktopImage = system.loginStyle === 'image-left'

    return (
        <div className="h-screen flex flex-col lg:flex-row relative overflow-hidden">

            {/* 🔥 MOBILE BACKGROUND IMAGE */}
            {/* <Image /> */}

            {/* 🔐 LOGIN SIDE */}
            <div
                className={`relative z-20 flex justify-center flex-1 w-full h-full login-scrollbar overflow-y-auto`}
            >
                <div className="w-full max-w-md my-auto py-5">
                    <div className="card-theme backdrop-blur-xl shadow-2xl p-6 sm:p-8">
                        <div className="mb-6">
                            <h1 className="h1-theme">Welcome Back</h1>
                            <p className="text-theme mt-2">Login to continue</p>
                        </div>
                        {/* MODE SWITCH */}
                        <div className="form-border flex rounded-xl p-1 mb-6 bg-theme-main">
                            <button onClick={() => setMode('password')} className={`flex-1 ${mode === 'password' ? 'form-btn-disabled-theme' : 'form-btn-inactive-theme'} py-3`}>
                                <Lock className="w-4 h-4 inline mr-2" />Password
                            </button>
                            <button onClick={() => setMode('otp')} className={`flex-1 ${mode !== 'password' ? 'form-btn-disabled-theme' : 'form-btn-inactive-theme'} py-3`}>
                                <Smartphone className="w-4 h-4 inline mr-2" />OTP
                            </button>
                        </div>
                        <form className="form-card space-y-4">
                            {mode === 'password' ? (
                                <>
                                    <Input
                                        name="mobile"
                                        type="number"
                                        label="Mobile Number"
                                        placeholder="your mobile"
                                        icon={SmartphoneIcon}
                                    />
                                    <Input
                                        name="password"
                                        type="password"
                                        label="Password"
                                        placeholder="your password"
                                        icon={Lock}
                                    />
                                </>
                            ) : (
                                <Input
                                    name="mobile"
                                    type="number"
                                    label="Mobile Number"
                                    placeholder="your mobile"
                                    icon={SmartphoneIcon}
                                />
                            )}
                            <button className="form-btn-theme -mt-2" disabled={isLoading}>
                                {isLoading ? "Signing in..." : mode === 'password' ? 'Login' : 'Send OTP'}
                            </button>
                            {mode === 'password' && (
                                <div className="flex-column">
                                    <div className="flex -mt-6 justify-end text-sm">
                                        <span className="text-theme2">Do not have an account?</span>&nbsp;
                                        <Link href="/register">
                                            <button
                                                type="button"
                                                className="link-theme font-medium hover:underline"
                                            >
                                                Create Account
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="flex  justify-end text-sm">
                                        <Link href="/forgot-password">
                                            <button
                                                type="button"
                                                className="link-theme font-medium hover:underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <LoginExtraFeatures />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
