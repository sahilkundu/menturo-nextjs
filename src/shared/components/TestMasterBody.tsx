'use client'

import { useEffect, useState } from "react"
import { useTestDataStore } from "../store/testDataStore"

export default function TestMasterBody() {

    const {

        activeTest,
        activeSubject,
        activeLan,

        activeQuestionIndex,

        selectedOptions,

        selectOption,

        nextQuestion,

        prevQuestion,

        clearResponse,

        markForReview,

        visitQuestion

    } = useTestDataStore()

    // =========================================
    // HISTORY OBJECT
    // =========================================

    const historyObj =
        activeTest?.activeQuestionHistoryObj?.[
        activeSubject
        ]

    // =========================================
    // QUESTION ID
    // =========================================

    const qId =
        historyObj?.qIDs?.[
        activeQuestionIndex
        ]
    useEffect(() => {

        if (qId) {

            visitQuestion(qId)
        }

    }, [qId, visitQuestion])

    // =========================================
    // QUESTION
    // =========================================

    const question =
        activeTest?.questions?.[
        qId
        ]

    // =========================================
    // LANGUAGE QUESTION
    // =========================================

    const currentQuestion =
        question?.[
        activeLan
        ]

    // =========================================
    // SELECTED OPTION
    // =========================================

    const savedPrompt =
        selectedOptions?.[qId]

    const [tempSelections, setTempSelections] =
        useState<Record<string, number>>({})
    // =========================================
    // TEST SUBMITTED
    // =========================================

    const isSubmitted =
        !!activeTest?.solution

    // =========================================
    // ANSWER STATUS
    // =========================================

    const correctAnswer =
        question?.correctAnswer

    const isCorrect =
        String(savedPrompt) ===
        String(correctAnswer)
    // =========================================
    // SOLUTION TOGGLE
    // =========================================

    const [showSolution, setShowSolution] =
        useState(false)

    return (

        <div className="relative flex-1 min-h-0 overflow-hidden">            {/* SCROLLABLE CONTENT */}
            <div className="h-full overflow-y-auto px-1 pb-28">
                <div className="mt-4">

                    <div className="flex flex-wrap justify-between items-center gap-2">

                        <h2 className="text-base font-black text-slate-800">
                            Question No:
                            {activeQuestionIndex + 1}
                        </h2>

                        <div className="flex flex-wrap gap-3 text-xs">

                            <div className="bg-green-100 text-green-600 px-3 py-2 rounded-xl font-medium">
                                +{question?.qPosMarks} Marks
                            </div>

                            <div className="bg-red-100 text-red-500 px-3 py-2 rounded-xl font-medium">
                                -{question?.qNegMarks} Negative
                            </div>

                            <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl font-medium">
                                50% Correct
                            </div>

                            {
                                isSubmitted && (
                                    <div
                                        className={
                                            isCorrect
                                                ? "bg-green-100 text-green-600 px-3 py-2 rounded-xl text-[10px] font-bold"
                                                : "bg-red-100 text-red-600 px-3 py-2 rounded-xl text-[10px] font-bold"
                                        }
                                    >
                                        {
                                            isCorrect
                                                ? "✅ Correct Answer"
                                                : "❌ Wrong Answer"
                                        }
                                    </div>
                                )
                            }

                        </div>

                    </div>

                    <div className="flex justify-between items-center rounded-xl p-3.5 font-mono text-xs md:text-sm font-semibold tracking-wide leading-relaxed whitespace-pre-wrap mt-3 shadow-inner">

                        {
                            currentQuestion?.question
                        }

                    </div>

                </div>

                {/* OPTIONS */}

                <div className="mt-5 space-y-2.5">

                    {
                        currentQuestion?.options?.map(
                            (option: any) => {

                                const isSelected =
                                    (
                                        tempSelections[qId] ??
                                        savedPrompt
                                    ) === option.prompt
                                return (

                                    <label
                                        key={option.prompt}
                                        className={`
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        cursor-pointer
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-xs
                                        md:text-sm
                                        transition-colors

                                        ${isSelected
                                                ? `
                                                border-2
                                                border-emerald-500
                                                bg-emerald-50/70
                                                text-emerald-800
                                                font-bold
                                                shadow-sm
                                            `
                                                : `
                                                border
                                                border-slate-200
                                                text-slate-700
                                                bg-white
                                                hover:bg-slate-50
                                            `
                                            }
                                    `}
                                    >

                                        <input
                                            type="radio"
                                            name={qId}
                                            checked={
                                                isSelected
                                            }
                                            onChange={() =>
                                                setTempSelections(prev => ({

                                                    ...prev,

                                                    [qId]: option.prompt
                                                }))
                                            }
                                        />

                                        <span>
                                            {option.opKey}{" "}
                                            {option.value}
                                        </span>

                                    </label>
                                )
                            }
                        )
                    }

                </div>

                {/* SOLUTION */}

                {
                    isSubmitted && (
                        <div className="mt-5 border-t border-slate-200 pt-4">

                            <button
                                onClick={() =>
                                    setShowSolution(
                                        !showSolution
                                    )
                                }
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs tracking-wide transition-all duration-200 group"
                            >

                                <span className="bg-blue-50 p-1.5 rounded-lg group-hover:bg-blue-100 transition-colors">

                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />

                                    </svg>

                                </span>

                                <span>
                                    {
                                        showSolution
                                            ? "Hide Detailed Solution"
                                            : "View Detailed Solution"
                                    }
                                </span>

                            </button>

                            {
                                showSolution && (
                                    <div className="mt-3 bg-white rounded-xl border border-slate-200 p-3.5 text-xs animate-fade-in">

                                        <p className="text-slate-600">

                                            ❌ Your Answer :

                                            <span className="font-bold text-rose-600">

                                                {" "}
                                                {savedPrompt}

                                            </span>

                                        </p>

                                        <p className="text-slate-600 mt-1.5">

                                            ✅ Correct Answer :

                                            <span className="font-bold text-emerald-600">

                                                {" "}
                                                {correctAnswer}

                                            </span>

                                        </p>

                                    </div>
                                )
                            }

                        </div>
                    )
                }

            </div>

            {/* FIXED FOOTER */}

            <div className="
absolute
bottom-0
left-0
right-0
border-t
border-slate-200
bg-white
p-3
z-20
">

                <div className="flex flex-wrap gap-2 w-full xl:w-11/12 text-[11px] font-bold">

                    <button
                        onClick={() => {

                            const tempAnswer =
                                tempSelections[qId]

                            if (tempAnswer !== undefined) {

                                selectOption(
                                    qId,
                                    tempAnswer
                                )
                            }

                            markForReview(qId)

                        }}
                        className="bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Mark for Review & Next
                    </button>

                    <button
                        onClick={() => {

                            setTempSelections(prev => {

                                const updated = {
                                    ...prev
                                }

                                delete updated[qId]

                                return updated
                            })

                            clearResponse(qId)

                        }}
                        className="bg-white border border-red-200 text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
                    >
                        Clear Response
                    </button>

                    <button
                        onClick={prevQuestion}
                        className="bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all ml-auto"
                    >
                        ◀ Previous
                    </button>

                    <button
                        onClick={() => {

                            const tempAnswer =
                                tempSelections[qId]

                            if (tempAnswer !== undefined) {

                                selectOption(
                                    qId,
                                    tempAnswer
                                )
                            }

                            useTestDataStore
                                .getState()
                                .saveAndNext(qId)

                        }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2 rounded-xl shadow-sm hover:opacity-95 transition-all"
                    >
                        Save & Next ✓
                    </button>

                </div>

            </div>

        </div>
    )


}