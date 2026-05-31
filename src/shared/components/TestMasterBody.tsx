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


    // =========================================
    // TEST SUBMITTED
    // =========================================

    const isSubmitted =
        useTestDataStore(
            (state) => state.isSubmitted
        )
    // =========================================
    // ANSWER STATUS
    // =========================================

    const solution =
        activeTest?.solution?.[qId]

    const correctAnswer =
        solution?.answer

    const obtainedMarks =
        Number(solution?.ob || 0)

    const selectedAnswer =
        solution?.selected

    const isCorrect =
        obtainedMarks > 0

    // =========================================
    // SOLUTION TOGGLE
    // =========================================

    const [showSolution, setShowSolution] =
        useState(false)
    useEffect(() => {

        if (
            qId &&
            !isSubmitted
        ) {

            visitQuestion(qId)
        }

    }, [
        qId,
        isSubmitted,
        visitQuestion
    ])
    return (

        <div className="relative mt-0 flex flex-col h-full min-h-0 bg-white">

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto ">

                <div className="mt-0">

                    <div className="flex flex-wrap justify-between items-center gap-2">

                        <div className="flex items-center gap-2">

                            <h2 className="text-base font-black text-slate-800">
                                Question No: {activeQuestionIndex + 1}
                            </h2>

                            {
                                isSubmitted && (
                                    <div
                                        className={`
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-black
                    text-white
                    ${isCorrect
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            }
                `}
                                    >
                                        {
                                            isCorrect
                                                ? `+${question?.qPosMarks}`
                                                : `-${question?.qNegMarks}`
                                        }
                                    </div>
                                )
                            }

                        </div>
                        <div className="flex flex-wrap gap-3 text-xs mt-2">

                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-xl font-medium">
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
                    <div className="mt-1 rounded-xl p-1 shadow-inner border border-slate-100">

                        <div className="text-xs md:text-sm font-semibold leading-relaxed whitespace-pre-wrap">

                            {currentQuestion?.question}

                        </div>

                    </div>

                </div>

                {/* OPTIONS */}

                <div className="mt-2 space-y-2.5">

                    {
                        currentQuestion?.options?.map(
                            (option: any) => {

                                const currentSelected =
                                    savedPrompt
                                const isSelected =
                                    Number(currentSelected) ===
                                    Number(option.prompt)
                                const isCorrectOption =
                                    isSubmitted &&
                                    Number(option.prompt) ===
                                    Number(correctAnswer)

                                const isWrongSelected =
                                    isSubmitted &&
                                    Number(option.prompt) ===
                                    Number(selectedAnswer) &&
                                    Number(selectedAnswer) !==
                                    Number(correctAnswer)
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
    py-2
    text-xs
    md:text-sm
    transition-colors

    ${isSubmitted
                                                ? isCorrectOption
                                                    ? `
                    border-2
                    border-green-600
                    bg-green-50
                    text-green-800
                    font-bold
                `
                                                    : isWrongSelected
                                                        ? `
                        border-2
                        border-red-600
                        bg-red-50
                        text-red-700
                        font-bold
                    `
                                                        : `
                        border
                        border-slate-200
                        bg-white
                    `
                                                : isSelected
                                                    ? `
                    border-2
                    border-emerald-500
                    bg-emerald-50
                    text-emerald-800
                    font-bold
                `
                                                    : `
                    border
                    border-slate-200
                    bg-white
                    hover:bg-slate-50
                `
                                            }
`}
                                    >

                                        {
                                            !isSubmitted && (
                                                <input
                                                    type="radio"
                                                    name={qId}
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        useTestDataStore
                                                            .getState()
                                                            .selectOption(
                                                                qId,
                                                                option.prompt
                                                            )
                                                    }
                                                />
                                            )
                                        }

                                        <div className="flex items-center justify-between w-full">

                                            <span>
                                                {option.opKey} {option.value}
                                            </span>

                                            {
                                                isSubmitted && isCorrectOption && (
                                                    <span className="
                ml-3
                text-[10px]
                bg-green-600
                text-white
                px-2
                py-1
                rounded-full
                font-bold
            ">
                                                        Correct
                                                    </span>
                                                )
                                            }

                                            {
                                                isSubmitted && isWrongSelected && (
                                                    <span className="
                ml-3
                text-[10px]
                bg-red-600
                text-white
                px-2
                py-1
                rounded-full
                font-bold
            ">
                                                        Wrong
                                                    </span>
                                                )
                                            }

                                        </div>

                                    </label>
                                )
                            }
                        )
                    }

                </div>

                {/* SOLUTION */}

                {
                    isSubmitted && (
                        <div className="mt-2 border-t border-slate-200 pt-1">

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
                                    <div className="mt-3 bg-white rounded-xl border border-slate-200 p-2 text-xs">

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
            />

        </div>
    )
}