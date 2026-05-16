'use client'

import { Fingerprint } from "lucide-react"

export default function LoginExtraFeatures() {

    return (

        <div className="mt-4 pt-4 w-full">

            {/* OR Divider */}
            <div className="relative mb-5">

                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-theme/20"></div>
                </div>

                <div className="relative flex justify-center">
                    <span
                        className="px-3 text-[11px] font-semibold bg-theme-main"
                        style={{
                            color: 'var(--textSecondary)'
                        }}
                    >
                        OR
                    </span>
                </div>

            </div>

            {/* SOCIAL BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">

                {/* GOOGLE */}
                <button className="social-btn-theme w-full flex items-center justify-center gap-2">

                    <img
                        src="https://www.google.com/favicon.ico"
                        className="w-5 h-5"
                        alt="Google"
                    />

                    <span className="text-sm font-medium">
                        Google
                    </span>

                </button>

                {/* APPLE */}
                <button className="social-btn-theme w-full flex items-center justify-center gap-2">

                    <img
                        src="https://www.apple.com/favicon.ico"
                        className="w-5 h-5"
                        alt="Apple"
                    />

                    <span className="text-sm font-medium">
                        Apple
                    </span>

                </button>

            </div>

            {/* BIOMETRIC */}
            <button className="social-btn-theme w-full flex items-center justify-center gap-2 mt-3">

                <Fingerprint className="w-5 h-5" />

                <span className="text-sm font-medium">
                    Face / Biometric Login
                </span>

            </button>

        </div>
    )
}