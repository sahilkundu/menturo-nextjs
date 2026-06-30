'use client'
import { useTestDataStore } from "../store/testDataStore";
import { useTestSeriesStore } from "../store/testSeriesStore";
import { useRouter } from "next/navigation"
import QuestionHistory from "./QuestionHistory";
import TestTimer from "./TestTimer";
import Spinner from "./Spinner";
import {
    hideTestActionLoader,
    showTestActionLoader,
} from "../utils/testActionLoader";

export default function TestMasterHeader({
    isQuestionChooserOpen = false,
}: {
    isQuestionChooserOpen?: boolean
}) {
    const router = useRouter()
    const activeLan =
        useTestDataStore((state) => state.activeLan)
    const setActiveLan =
        useTestDataStore((state) => state.setActiveLan)
    const fetchSave =
        useTestDataStore((state) => state.fetchSave)
    const fetchResult =
        useTestDataStore((state) => state.fetchResult)
    const isSubmitted =
        useTestDataStore((state) => state.isSubmitted)
    const activeSubject =
        useTestDataStore((state) => state.activeSubject)
    const activeTest =
        useTestDataStore((state) => state.activeTest)
    const loadingSave =
        useTestDataStore((state) => state.loadingSave)
    const loadingResult =
        useTestDataStore((state) => state.loadingResult)

    // history object
    const historyObj =
        activeTest?.activeQuestionHistoryObj?.[
        activeSubject
        ]

    // available languages
    // { en: "English", hn: "Hindi" }

    const firstQId =
        historyObj?.qIDs?.["0"]

    const languageObj =
        activeTest?.questions?.[
            firstQId
        ]?.multiLanguage || {}
    const solution =
        activeTest?.solution || {}

    const stats =
        Object.values(solution).reduce(
            (acc: any, item: any) => {

                if (item?.selected !== null) {

                    if (Number(item?.ob || 0) > 0) {

                        acc.correct += 1
                    }

                    else {

                        acc.wrong += 1
                    }
                }

                return acc
            },
            {
                correct: 0,
                wrong: 0
            }
        )

    const totalQuestions =
        Object.keys(solution).length

    const notVisited =
        totalQuestions -
        stats.correct -
        stats.wrong

    const controlsClass = isSubmitted
        ? "flex min-h-10 w-full flex-nowrap items-center justify-between gap-3 overflow-x-auto"
        : "flex min-h-10 w-full flex-col gap-2 min-[432px]:flex-row min-[432px]:flex-nowrap min-[432px]:items-center min-[432px]:justify-between min-[432px]:overflow-x-auto min-[792px]:w-auto min-[792px]:shrink-0 min-[792px]:justify-end"

    const languageTimerClass = isSubmitted
        ? "flex min-w-0 items-center gap-2"
        : "flex w-full min-w-0 items-center justify-between gap-2 min-[432px]:w-auto min-[432px]:justify-start"

    const actionClass = isSubmitted
        ? "flex w-auto items-center justify-end gap-1.5 xl:hidden"
        : "flex w-full shrink-0 items-center justify-between gap-1.5 xl:hidden min-[432px]:w-auto min-[432px]:justify-end"

    const submittedStats = (
        <div className="hidden shrink-0 flex-nowrap items-center justify-start gap-2 text-[11px] font-bold min-[653px]:flex">

            <div className="
        bg-green-50
        text-green-700
        border
        border-green-200
        px-2.5
        py-1
        rounded-lg
    ">
                ✅ Correct : {stats?.correct}
            </div>

            <div className="
        bg-red-50
        text-red-600
        border
        border-red-200
        px-2.5
        py-1
        rounded-lg
    ">
                ❌ Wrong : {stats?.wrong}
            </div>

            <div className="
        bg-slate-100
        text-slate-700
        border
        border-slate-200
        px-2.5
        py-1
        rounded-lg
    ">
                📌 Not Answered : {notVisited}
            </div>

        </div>
    )

    return (
        <div suppressHydrationWarning className={isSubmitted ? "flex flex-col gap-3" : "flex w-full flex-col gap-3 min-[792px]:flex-row min-[792px]:items-center min-[792px]:justify-between min-[792px]:overflow-x-auto"}>
            {/* <div suppressHydrationWarning>
                <h3 className="text-sm font-bold text-slate-800">
                    SSC GD Mock Test 2026 Panel
                </h3>
                <p className="text-[11px] text-slate-400">
                    Online Test Series • Re-attempt Mode
                </p>

            </div> */}
            <div className={isSubmitted ? "min-w-0" : "min-w-0 flex-1"}>
                <QuestionHistory />
            </div>
            {/* LANGUAGE SELECTOR */}

            <div className={controlsClass}>
                {isSubmitted ? (
                    <>
                        {submittedStats}

                        <div className="flex shrink-0 items-center gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="whitespace-nowrap text-[11px] font-semibold text-slate-500">
                                    View in:
                                </span>

                                <select
                                    value={activeLan}
                                    onChange={(e) => setActiveLan(e.target.value)}
                                    className="max-w-[120px] rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700 focus:outline-none"
                                >
                                    {Object.entries(languageObj).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {String(value)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!isQuestionChooserOpen && (
                                <div className="shrink-0 rounded-xl border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-center xl:hidden">
                                    <div className="text-[12px] font-black text-rose-600 tracking-wide">
                                        <TestTimer />
                                    </div>
                                </div>
                            )}

                            <div className={actionClass}>
                                <button
                                    disabled={loadingResult || loadingSave}
                                    onClick={() => {
                                        router.back()
                                    }}
                                    className="cursor-pointer flex items-center gap-1 bg-white border border-slate-300 text-slate-500 px-2 py-1 rounded-lg hover:bg-slate-50 text-[10px] font-bold transition-colors"
                                >
                                    <svg
                                        className="w-3 h-3 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                        />
                                    </svg>
                                    Exit
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* LEFT SIDE */}
                        <div className={languageTimerClass}>
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="whitespace-nowrap text-[11px] font-semibold text-slate-500">
                                    View in:
                                </span>

                                <select
                                    value={activeLan}
                                    onChange={(e) => setActiveLan(e.target.value)}
                                    className="max-w-[120px] rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700 focus:outline-none"
                                >
                                    {Object.entries(languageObj).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {String(value)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!isQuestionChooserOpen && (
                                <div className="shrink-0 rounded-xl border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-center xl:hidden">
                                    <div className="text-[12px] font-black text-rose-600 tracking-wide">
                                        <TestTimer />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className={actionClass}>
                            <button
                                disabled={loadingResult || loadingSave}
                                onClick={async () => {

                                    const store =
                                        useTestDataStore.getState()

                                    if (
                                        store.loadingSave ||
                                        store.loadingResult
                                    ) {
                                        return
                                    }

                                    const history =
                                        store.activeTest?.activeQuestionHistoryObj

                                    const runningHistory =
                                        store.activeTest?.history

                                    if (!runningHistory?._id) {
                                        return
                                    }

                                    showTestActionLoader("Exiting Test")

                                    try {
                                        await fetchSave({

                                            historyId:
                                                runningHistory._id,

                                            time: store.timeLeft,

                                            data: {

                                                [activeSubject]: {

                                                    ...history?.[activeSubject],

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
                                    } finally {
                                        hideTestActionLoader()
                                    }

                                    setTimeout(() => {
                                        router.back()
                                    }, 220)
                                }}
                                className="cursor-pointer flex items-center gap-1 bg-white border border-slate-300 text-slate-500 px-2 py-1 rounded-lg hover:bg-slate-50 text-[10px] font-bold transition-colors"
                            >
                                {!loadingSave &&
                                    <svg
                                        className="w-3 h-3 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                        />
                                    </svg>
                                }
                                {loadingSave ? (
                                    <Spinner size={16} />
                                ) : (
                                    "Exit & Resume"
                                )}
                            </button>

                            <button
                                disabled={loadingResult || loadingSave}
                                onClick={async () => {

                                    const store =
                                        useTestDataStore.getState()

                                    if (
                                        store.loadingResult ||
                                        store.loadingSave
                                    ) {
                                        return
                                    }

                                    const history =
                                        store.activeTest
                                            ?.activeQuestionHistoryObj
                                    const activeHistory =
                                        store.activeTest?.history

                                    if (!activeHistory) {
                                        return
                                    }

                                    const payload = {
                                        time: store.timeLeft,

                                        historyId:
                                            activeHistory._id,

                                        relationId:
                                            activeHistory.relationId,

                                        testId:
                                            activeHistory.testId,

                                        ts:
                                            activeHistory.ts,

                                        data: {
                                            [activeSubject]: {

                                                ...history[activeSubject],

                                                activeIndex:
                                                    store.activeQuestionIndex,

                                                language:
                                                    store.activeLan,

                                                timeLeft:
                                                    store.timeLeft
                                            }
                                        }
                                    }

                                    showTestActionLoader("Loading Solution")

                                    try {
                                        await fetchResult(payload)
                                    } finally {
                                        hideTestActionLoader()
                                    }
                                }}
                                className="cursor-pointer flex items-center gap-1 bg-white border border-blue-200 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-50 text-[10px] font-bold shadow-sm transition-colors"
                            >
                                {!loadingResult &&
                                    <svg
                                        className="w-3 h-3 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                }
                                {loadingResult ? (
                                    <Spinner size={16} />
                                ) : (
                                    "Submit"
                                )}

                            </button>
                        </div>
                    </>
                )}

            </div>

        </div>
    )
}
