'use client'

import { useEffect, useState } from "react"

import { useUserStore } from "../store/user"
import { useTestDataStore } from "../store/testDataStore"
import TestTimer from "./TestTimer"

export default function TestMasterUserInfo() {

    // =====================================
    // HYDRATION FIX
    // =====================================

    const [mounted, setMounted] =
        useState(false)

    useEffect(() => {

        setMounted(true)

    }, [])

    // =====================================
    // STORES
    // =====================================

    const { user } =
        useUserStore()

    const { activeTest } =
        useTestDataStore()



    // =====================================
    // DEVICE INFO
    // =====================================

    const deviceInfo =
        activeTest?.deviceInfo || {}

    // =====================================
    // USER INFO
    // =====================================

    const username =
        user?.username ||
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
        "Unknown"

    // =====================================
    // DEVICE
    // =====================================

    const device =
        deviceInfo?.device ||
        "Desktop"

    // =====================================
    // OS
    // =====================================

    const os =
        deviceInfo?.os ||
        deviceInfo?.platform ||
        "Unknown OS"

    // =====================================
    // BROWSER
    // =====================================

    const browser =
        deviceInfo?.browser ||
        "Unknown Browser"

    // =====================================
    // IP
    // =====================================

    const ip =
        deviceInfo?.ipv4 ||
        deviceInfo?.ip ||
        deviceInfo?.ipv6 ||
        "Unavailable"

    // =====================================
    // TIMER
    // =====================================





    // =====================================
    // FORMAT TIME
    // =====================================

    const formatTime = (
        seconds: number
    ) => {

        const hrs =
            Math.floor(seconds / 3600)

        const mins =
            Math.floor(
                (seconds % 3600) / 60
            )

        const secs =
            seconds % 60

        if (hrs > 0) {

            return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        }

        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    if (!mounted) {

        return null
    }
    return (

        <div className="
            bg-gradient-to-b
            from-slate-50
            to-white
            border
            border-slate-200
            rounded-2xl
            p-2
            mb-2
            shadow-sm
        ">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="
                flex
                items-center
                gap-3
                pb-3
                border-b
                border-slate-200/70
            ">

                {/* PROFILE */}

                <div className="
                    w-11
                    h-11
                    rounded-full
                    bg-blue-100
                    border
                    border-blue-200
                    flex
                    items-center
                    justify-center
                    text-blue-600
                    shrink-0
                ">

                    <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        />
                    </svg>

                </div>

                {/* USER */}

                <div className="flex-1 min-w-0">

                    <div className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-800
                        truncate
                    ">

                        User

                    </div>

                    <div className="
                        text-[10px]
                        text-slate-400
                        font-semibold
                        truncate
                    ">

                        <b>{username}</b>

                    </div>

                </div>

                {/* TIMER */}

                <div className="
                    shrink-0
                    bg-rose-50
                    border
                    border-rose-100
                    rounded-xl
                    px-2.5
                    py-1.5
                    text-center
                ">

                    <div className="
                        text-[9px]
                        text-rose-400
                        font-bold
                        uppercase
                    ">
                        Time Left
                    </div>

                    <div className="
                        text-[12px]
                        font-black
                        text-rose-600
                        tracking-wide
                    ">

                        <TestTimer />

                    </div>

                </div>

            </div>

            {/* =====================================
                GRID INFO
            ===================================== */}

            <div className="
                mt-1
                grid
                grid-cols-1
                gap-2
                text-[10px]
            ">

                {/* SYSTEM */}

                <div className="
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    p-2
                ">

                    <div className="
                        text-slate-400
                        font-semibold
                    ">
                        System
                    </div>

                    <div className="
                        text-slate-800
                        font-bold
                        truncate
                        mt-0.5
                    ">
                        {os} • {browser} • {device} • {ip}
                    </div>

                </div>

            </div>

        </div>
    )
}