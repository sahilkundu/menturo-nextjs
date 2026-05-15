'use client'

import { useState } from "react"

interface RightSidebarProps {
    head?: boolean
}

export default function RightSidebar({
    head = false
}: RightSidebarProps) {

    const [open, setOpen] = useState(false)

    return (
        <>

            {/* OPEN BUTTON ONLY FOR MOBILE */}
            {head && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-5 right-5 z-[999] w-14 h-14 rounded-full bg-violet-600 text-white shadow-lg"
                >
                    ☰
                </button>
            )}

            {/* OVERLAY */}
            {head && (
                <div
                    onClick={() => setOpen(false)}
                    className={`
                        fixed
                        inset-0
                        bg-black/50
                        z-[1001]
                        transition-opacity
                        duration-300

                        ${open
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                        }
                    `}
                />
            )}

            {/* SIDEBAR / BOTTOM SHEET */}
            <div
                id="profileBottomSheet"
                className={`
                    fixed
                    bottom-0
                    left-0
                    right-0
                    bg-white
                    rounded-t-[28px]
                    z-[1002]
                    overflow-y-auto

                    ${head
                        ? `
                                max-h-[85vh]
                                shadow-[0_-8px_30px_rgba(0,0,0,0.15)]
                                duration-300
                                translate-y-full
                                [transition-property:transform]
                                [transition-timing-function:cubic-bezier(0.2,0.9,0.4,1.1)]

                                ${open ? "translate-y-0" : "translate-y-full"}
                              `
                        : `
                                relative
                                max-h-none
                                shadow-none
                                translate-y-0
                              `
                    }
                `}
            >

                {/* HEADER */}
                <div
                    className={
                        head
                            ? "sticky top-0 bg-white p-4 border-b border-gray-100 rounded-t-[28px] flex justify-between items-center"
                            : "flex justify-between items-center mb-5 p-5"
                    }
                >

                    <h3
                        className={`font-semibold ${head ? "text-lg" : ""}`}
                    >
                        Your Profile
                    </h3>

                    {head ? (
                        <button
                            onClick={() => setOpen(false)}
                            className="
                                w-8
                                h-8
                                rounded-full
                                bg-gray-100
                                flex
                                items-center
                                justify-center
                            "
                        >
                            ✕
                        </button>
                    ) : (
                        <button>⋮</button>
                    )}

                </div>

                <div className="p-5">

                    {/* PROFILE INFO */}
                    <div className="text-center">

                        <div className="w-24 h-24 rounded-full border-[5px] border-violet-600 p-1 mx-auto">
                            <img
                                src="https://i.pravatar.cc/100?img=12"
                                className="w-full h-full rounded-full object-cover"
                                alt=""
                            />
                        </div>

                        <h2 className="font-bold text-lg mt-4">
                            Good Morning Aman
                        </h2>

                        <p className="text-sm text-gray-500 mt-2 leading-6">
                            Continue Your Journey And Achieve Target
                        </p>

                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">

                            <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs font-semibold text-violet-700 inline-block mr-2">
                                ⭐ Pro Member
                            </div>

                            <div className="bg-violet-100 rounded-full px-3 py-1.5 text-xs font-semibold text-violet-700 inline-block">
                                ⭐ Your Rank
                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}
                    {head ? (
                        <div className="mt-6 pt-3 border-t border-gray-100">

                            <button
                                className="
                                    w-full
                                    py-3
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition
                                    hover:bg-red-100
                                "
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        <div className="flex justify-center gap-3 mt-6">

                            <button className="w-10 h-10 rounded-full border">
                                🔔
                            </button>

                            <button className="w-10 h-10 rounded-full border">
                                ✉
                            </button>

                            <button className="w-10 h-10 rounded-full border">
                                ⚙
                            </button>

                        </div>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-2 gap-3 mt-6">

                        <div className="rounded-2xl bg-violet-50 p-4">

                            <p className="text-xs text-gray-500 mb-2">
                                Total Users
                            </p>

                            <h2 className="text-2xl font-black text-violet-700">
                                260
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-green-50 p-4">

                            <p className="text-xs text-gray-500 mb-2">
                                Online
                            </p>

                            <div className="flex items-center gap-2">

                                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>

                                <h2 className="text-2xl font-black text-green-600">
                                    26
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* ACTIVE USERS */}
                    <div className="mt-6">

                        <div className="flex items-center justify-between mb-4">

                            <h3 className="font-semibold">
                                Active Users
                            </h3>

                            <button className="text-sm text-violet-600 font-medium">
                                View All
                            </button>

                        </div>

                        <div className="space-y-4">

                            {[
                                {
                                    name: "Ravi Kumar",
                                    role: "UI Designer",
                                    img: 31,
                                },
                                {
                                    name: "Akash Singh",
                                    role: "Frontend Developer",
                                    img: 18,
                                },
                                {
                                    name: "Aman Deep",
                                    role: "Student",
                                    img: 41,
                                },
                            ].map((user, index) => (

                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="relative">

                                            <img
                                                src={`https://i.pravatar.cc/50?img=${user.img}`}
                                                className="w-11 h-11 rounded-full"
                                                alt=""
                                            />

                                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>

                                        </div>

                                        <div>

                                            <h4 className="text-sm font-medium">
                                                {user.name}
                                            </h4>

                                            <p className="text-xs text-gray-400">
                                                {user.role}
                                            </p>

                                        </div>

                                    </div>

                                    <button className="text-xs bg-violet-100 text-violet-700 px-3 py-2 rounded-full">
                                        Active
                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}