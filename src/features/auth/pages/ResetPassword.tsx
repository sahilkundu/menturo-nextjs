'use client'
import { useState } from "react"
import { useTheme } from "../../../app/providers/ThemeProvider"
import Image from "../../../shared/components/Image"
import Input from "../../../shared/components/Input"
import {
    Lock
} from "lucide-react"

export default function ResetPasswordPage() {
    const { system, theme } = useTheme()
    const [isLoading, setIsLoading] = useState(false)

    const useDesktopImage = system.loginStyle === 'image-left'

    return (
        <div className="h-screen flex flex-col lg:flex-row relative overflow-hidden">

            {/* 🔥 MOBILE BACKGROUND IMAGE */}
            {/* <Image /> */}

            {/* 🔐 LOGIN SIDE */}
            <div
                className={`relative z-20 flex justify-center w-full h-full login-scrollbar overflow-y-auto ${useDesktopImage ? "lg:ml-auto" : ""
                    }`}
            >
                <div className="w-full max-w-md my-auto py-5">
                    <div className="card-theme backdrop-blur-xl shadow-2xl p-6 sm:p-8">
                        <div className="mb-6">
                            <h1 className="h1-theme">Welcome Back</h1>
                            <p className="text-theme mt-2">Reset Password</p>
                        </div>
                        <form className="form-card space-y-4">
                            <Input
                                name="password"
                                type="password"
                                label="New Password"
                                placeholder="new password"
                                icon={Lock}
                            />
                            <Input
                                name="password"
                                type="password"
                                label="Confirm New Password"
                                placeholder="confirm new password"
                                icon={Lock}
                            />
                            <button className="form-btn-theme -mt-2" disabled={isLoading}>
                                {isLoading ? "Retriving..." : 'Change Password'}
                            </button>
                            <div className="flex-column">
                                <div className="flex -mt-6 justify-end text-sm">
                                    <button
                                        type="button"
                                        className="link-theme font-medium hover:underline"
                                    >
                                        Back to login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
