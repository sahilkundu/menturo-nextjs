'use client';

import React, { useState, useEffect, useRef } from 'react';
import TestMasterHeader from '../../../shared/components/TestMasterHeader';
import TestMasterBody from '../../../shared/components/TestMasterBody';
import TestMasterUserInfo from '../../../shared/components/TestMasterUserInfo';
import TestMasterReviewInfo from '../../../shared/components/TestMasterReviewInfo';
import TestMasterQuestionChooser from '../../../shared/components/TestMasterQuestionChooser';
import { useTestDataStore } from '../../../shared/store/testDataStore';
// Mock Test Data for dynamic rendering
import { usePathname } from "next/navigation"
import { useTestSeriesStore } from '../../../shared/store/testSeriesStore';
import { SAVE_TEST } from '../../../../api';

export default function MockTestPage() {
    const {
        activeTest,
        activeSubject,
        setActiveSubject,
        clearActiveTest,
        fetchSave,
        timeLeft,
        activeLan,
        activeQuestionIndex,
    } = useTestDataStore()

    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const handleSidebarOpen = () => {
        setIsSideBarOpen(true)
    }

    const pathname = usePathname()

    useEffect(() => {

        if (
            !pathname.includes("/test")
        ) {

            clearActiveTest()
        }

    }, [pathname, clearActiveTest])

    // save test before leave with browser 
    const saveTestBeforeLeave = async () => {

        const store =
            useTestDataStore.getState()

        const history =
            store.activeTest
                ?.activeQuestionHistoryObj

        const testsMap =
            useTestSeriesStore
                .getState()
                .testsMap

        let historyId = ""

        Object.values(testsMap).forEach(
            (tests: any) => {

                tests.forEach((test: any) => {

                    const runningHistory =
                        test?.history?.find(
                            (h: any) =>
                                h.status === "running"
                        )

                    if (runningHistory) {

                        historyId =
                            runningHistory._id
                    }
                })
            }
        )

        if (!historyId || !history) {
            return
        }

        await store.fetchSave({

            historyId,

            data: {

                [store.activeSubject]: {

                    ...history[
                    store.activeSubject
                    ],

                    activeIndex:
                        store.activeQuestionIndex,

                    language:
                        store.activeLan,

                    timeLeft:
                        store.timeLeft
                }
            },

            e: 1
        })
        useTestDataStore.getState().clearActiveTest()
    }
    const getLeavePayload = () => {

        const store =
            useTestDataStore.getState()

        const history =
            store.activeTest
                ?.activeQuestionHistoryObj

        const testsMap =
            useTestSeriesStore
                .getState()
                .testsMap

        let historyId = ""

        Object.values(testsMap).forEach(
            (tests: any) => {

                tests.forEach((test: any) => {

                    const runningHistory =
                        test?.history?.find(
                            (h: any) =>
                                h.status === "running"
                        )

                    if (runningHistory) {

                        historyId =
                            runningHistory._id
                    }
                })
            }
        )

        if (!historyId || !history) {
            return null
        }

        return {

            historyId,

            data: {

                [store.activeSubject]: {

                    ...history[
                    store.activeSubject
                    ],

                    activeIndex:
                        store.activeQuestionIndex,

                    language:
                        store.activeLan,

                    timeLeft:
                        store.timeLeft
                }
            },

            e: 1
        }
    }
    useEffect(() => {

        const handleBeforeUnload = () => {

            const payload =
                getLeavePayload()

            if (!payload) {
                return
            }

            navigator.sendBeacon(
                SAVE_TEST,
                JSON.stringify(payload)
            )
        }

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        )

        return () => {

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            )
        }

    }, [])
    useEffect(() => {

        const handleVisibilityChange = () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                const payload =
                    getLeavePayload()

                if (!payload) {
                    return
                }

                navigator.sendBeacon(
                    SAVE_TEST,
                    JSON.stringify(payload)
                )
            }
        }

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        )

        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
        }

    }, [])
    useEffect(() => {

        const handlePopState = () => {

            saveTestBeforeLeave()
        }

        window.addEventListener(
            "popstate",
            handlePopState
        )

        return () => {

            window.removeEventListener(
                "popstate",
                handlePopState
            )
        }

    }, [])
    return (
        <>
            <div className="w-full h-[100dvh]  p-2 md:p-3 overflow-hidden flex flex-col">

                <div className="
bg-white
rounded-[24px]
border
border-slate-200
overflow-hidden
shadow-sm
flex-1
min-h-0
flex
flex-col
">
                    <div className=" px-4 py-3.5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50/50">
                        <TestMasterHeader />
                    </div>

                    {/* <div className="md:hidden overflow-x-auto whitespace-nowrap scroll-hide px-3 py-2 border-b border-slate-200 bg-white">
                        <div className="flex gap-2 w-max text-[10px] font-bold">
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Correct : 10
                            </div>
                            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-lg border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Wrong : 03
                            </div>
                            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg border border-yellow-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>Review : 02
                            </div>
                        </div>
                    </div> */}

                    <div className="flex flex-col xl:flex-row flex-1 min-h-0">
                        <div className="flex-1 p-4 border-r border-slate-200 overflow-hidden flex flex-col min-h-0">
                            <div className="flex flex-nowrap overflow-x-auto whitespace-nowrap scroll-hide gap-1.5 pb-2 -mx-1 px-1">

                                {activeTest?.allSubj?.map(
                                    (subject: string) => {

                                        const isActive =
                                            activeSubject === subject

                                        return (

                                            <button
                                                key={subject}
                                                disabled={isActive}
                                                onClick={() =>
                                                    setActiveSubject(
                                                        subject
                                                    )
                                                }
                                                className={`
                        px-4
                        py-1.5
                        rounded-xl
                        text-[11px]
                        shrink-0
                        transition-all
                        duration-150
                        border

                        ${isActive
                                                        ? `
                                    bg-[#4A3F77]
                                    text-white
                                    font-bold
                                    border-[#4A3F77]
                                    shadow-sm
                                    shadow-blue-500/10
                                    cursor-default
                                `
                                                        : `
                                    bg-slate-50
                                    text-slate-500
                                    font-semibold
                                    border-slate-200
                                    hover:bg-slate-100
                                    hover:text-slate-900
                                    cursor-pointer
                                `
                                                    }
                    `}
                                            >
                                                {subject}
                                            </button>
                                        )
                                    }
                                )}

                            </div>

                            <div className="
mt-4
bg-gradient-to-b
from-white
to-slate-50/40
border
border-slate-200
rounded-[20px]
p-4
flex-1
min-h-0
overflow-hidden
">

                                <TestMasterBody />
                                <div className="mt-6 border-t border-slate-200 pt-5">

                                    {/* <!-- 1. The Interactive Button --> */}


                                    {/* <!-- 2. The Solution Box (Initially Hidden) --> */}
                                    <div id="solutionBox" className="hidden mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                                            {/* <!-- Quick Result Header --> */}


                                            <div className="p-4 space-y-3">
                                                {/* <!-- Answer Comparison --> */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl border border-rose-100/50">
                                                        <span className="text-xs font-bold text-slate-600 italic">Your Choice:</span>
                                                        <span className="text-xs font-black text-rose-600  tracking-tighter">Option B (Wrong)</span>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                                        <span className="text-xs font-bold text-slate-600 italic">Correct Answer:</span>
                                                        <span className="text-xs font-black text-emerald-600  tracking-tighter">Option A (Correct)</span>
                                                    </div>
                                                </div>

                                                {/* <!-- Step-by-Step Explanation --> */}
                                                <div className="mt-4 p-1">
                                                    <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-2 mb-2">
                                                        <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
                                                        DETAILED LOGIC:
                                                    </h4>
                                                    <div className="text-slate-600 text-[11px] leading-relaxed space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                                        <p>1. <code className="bg-slate-200 px-1 rounded text-slate-800">Response.Redirect</code> sends a redirection signal to the ASP engine.</p>
                                                        <p>2. However, by default, ASP **does not stop** script execution unless <code className="bg-slate-200 px-1 rounded text-slate-800">Response.End</code> is explicitly called.</p>
                                                        <p>3. Consequently, the execution flow continues, processing "first page" + "second page" + "third page" and sending all of them to the output stream.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <!-- Footer Tip --> */}
                                            <div className="bg-indigo-50/50 px-4 py-2.5 border-t border-indigo-100/50 flex items-center gap-2">
                                                <span className="text-xs">💡</span>
                                                <p className="text-[10px] text-indigo-700 font-bold italic">Pro Tip: Use Response.End() immediately after redirect to stop further execution.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden xl:flex w-[350px] bg-white border-l border-slate-200 p-4 flex-col">

                            <TestMasterUserInfo />

                            <TestMasterReviewInfo />

                            <TestMasterQuestionChooser />
                        </div>

                    </div>
                </div>
            </div>
            {!isSideBarOpen &&
                <div
                    id="statusIconBtn"
                    className="z-[9999] fixed bottom-5 right-5 flex flex-col items-center gap-1 xl:hidden select-none outline-none group cursor-pointer"
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                        perspective: '1000px',
                    }}
                    onClick={handleSidebarOpen}
                >

                    <div className="relative w-12 h-12 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

                        <div className="absolute w-[3.4rem] h-[3.4rem] rounded-full border border-cyan-400/40 tight-ring-1 pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                        </div>

                        <div className="absolute w-[3.8rem] h-[3.8rem] rounded-full border border-purple-500/30 tight-ring-2 pointer-events-none">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399]"></div>
                        </div>
                        <div className="absolute inset-1 rounded-full border border-cyan-400/40 bg-gradient-to-br from-indigo-950/95 via-purple-900/85 to-slate-950/95 shadow-[inset_0_0_10px_rgba(34,211,238,0.6)] backdrop-blur-sm overflow-hidden z-10">
                            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 opacity-50 blur-[1px] animate-pulse"></div>
                        </div>

                        <span className="relative z-20 text-sm drop-shadow-[0_2px_5px_rgba(255,255,255,0.7)]">📊</span>
                    </div>


                </div >
            }

            <div
                id="sliderOverlay"
                onClick={() => setIsSideBarOpen(false)}
                style={{
                    opacity: isSideBarOpen ? 0 : 0,
                    visibility: isSideBarOpen ? 'visible' : 'hidden',
                    backdropFilter: isSideBarOpen ? 'blur(2px)' : 'blur(0px)',
                    transition:
                        'opacity 0.45s ease, backdrop-filter 0.45s ease, visibility 0.45s',
                }}
                className="fixed inset-0 z-[999] bg-gradient-to-br from-slate-950/40 via-black/30 to-indigo-950/40"
            >
                <div
                    id="sliderBackdrop"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,.15),transparent_35%)]"
                />
            </div>

            <div
                id="statusSlider"
                style={{
                    transform: isSideBarOpen
                        ? 'translateX(0)'
                        : 'translateX(100%)',
                    transition: 'transform 0.45s cubic-bezier(.2,.9,.4,1)',
                }}
                className="fixed
top-0
right-0
w-[88%]
max-w-[330px]
h-screen
bg-white
z-[1000]
overflow-y-auto
shadow-[-10px_0_40px_rgba(0,0,0,.22)]
xl:hidden
flex
flex-col
justify-between
overflow-hidden"
            >
                <div className="p-4 overflow-y-auto grow palette-scroll space-y-4">

                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                            <h2 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <span>📊</span> Question Palette
                            </h2>

                        </div>
                        <button
                            id="closeSliderBtn"
                            onClick={() => setIsSideBarOpen(false)}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors shadow-2xs"
                        >
                            ✕
                        </button>
                    </div>
                    <TestMasterUserInfo />
                    <TestMasterReviewInfo />
                    <TestMasterQuestionChooser />
                </div>



            </div>

        </>
    )
}