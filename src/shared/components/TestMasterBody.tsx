'use client'

import { useEffect, useState } from "react"
import { useTestDataStore } from "../store/testDataStore"
import TestMasterButtons from "./TestMasterButtons"

export default function TestMasterBody() {

    const {

        activeTest,
        activeSubject,
        activeLan,
        activeQuestionIndex,
        selectedOptions,
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

        <div className="relative flex flex-col h-full min-h-0 bg-white">

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto ">

                <div className="mt-2">

                    <div className="flex flex-wrap justify-between items-center gap-2">

                        <h2 className="text-base font-black text-slate-800">
                            Question No: {activeQuestionIndex + 1}
                        </h2>

                        <div className="flex flex-wrap gap-3 text-xs">

                            <div className="bg-green-100 text-green-600 px-3 py-2 rounded-xl font-medium">
                                +{question?.qPosMarks} Marks
                            </div>

                            <div className="bg-red-100 text-red-500 px-3 py-2 rounded-xl font-medium">
                                -{question?.qNegMarks} Negative
                            </div>

                            {/* {
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
                            } */}

                        </div>

                    </div>

                    {/* QUESTION */}
                    <div className="mt-1 rounded-xl p-3 shadow-inner border border-slate-100">

                        <div className="text-xs md:text-sm font-semibold leading-relaxed whitespace-pre-wrap">

                            {currentQuestion?.question}

                        </div>

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
                                            w-full flex items-center gap-3 cursor-pointer
                                            rounded-xl px-4 py-3 text-xs md:text-sm
                                            transition-colors
                                            ${isSelected
                                                ? `
                                                        border-2
                                                        border-emerald-500
                                                        bg-emerald-50
                                                        text-emerald-800
                                                        font-bold
                                                    `
                                                : `
                                                        border border-slate-200
                                                        bg-white
                                                        hover:bg-slate-50
                                                    `
                                            }
                                        `}
                                    >

                                        <input
                                            type="radio"
                                            name={qId}
                                            checked={isSelected}
                                            onChange={() =>
                                                setTempSelections(prev => ({
                                                    ...prev,
                                                    [qId]: option.prompt
                                                }))
                                            }
                                        />

                                        <span>
                                            {option.opKey} {option.value}
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
                                    setShowSolution(!showSolution)
                                }
                                className="text-blue-600 font-bold text-xs"
                            >
                                {
                                    showSolution
                                        ? "Hide Detailed Solution"
                                        : "View Detailed Solution"
                                }
                            </button>

                            {
                                showSolution && (
                                    <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 text-xs">

                                        <p className="text-slate-600">

                                            ❌ Your Answer :

                                            <span className="font-bold text-red-600">
                                                {" "}
                                                {savedPrompt}
                                            </span>

                                        </p>

                                        <p className="text-slate-600 mt-2">

                                            ✅ Correct Answer :

                                            <span className="font-bold text-green-600">
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
            <TestMasterButtons
                qId={qId}
                tempSelections={tempSelections}
                setTempSelections={setTempSelections}
            />

        </div>
    )
}