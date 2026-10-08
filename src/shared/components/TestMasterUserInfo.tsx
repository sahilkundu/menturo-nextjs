'use client'

import { useEffect, useState } from "react"

import { useUserStore } from "../store/user"
import { useTestDataStore } from "../store/testDataStore"
import TestTimer from "./TestTimer"

export default function TestMasterUserInfo({
    onClose,
}: {
    onClose?: () => void
}) {

    // =====================================
    // HYDRATION FIX
    // =====================================

    const [mounted, setMounted] = useState(false)
    const [clientDevice, setClientDevice] = useState({
        browser: 'Unknown Browser',
        os: 'Unknown OS',
        device: 'Desktop',
    })

    useEffect(() => {
        setMounted(true)
        const userAgent = navigator.userAgent || ''
        const platform = navigator.platform || ''
        const browser = /Edg\//i.test(userAgent)
            ? 'Edge'
            : /Chrome\//i.test(userAgent)
                ? 'Chrome'
                : /Firefox\//i.test(userAgent)
                    ? 'Firefox'
                    : /Safari\//i.test(userAgent)
                        ? 'Safari'
                        : 'Unknown Browser'
        const os = /Android/i.test(userAgent)
            ? 'Android'
            : /iPhone|iPad|iPod/i.test(userAgent)
                ? 'iOS'
                : /Windows/i.test(userAgent)
                    ? 'Windows'
                    : /Mac OS|Macintosh/i.test(userAgent)
                        ? 'MacOS'
                        : /Linux/i.test(userAgent) || /Linux/i.test(platform)
                            ? 'Linux'
                            : 'Unknown OS'
        const device = /Tablet|iPad/i.test(userAgent)
            ? 'Tablet'
            : /Mobile|Android|iPhone|iPod/i.test(userAgent)
                ? 'Mobile'
                : 'Desktop'
        setClientDevice({ browser, os, device })
    }, [])

    // =====================================
    // STORES
    // =====================================

    const user =
        useUserStore((state) => state.user)

    const deviceInfo =
        useTestDataStore((state) => state.activeTest?.deviceInfo || {})



    // =====================================
    // DEVICE INFO
    // =====================================

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
        clientDevice.device

    // =====================================
    // OS
    // =====================================

    const os =
        deviceInfo?.os ||
        deviceInfo?.platform ||
        clientDevice.os

    // =====================================
    // BROWSER
    // =====================================

    const browser =
        deviceInfo?.browser ||
        clientDevice.browser

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

                <div className="flex shrink-0 items-center gap-1.5">
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
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-200"
                            aria-label="Close question palette"
                        >
                            ✕
                        </button>
                    )}
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
