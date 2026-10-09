'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import TestMasterHeader from '../../../shared/components/TestMasterHeader';
import TestMasterBody from '../../../shared/components/TestMasterBody';
import TestMasterUserInfo from '../../../shared/components/TestMasterUserInfo';
import TestMasterReviewInfo from '../../../shared/components/TestMasterReviewInfo';
import TestMasterQuestionChooser from '../../../shared/components/TestMasterQuestionChooser';
import TestActionLoader from '../../../shared/components/TestActionLoader';
import { TestTimerController } from '../../../shared/components/TestTimer';
import { useTestDataStore } from '../../../shared/store/testDataStore';
// Mock Test Data for dynamic rendering
import { SAVE_TEST } from '../../../../api';
import { useRouter, useSearchParams } from 'next/navigation'
import { LIVE_TEST_SAVE } from '../../../../api'
import LiveTestResultModal from '../../../shared/components/LiveTestResultModal'

function MockTestContent() {
    const activeTest =
        useTestDataStore((state) => state.activeTest)
    const activeSubject =
        useTestDataStore((state) => state.activeSubject)
    const setActiveSubject =
        useTestDataStore((state) => state.setActiveSubject)
    const router = useRouter()
    const searchParams = useSearchParams()
    const liveTestId = searchParams.get('liveTestId') || ''
    const liveHistoryId = searchParams.get('historyId') || ''
    const viewLiveResult = searchParams.get('viewResult') === '1'
    const fetchLiveStart = useTestDataStore((state) => state.fetchLiveStart)
    const fetchLiveResult = useTestDataStore((state) => state.fetchLiveResult)
    const refreshLiveResult = useTestDataStore((state) => state.refreshLiveResult)
    const loadingStartTest = useTestDataStore((state) => state.loadingStartTest)
    const liveMode = useTestDataStore((state) => state.liveMode)
    const liveResult = useTestDataStore((state) => state.liveResult)
    const isSubmitted = useTestDataStore((state) => state.isSubmitted)
    const clearActiveTest = useTestDataStore((state) => state.clearActiveTest)
    const markLiveResultViewed = useTestDataStore((state) => state.markLiveResultViewed)
    const [showLiveResult, setShowLiveResult] = useState(false)

    useEffect(() => {
        if (viewLiveResult) {
            setShowLiveResult(false)
            markLiveResultViewed()
            return
        }
        if (liveMode && isSubmitted && liveResult) setShowLiveResult(true)
    }, [isSubmitted, liveMode, liveResult, markLiveResultViewed, viewLiveResult])

    const openLiveSolution = () => {
        const historyId = activeTest?.history?._id || ''
        if (!viewLiveResult && liveTestId && historyId) {
            markLiveResultViewed()
            router.push(
                `/test?liveTestId=${encodeURIComponent(liveTestId)}&historyId=${encodeURIComponent(historyId)}&viewResult=1`
            )
            return
        }
        setShowLiveResult(false)
    }

    useEffect(() => {
        if (!liveTestId) return
        const state = useTestDataStore.getState()
        const sameLiveHistory = !liveHistoryId || state.activeTest?.history?._id === liveHistoryId
        const alreadyViewingResult = !viewLiveResult || state.isSubmitted
        if (state.activeTest?.liveTestId === liveTestId && state.liveMode && sameLiveHistory && alreadyViewingResult) return
        void fetchLiveStart({
            liveTestId,
            historyId: liveHistoryId || undefined,
            viewResult: viewLiveResult
        })
    }, [fetchLiveStart, liveHistoryId, liveTestId, viewLiveResult])

    useEffect(() => {
        if (
            !liveMode ||
            !isSubmitted ||
            !['submitted', 'queued', 'processing'].includes(String(liveResult?.status || ''))
        ) return

        const historyId = activeTest?.history?._id || liveResult?.history?._id
        if (!historyId) return

        let cancelled = false
        const checkDeclaration = async () => {
            if (cancelled) return
            // The backend worker owns expiry, queueing, and declaration. The
            // browser only observes the authoritative history status here.
            await refreshLiveResult({ historyId })
        }

        void checkDeclaration()
        const timer = window.setInterval(() => { void checkDeclaration() }, 2000)
        return () => {
            cancelled = true
            window.clearInterval(timer)
        }
    }, [activeTest?.history?._id, isSubmitted, liveMode, liveResult?.status, liveResult?.history?._id, refreshLiveResult])

    useEffect(() => {
        // Automatic completion belongs on the home screen with the result
        // modal. A solution is opened only after the user explicitly clicks
        // View Solution. Result/activity routes stay on /test.
        if (
            viewLiveResult ||
            !liveMode ||
            !isSubmitted ||
            liveResult?.status !== 'completed' ||
            !activeTest?.history?._id
        ) {
            return
        }

        router.replace('/')
    }, [activeTest?.history?._id, isSubmitted, liveMode, liveResult?.status, router, viewLiveResult])

    useEffect(() => {
        if (!liveTestId && (!activeTest || Object.keys(activeTest).length === 0)) {
            const timer = setTimeout(() => {
                router.back()
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [])

    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const [chooserButtonPosition, setChooserButtonPosition] =
        useState<{ x: number; y: number } | null>(null)
    const chooserDragRef =
        useRef({
            dragging: false,
            moved: false,
            offsetX: 0,
            offsetY: 0
        })
    const handleSidebarOpen = () => {
        setIsSideBarOpen(true)
    }
    const clampChooserPosition = (
        x: number,
        y: number
    ) => {
        const buttonSize = 64
        const padding = 8

        return {
            x: Math.min(
                Math.max(padding, x),
                window.innerWidth - buttonSize - padding
            ),
            y: Math.min(
                Math.max(padding, y),
                window.innerHeight - buttonSize - padding
            )
        }
    }
    const handleChooserPointerDown = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        const rect =
            event.currentTarget.getBoundingClientRect()

        chooserDragRef.current = {
            dragging: true,
            moved: false,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        }

        event.currentTarget.setPointerCapture(event.pointerId)
    }
    const handleChooserPointerMove = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!chooserDragRef.current.dragging) {
            return
        }

        chooserDragRef.current.moved = true

        setChooserButtonPosition(
            clampChooserPosition(
                event.clientX - chooserDragRef.current.offsetX,
                event.clientY - chooserDragRef.current.offsetY
            )
        )
    }
    const handleChooserPointerUp = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        chooserDragRef.current.dragging = false

        try {
            event.currentTarget.releasePointerCapture(event.pointerId)
        } catch {
        }
    }
    // In any component using useTestDataStore

    // console.log('Active question type:', activeQType2)
    // console.log(activeTest?.questions)
    // console.log(activeTest?.activeQuestionHistoryObj?.[activeSubject])
    // const pathname = usePathname()

    // useEffect(() => {

    //     if (
    //         !pathname.includes("/test")
    //     ) {

    //         clearActiveTest()
    //     }

    // }, [pathname, clearActiveTest])

    // save test before leave with browser 
    const saveTestBeforeLeave = async () => {
        const store =
            useTestDataStore.getState()
        if (!store.activeTest || Object.keys(store.activeTest).length === 0) {
            return
        }

        const history =
            store.activeTest
                ?.activeQuestionHistoryObj

        const runningHistory = store.activeTest?.history


        if (!runningHistory?._id) {

            return
        }
        try {
            if (store.liveMode) {
                await fetch(LIVE_TEST_SAVE, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        historyId: runningHistory._id,
                        answers: {
                            ...(history?.[store.activeSubject]?.answered || {}),
                            ...(history?.[store.activeSubject]?.answeredAndMarkedForReview || {}),
                            ...store.selectedOptions
                        },
                        activeIndex: store.activeQuestionIndex
                    }),
                    keepalive: true
                })
                useTestDataStore.getState().clearActiveTest()
                return
            }
            // Use fetch with keepalive to ensure it completes
            await fetch(SAVE_TEST, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    historyId:
                        runningHistory._id,
                    time: store.timeLeft,

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
                }),
                keepalive: true // Ensures request completes even after page unload
            })
        } catch (error) {
            console.error('Failed to save test:', error)
        }


        useTestDataStore.getState().clearActiveTest()
    }
    useEffect(() => {
        const handlePageHide = () => {
            saveTestBeforeLeave()
        }

        window.addEventListener('pagehide', handlePageHide)

        return () => {
            window.removeEventListener(
                'pagehide',
                handlePageHide
            )
        }
    }, [])

    const liveResultPending =
        liveMode &&
        isSubmitted &&
        ['submitted', 'queued', 'processing'].includes(String(liveResult?.status || ''))

    if (liveResultPending) {
        return (
            <LiveTestResultModal
                result={liveResult}
                onViewSolution={openLiveSolution}
                onClose={() => {
                    clearActiveTest()
                    router.push('/')
                }}
            />
        )
    }

    // Empty dependency array - only cleanup on unmount
    if (!activeTest || Object.keys(activeTest).length === 0) {
        if (liveTestId && (loadingStartTest || liveMode)) {
            return (
                <main className="grid min-h-[100dvh] place-items-center bg-slate-50 p-6">
                    <div className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="font-black text-slate-800">Opening live quiz…</p>
                        <p className="mt-2 text-sm text-slate-500">Please wait while the test is prepared.</p>
                    </div>
                </main>
            )
        }
        return null
    }
    return (
        <>
            <TestActionLoader />
            <TestTimerController />

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
                    <div className="  px-4 py-3.5 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50/50">
                        <TestMasterHeader isQuestionChooserOpen={isSideBarOpen} />
                    </div>



                    <div className="flex flex-col xl:flex-row flex-1 mt-2 min-h-0">
                        <div className="flex-1 p-1  border-r border-slate-200 overflow-hidden flex flex-col min-h-0">
                            <div className="flex mt-1 flex-nowrap overflow-x-auto whitespace-nowrap scroll-hide gap-1.5 pb-2 -mx-1 px-1">

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
mt-1
bg-gradient-to-b
from-white
to-slate-50/40
border
border-slate-200
rounded-[20px]
p-2
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

                      <div className="flex ">

    

    <div className="hidden xl:flex w-[350px] shrink-0 bg-white border-l border-slate-200 p-2 flex-col overflow-y-auto">

        <TestMasterUserInfo />

        <TestMasterReviewInfo />

        <TestMasterQuestionChooser />

    </div>

</div>

                    </div>
                </div>
            </div>
            {!isSideBarOpen &&
                <div
                    id="statusIconBtn"
                    className="z-[9999] fixed flex flex-col items-center gap-1 xl:hidden select-none outline-none group cursor-grab active:cursor-grabbing"
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                        perspective: '1000px',
                        touchAction: 'none',
                        ...(chooserButtonPosition
                            ? {
                                left: chooserButtonPosition.x,
                                top: chooserButtonPosition.y
                            }
                            : {
                                right: 20,
                                bottom: 144
                            })
                    }}
                    onPointerDown={handleChooserPointerDown}
                    onPointerMove={handleChooserPointerMove}
                    onPointerUp={handleChooserPointerUp}
                    onClick={() => {
                        if (chooserDragRef.current.moved) {
                            chooserDragRef.current.moved = false
                            return
                        }

                        handleSidebarOpen()
                    }}
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
h-[100dvh]
bg-white
z-[1000]
shadow-[-10px_0_40px_rgba(0,0,0,.22)]
xl:hidden
flex
flex-col
overflow-hidden"
            >
                <div className="flex h-full min-h-0 flex-col overflow-hidden p-2">
                    <TestMasterUserInfo onClose={() => setIsSideBarOpen(false)} />
                    <TestMasterReviewInfo />
                    <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <TestMasterQuestionChooser onAction={() => setIsSideBarOpen(false)} />
                    </div>
                </div>



            </div>

            {liveMode && isSubmitted && liveResult && showLiveResult && (
                <LiveTestResultModal
                    result={liveResult}
                    onViewSolution={openLiveSolution}
                />
            )}

        </>
    )
}

export default function MockTestPage() {
    return (
        <Suspense fallback={<main className="grid min-h-[100dvh] place-items-center bg-slate-50 p-6">Loading test…</main>}>
            <MockTestContent />
        </Suspense>
    )
}
