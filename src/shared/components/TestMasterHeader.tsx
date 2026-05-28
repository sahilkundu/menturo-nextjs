'use client'
import { useTestDataStore } from "../store/testDataStore";
import QuestionHistory from "./QuestionHistory";
import TestTimer from "./TestTimer";

export default function TestMasterHeader() {
    const {
        activeLan,
        setActiveLan,
        activeTest
    } = useTestDataStore()

    // current subject
    const activeSubject =
        useTestDataStore(
            (state) => state.activeSubject
        )

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
    return (
        <div suppressHydrationWarning className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div suppressHydrationWarning>
                <h3 className="text-sm font-bold text-slate-800">
                    SSC GD Mock Test 2026 Panel
                </h3>
                <p className="text-[11px] text-slate-400">
                    Online Test Series • Re-attempt Mode
                </p>

            </div>
            <QuestionHistory />
            <div className="hidden md:flex flex-wrap gap-2 text-[11px] font-bold">
                <div className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg">✅ Correct : 10</div>
                <div className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg">❌ Wrong : 03</div>
                <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-lg">🔄 Review : 02</div>
                <div className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg">📌 Not Visited : 05</div>
            </div>
            {/* LANGUAGE SELECTOR */}

            <div className="flex items-center gap-1.5">

                <span className="text-[11px] font-semibold text-slate-500">
                    View in:
                </span>

                <select
                    value={activeLan}
                    onChange={(e) =>
                        setActiveLan(e.target.value)
                    }
                    className="
                        border
                        border-slate-300
                        rounded
                        px-1.5
                        py-0.5
                        text-[11px]
                        font-medium
                        text-slate-700
                        bg-white
                        focus:outline-none
                    "
                >

                    {
                        Object.entries(languageObj).map(
                            ([key, value]) => (

                                <option
                                    key={key}
                                    value={key}
                                >
                                    {String(value)}
                                </option>
                            )
                        )
                    }

                </select>
                <div className="
                 xl:hidden
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
                                      text-[12px]
                                      font-black
                                      text-rose-600
                                      tracking-wide
                                  ">

                        <TestTimer />

                    </div>

                </div>

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
        </div>
    )
}