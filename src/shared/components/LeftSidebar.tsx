'use client'

import { useLayoutStore } from "../store/uiResStore"


export default function LeftSidebar() {

    const head: boolean = useLayoutStore(
        (state) => state.leftMobile
    )

    const leftSidebarOpen = useLayoutStore(
        (state) => state.leftSidebarOpen
    )

    const setLeftSidebarOpen = useLayoutStore(
        (state) => state.setLeftSidebarOpen
    )

    return (
        <>

            {/* OVERLAY */}
            {head && leftSidebarOpen && (
                <div
                    onClick={() => setLeftSidebarOpen(false)}
                    className="
                        fixed
                        inset-0
                        bg-violet-600/40
                        z-[999]
                        transition-all
                        duration-300
                        ease-in-out
                    "
                    style={{
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`
        w-[250px]
        bg-white
        rounded-r-[24px]

        shadow-[5px_0_30px_rgba(0,0,0,0.1)]

        ${head
                        ? `
                fixed
                top-0
                left-0
                bottom-0
                z-[1000]
                overflow-y-auto
              `
                        : `
    sticky
    top-0
    self-start
    h-[100vh]
    overflow-y-auto
  `
                    }
    `}
                style={{
                    transform: head
                        ? leftSidebarOpen
                            ? "translateX(0)"
                            : "translateX(-100%)"
                        : "translateX(0)",

                    opacity: head
                        ? leftSidebarOpen
                            ? 1
                            : 0.92
                        : 1,

                    transition:
                        "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",

                    willChange: "transform, opacity"
                }}
            >

                <div className="p-2">

                    {/* MOBILE HEADER */}
                    {head && (
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">

                            <div className="flex items-center gap-2">

                                <span className="text-2xl">
                                    🎓
                                </span>

                                <span className="font-black text-xl">
                                    Exam Mitra
                                </span>

                            </div>

                            <button
                                onClick={() => setLeftSidebarOpen(false)}
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-200
                                    transition-colors
                                "
                            >
                                ✕
                            </button>

                        </div>
                    )}

                    {/* MENU */}
                    <div className="space-y-1.5">

                        <button className="w-full h-11 rounded-2xl bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 text-sm font-semibold flex items-center gap-3 px-4 transition-all hover:shadow-md">
                            <span>📊</span>
                            Dashboard
                        </button>

                        <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                            <span>📁</span>
                            My Course
                        </button>

                        <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                            <span>💳</span>
                            Subscription
                        </button>

                        <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                            <span>📘</span>
                            Attendence
                        </button>

                        <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                            <span>📖</span>
                            Book My Library
                        </button>

                        <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                            <span>⚙️</span>
                            Settings
                        </button>


                    </div>

                    <div className="my-6 border-t border-gray-100"></div>

                    {/* OTHERS */}
                    <div>

                        <div className="flex items-center gap-2 mb-4">

                            <span className="text-gray-400 text-xs">
                                ⋯
                            </span>

                            <h3 className="text-[11px] font-bold text-gray-400 uppercase">
                                Others
                            </h3>

                        </div>

                        <div className="space-y-1.5">

                            <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                                <span>🏆</span>
                                Certificates
                            </button>

                            <button className="w-full h-11 rounded-2xl bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 font-semibold flex items-center gap-3 px-4 transition-all hover:shadow-md">
                                <span>📋</span>
                                Review Center
                            </button>

                            <button className="w-full h-11 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center gap-3 px-4 transition-colors">
                                <span>❓</span>
                                Question Banks
                            </button>

                        </div>

                    </div>

                    {/* CARD */}
                    <div className="mt-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-2 transition-all hover:shadow-md">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl">
                            ✦
                        </div>

                        <h3 className="font-extrabold text-gray-800 text-base mt-2">
                            AI Powered LMS
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                            Manage students and courses.
                        </p>

                        <button className="w-full mt-4 h-10 rounded-xl bg-gray-900 text-white text-sm font-semibold transition-all hover:bg-gray-800 hover:shadow-lg">
                            🚀 Upgrade
                        </button>

                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 pt-3 text-center">

                        <p className="text-[10px] text-gray-300">
                            © 2025 Exam Mitra
                        </p>

                    </div>

                </div>

            </div>

        </>
    )
}