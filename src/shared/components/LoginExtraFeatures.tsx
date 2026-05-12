'use client'
import {
    Fingerprint
} from "lucide-react"

export default function LoginExtraFeatures() {
    return (
        <div className="mt-6 pt-6">
            {/* OR Divider */}
            <div className="relative my-6 -mt-9">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-theme/20"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 text-xs font-semibold bg-theme-main" style={{ color: 'var(--textSecondary)' }}>
                        OR
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center justify-center space-x-2">
                    <button className="social-btn-theme">
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />&nbsp;
                        <span className="text-sm font-medium">Google</span>
                    </button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <button className="social-btn-theme">
                        <img src="https://www.apple.com/favicon.ico" className="w-7 h-7" alt="Google" />&nbsp;
                        <span className="text-sm font-medium">Apple</span>
                    </button>
                </div>
            </div>
            <button className="social-btn-theme w-full">
                <Fingerprint className="w-5 h-5 inline mr-2" />
                Face / Biometric Login
            </button>
        </div>
    )
}
