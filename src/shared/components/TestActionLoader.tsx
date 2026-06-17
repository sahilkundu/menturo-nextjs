"use client"

import { useEffect, useRef, useState } from "react"
import {
    TEST_ACTION_LOADER_HIDE_EVENT,
    TEST_ACTION_LOADER_SHOW_EVENT,
    TestActionLoaderDetail,
} from "../utils/testActionLoader"

type LoaderState = {
    message: string
    phase: "enter" | "exit"
}

export default function TestActionLoader() {
    const [loader, setLoader] =
        useState<LoaderState | null>(null)

    const hideTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearHideTimer = () => {
        if (!hideTimerRef.current) {
            return
        }

        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
    }

    const hide = () => {
        clearHideTimer()

        setLoader((current) => {
            if (!current) {
                return null
            }

            return {
                ...current,
                phase: "exit"
            }
        })

        hideTimerRef.current =
            setTimeout(() => {
                setLoader(null)
                hideTimerRef.current = null
            }, 420)
    }

    useEffect(() => {
        const handleShow = (
            event: Event
        ) => {
            const detail =
                (event as CustomEvent<TestActionLoaderDetail>).detail

            clearHideTimer()

            setLoader({
                message:
                    detail?.message || "Loading",
                phase: "enter"
            })
        }

        window.addEventListener(
            TEST_ACTION_LOADER_SHOW_EVENT,
            handleShow
        )

        window.addEventListener(
            TEST_ACTION_LOADER_HIDE_EVENT,
            hide
        )

        return () => {
            window.removeEventListener(
                TEST_ACTION_LOADER_SHOW_EVENT,
                handleShow
            )

            window.removeEventListener(
                TEST_ACTION_LOADER_HIDE_EVENT,
                hide
            )

            clearHideTimer()
        }
    }, [])

    if (!loader) {
        return null
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
            <div
                className={`
                    absolute
                    inset-0
                    bg-slate-950/18
                    backdrop-blur-[3px]
                    ${loader.phase === "enter"
                        ? "animate-[testActionBackdropIn_.2s_ease-out_forwards]"
                        : "animate-[testActionBackdropOut_.28s_ease-in_forwards]"
                    }
                `}
            />

            <div
                className={`
                    absolute
                    top-1/2
                    left-1/2
                    flex
                    min-w-[260px]
                    max-w-[calc(100vw-32px)]
                    -translate-y-1/2
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/30
                    bg-[#4A3F77]
                    px-5
                    py-4
                    text-white
                    shadow-[0_24px_70px_rgba(30,24,52,0.32)]
                    ${loader.phase === "enter"
                        ? "animate-[testActionSlideIn_.42s_cubic-bezier(.22,1,.36,1)_forwards]"
                        : "animate-[testActionSlideOut_.42s_cubic-bezier(.7,0,.84,0)_forwards]"
                    }
                `}
                role="status"
                aria-live="polite"
            >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/14">
                    <span className="absolute h-7 w-7 animate-ping rounded-full bg-[#1cd1a1]/40" />
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-[#1cd1a1]" />
                </span>

                <span className="flex min-w-0 flex-col">
                    <span className="text-[15px] font-black leading-tight tracking-normal">
                        {loader.message}
                    </span>
                    <span className="mt-0.5 text-[11px] font-semibold text-white/72">
                        Please wait
                    </span>
                </span>
            </div>

            <style>{`
                @keyframes testActionBackdropIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes testActionBackdropOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                @keyframes testActionSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(72vw, -50%) scale(.96);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                @keyframes testActionSlideOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-130vw, -50%) scale(.96);
                    }
                }
            `}</style>
        </div>
    )
}
