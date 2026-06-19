"use client"

import { useMemo } from "react"

import { useTestDataStore } from "../store/testDataStore"

type Props = {
    isSubmitted?: boolean
}

export default function TestMasterReviewInfo({
    isSubmitted = false,
}: Props) {

    // =====================================
    // STORE
    // =====================================

    const activeTest =
        useTestDataStore(
            (state) => state.activeTest
        )
    const activeSubject =
        useTestDataStore(
            (state) => state.activeSubject
        )

    // =====================================
    // HISTORY
    // =====================================

    const historyObj =
        activeTest
            ?.activeQuestionHistoryObj?.[
        activeSubject
        ] || {}

    // =====================================
    // QUESTIONS
    // =====================================

    const questions =
        activeTest?.questions || {}

    // =====================================
    // COUNTS
    // =====================================

    const counts =
        useMemo(() => {

            const answeredObj =
                historyObj?.answered || {}

            const answeredReviewObj =
                historyObj?.answeredAndMarkedForReview || {}

            const answered =
                Object.keys(answeredObj).length

            const answeredAndReview =
                Object.keys(answeredReviewObj).length

            const review =
                historyObj?.markedForReview?.length || 0

            const visited =
                historyObj?.visited?.length || 0

            const notVisited =
                historyObj?.notVisited?.length || 0

            // =====================================
            // SUBMITTED MODE
            // =====================================

            let correct = 0
            let wrong = 0

            if (isSubmitted) {

                Object.entries(answeredObj)
                    .forEach(
                        ([qId, value]: any) => {

                            const correctAnswer =
                                questions?.[
                                    qId
                                ]?.correctAnswer

                            if (
                                String(value) ===
                                String(correctAnswer)
                            ) {
                                correct++
                            }
                            else {
                                wrong++
                            }
                        }
                    )

                Object.entries(answeredReviewObj)
                    .forEach(
                        ([qId, value]: any) => {

                            const correctAnswer =
                                questions?.[
                                    qId
                                ]?.correctAnswer

                            if (
                                String(value) ===
                                String(correctAnswer)
                            ) {
                                correct++
                            }
                            else {
                                wrong++
                            }
                        }
                    )
            }

            return {

                answered,
                answeredAndReview,
                review,
                visited,
                notVisited,
                correct,
                wrong,
            }

        }, [
            historyObj,
            questions,
            isSubmitted
        ])

    return (

        <div className="
            grid
            grid-cols-2
            gap-x-3
            mt-1
            gap-y-3
            text-[10px]
            font-semibold
            text-slate-700
            bg-slate-50
            p-1.5
            rounded-2xl
            border
            border-slate-200
        ">

            {/* WRONG / VISITED */}

            {
                isSubmitted ? (

                    <div className="flex items-center gap-3">

                        <div className="
                            relative
                            w-4
                            h-4
                            rounded-lg
                            bg-[#F24C07]
                            flex
                            items-center
                            justify-center
                            text-white
                            text-sm
                            font-bold
                            shadow-sm
                        ">

                            {counts.wrong}

                            <span className="
                                absolute
                                -bottom-1
                                -right-1
                                w-4
                                h-4
                                rounded-full
                                bg-white
                                border
                                border-[#F24C07]
                                flex
                                items-center
                                justify-center
                                text-[10px]
                                text-[#F24C07]
                                font-black
                            ">
                                ✕
                            </span>

                        </div>

                        <span>Wrong</span>

                    </div>

                ) : (

                    <div className="flex items-center gap-3">

                        <div className="
                            w-6
                            h-6
                            rounded-lg
                            bg-[#F24C07]
                            flex
                            items-center
                            justify-center
                            text-white
                            text-sm
                            font-bold
                            shadow-sm
                        ">

                            {counts.visited}

                        </div>

                        <span>Visited</span>

                    </div>

                )
            }

            {/* NOT VISITED */}

            <div className="flex items-center gap-3">

                <div className="
                    w-6
                    h-6
                    rounded-lg
                    bg-[#F1F1F0]
                    border
                    border-[#D3D2D2]
                    flex
                    items-center
                    justify-center
                    text-slate-700
                    text-sm
                    font-bold
                    shadow-sm
                ">

                    {counts.notVisited}

                </div>

                <span>Not Visited</span>

            </div>

            {/* REVIEW */}

            <div className="flex items-center gap-3">

                <div className="
        w-6
        h-6
        rounded-lg
        bg-[#7D589E]
        flex
        items-center
        justify-center
        text-white
        text-sm
        font-bold
        shadow-sm
    ">

                    {counts.review}

                </div>

                <span>Review</span>

            </div>
            {/* ANSWERED / CORRECT */}

            <div className="flex items-center gap-3">

                <div className="
                    relative
                    w-6
                    h-6
                    rounded-lg
                    bg-[#6AB81F]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-sm
                    font-bold
                    shadow-sm
                ">

                    {
                        isSubmitted
                            ? counts.correct
                            : counts.answered
                    }

                    {
                        isSubmitted && (

                            <span className="
                                absolute
                                -bottom-1
                                -right-1
                                w-4
                                h-4
                                rounded-full
                                bg-white
                                border
                                border-[#6AB81F]
                                flex
                                items-center
                                justify-center
                                text-[10px]
                                text-[#6AB81F]
                                font-black
                            ">
                                ✓
                            </span>

                        )
                    }

                </div>

                <span>
                    {
                        isSubmitted
                            ? "Correct"
                            : "Answered"
                    }
                </span>

            </div>

            {/* ANSWERED & REVIEW */}

            <div className="
                flex
                items-center
                gap-3
                col-span-2
            ">

                <div className="
                    relative
                    w-6
                    h-6
                    rounded-lg
                    bg-[#7D589E]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-sm
                    font-bold
                    shadow-sm
                ">

                    {counts.answeredAndReview}

                    <span className="
                        absolute
                        -top-1
                        -right-1
                        w-4
                        h-4
                        rounded-full
                        bg-white
                        border
                        border-[#7D589E]
                        flex
                        items-center
                        justify-center
                        text-[10px]
                        text-[#7D589E]
                        font-black
                    ">
                        ★
                    </span>

                    {
                        isSubmitted && (

                            <span className="
                                absolute
                                -bottom-1
                                -right-1
                                w-4
                                h-4
                                rounded-full
                                bg-white
                                border
                                border-[#6AB81F]
                                flex
                                items-center
                                justify-center
                                text-[10px]
                                text-[#6AB81F]
                                font-black
                            ">
                                ✓
                            </span>

                        )
                    }

                </div>

                <span>
                    Answered & Marked for Review
                </span>

            </div>

        </div>
    )
}
