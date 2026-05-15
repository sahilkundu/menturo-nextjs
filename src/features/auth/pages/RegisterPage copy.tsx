'use client'
import { useState } from "react"
import { useTheme } from "../../../app/providers/ThemeProvider"
import Image from "../../../shared/components/Image"
import LoginExtraFeatures from "../../../shared/components/LoginExtraFeatures"
import Input from "../../../shared/components/Input"
import {
    Lock,
    Smartphone,
    SmartphoneIcon
} from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
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
                className={`relative z-20 flex justify-center w-full h-full login-scrollbar overflow-y-auto ${useDesktopImage ? " lg:ml-auto" : ""
                    }`}
            >
                <div className="w-full max-w-md my-auto py-5">
                    <div className="card-theme backdrop-blur-xl shadow-2xl p-6 sm:p-8">
                        <div className="mb-6">
                            <h1 className="h1-theme">Welcome Back</h1>
                            <p className="text-theme mt-2">Create New Account</p>
                        </div>
                        <form className="form-card space-y-4">
                            <>
                                <Input
                                    name="username"
                                    type="text"
                                    label="Username"
                                    placeholder="your username"
                                    icon={SmartphoneIcon}
                                />
                                <Input
                                    name="mobile"
                                    type="number"
                                    label="Mobile Number"
                                    placeholder="your mobile"
                                    icon={SmartphoneIcon}
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email Id"
                                    placeholder="your email"
                                    icon={SmartphoneIcon}
                                />
                                <Input
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="your password"
                                    icon={Lock}
                                />
                                <Input
                                    name="password"
                                    type="password"
                                    label="Confirm Password"
                                    placeholder="confirm password"
                                    icon={Lock}
                                />
                            </>
                            <button className="form-btn-theme -mt-2" disabled={isLoading}>
                                {isLoading ? "Signing in..." : 'Create New Account'}
                            </button>
                            <div className="flex-column">
                                <div className="flex -mt-6 justify-end text-sm">
                                    <span className="text-theme2">Already have an account?</span>&nbsp;
                                    <Link href="/login">
                                        <button
                                            type="button"
                                            className="link-theme font-medium hover:underline"
                                        >
                                            Login
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <LoginExtraFeatures />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
