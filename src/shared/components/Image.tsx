'use client'
import { useTheme } from "../../app/providers/ThemeProvider"
import { Sparkles } from "lucide-react"

export default function Image() {
    const { system, theme } = useTheme()
    const useDesktopImage = system.loginStyle === 'image-left'

    // For desktop: render the full image with content
    return (
        <>
            {/* MOBILE BACKGROUND - ONLY ON MOBILE */}
            <div className="lg:hidden fixed inset-0 -z-10">
                <img
                    src="/loginBg.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
                <div
                    className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/60'
                        } backdrop-blur-[2px]`}
                />
            </div>

            {/* DESKTOP IMAGE - ONLY RENDER IF image-left IS ENABLED */}
            {useDesktopImage && (
                <div className="relative w-full h-full">
                    <img
                        src="/loginBg.png"
                        alt="Business Platform Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

                    <div className="relative z-10 p-12 xl:p-16 flex flex-col justify-between h-full text-white">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <img src="/M3.png" className="h-8" alt="Menturo" />
                                </div>
                            </div>

                            <div className="max-w-2xl space-y-6">
                                <h1 className="text-brand text-4xl font-bold">
                                    Crack Your Dream Exam<br />
                                    With Smart Preparation
                                </h1>
                                <p className="text-gray-200">
                                    Practice with real exam-level mock tests, track your rank, and improve faster with AI-powered performance insights.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 max-w-lg">
                                {[
                                    'All India Rank',
                                    'Real Exam Simulation',
                                    'Detailed Performance Analysis',
                                    'Topic-wise Test Series',
                                    'Previous Year Questions',
                                    'AI-Based Weakness Detection'
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-gray-300">
                                        <div className="badge-theme p-1">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-400">© 2026 Menturo</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}