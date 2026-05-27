"use client"

import { useTestDataStore } from "../store/testDataStore"

type QuestionStatus =
    | "correct"
    | "wrong"
    | "notVisited"
    | "visited"
    | "marked"
    | "answered"
    | "answeredAndMarked"

type Props = {
    isSubmitted?: boolean
}

export default function TestMasterQuestionChooser({
    isSubmitted = false,
}: Props) {


    const {
        activeTest,
        activeSubject,
        activeQuestionIndex,
        selectedOptions,
        setActiveQuestionIndex
    } = useTestDataStore()

    const historyObj =
        activeTest?.activeQuestionHistoryObj?.[
        activeSubject
        ] || {}

    const qIDs = Array.isArray(historyObj?.qIDs)
        ? historyObj.qIDs
        : Object.values(historyObj?.qIDs || {})
    const getButtonStyles = (
        status: QuestionStatus,
        submitted: boolean
    ) => {
        // RESULT MODE
        if (submitted) {
            switch (status) {
                case "correct":
                    return {
                        bg: "bg-[#6AB81F]",
                        hover: "hover:bg-[#51A817]",
                        text: "text-white",
                        icon: "✓",
                    }

                case "wrong":
                    return {
                        bg: "bg-[#F24C07]",
                        hover: "hover:bg-[#B72C07]",
                        text: "text-white",
                        icon: "✕",
                    }

                // visited but not answered
                case "visited":
                    return {
                        bg: "bg-[#F24C07]",
                        hover: "hover:bg-[#B72C07]",
                        text: "text-white",
                        icon: "",
                    }

                // answered but correctness not shown
                case "answered":
                    return {
                        bg: "bg-[#6AB81F]",
                        hover: "hover:bg-[#51A817]",
                        text: "text-white",
                        icon: "",
                    }

                case "marked":
                    return {
                        bg: "bg-[#7D589E]",
                        hover: "hover:bg-[#624582]",
                        text: "text-white",
                        icon: "★",
                    }

                case "answeredAndMarked":
                    return {
                        bg: "bg-[#7D589E]",
                        hover: "hover:bg-[#624582]",
                        text: "text-white",
                        icon: "★",
                    }

                case "notVisited":
                default:
                    return {
                        bg: "bg-[#F1F1F0]",
                        hover: "hover:bg-[#D3D2D2]",
                        text: "text-slate-700",
                        icon: "",
                    }
            }
        }

        // TEST RUNNING / RESUME MODE
        switch (status) {
            // only green
            case "answered":
            case "correct":
            case "wrong":
                return {
                    bg: "bg-[#6AB81F]",
                    hover: "hover:bg-[#51A817]",
                    text: "text-white",
                    icon: "",
                }

            // red without symbol
            case "visited":
                return {
                    bg: "bg-[#F24C07]",
                    hover: "hover:bg-[#B72C07]",
                    text: "text-white",
                    icon: "",
                }

            case "marked":
            case "answeredAndMarked":
                return {
                    bg: "bg-[#7D589E]",
                    hover: "hover:bg-[#624582]",
                    text: "text-white",
                    icon: "★",
                }

            case "notVisited":
            default:
                return {
                    bg: "bg-[#F1F1F0]",
                    hover: "hover:bg-[#D3D2D2]",
                    text: "text-slate-700",
                    icon: "",
                }
        }
    }

    return (
        <div>
            {/* HEADER */}
            <div className="mt-4 bg-[#4A3F77] text-white font-bold text-[11px] px-3 py-2 rounded-t-xl tracking-wider uppercase">
                <h4 className="text-[11px] font-bold text-white">
                    Choose a Question:
                </h4>
            </div>

            {/* BODY */}
            <div className="border border-t-0 border-slate-200 rounded-b-xl p-2.5 bg-slate-50/50">
                <div className="overflow-y-auto max-h-[290px] pr-1">
                    <div className="grid grid-cols-5 gap-2 text-center">
                        {qIDs?.map((qId: any, index: number) => {

                            const question =
                                activeTest?.questions?.[qId]

                            const selected =
                                historyObj?.answered?.[qId] ??
                                historyObj?.answeredAndMarkedForReview?.[qId] ??
                                selectedOptions?.[qId]

                            const correctAnswer =
                                question?.correctAnswer

                            const isMarked =
                                historyObj?.markedForReview?.includes?.(qId)

                            const isAnsweredAndMarked =
                                historyObj?.answeredAndMarkedForReview?.[
                                qId
                                ] !== undefined

                            const isVisited =
                                historyObj?.visited?.includes?.(qId)

                            const isAnswered =
                                selected !== undefined

                            let status: any = "notVisited"

                            if (isSubmitted) {

                                if (isAnsweredAndMarked) {

                                    status =
                                        String(selected) ===
                                            String(correctAnswer)
                                            ? "correct"
                                            : "wrong"
                                }

                                else if (isMarked) {

                                    status = "marked"
                                }

                                else if (isAnswered) {

                                    status =
                                        String(selected) ===
                                            String(correctAnswer)
                                            ? "correct"
                                            : "wrong"
                                }

                                else if (isVisited) {

                                    status = "visited"
                                }
                            }

                            else {

                                if (isAnsweredAndMarked) {

                                    status = "answeredAndMarked"
                                }

                                else if (isMarked) {

                                    status = "marked"
                                }

                                else if (isAnswered) {

                                    status = "answered"
                                }

                                else if (isVisited) {

                                    status = "visited"
                                }
                            }

                            const styles = getButtonStyles(
                                status,
                                isSubmitted
                            )


                            return (
                                <button
                                    key={qId}
                                    onClick={() =>
                                        setActiveQuestionIndex(index)
                                    }
                                    className={`
                                        ${activeQuestionIndex === index
                                            ? "ring-4 ring-[#4A3F77]"
                                            : ""}
                                        relative
                                        overflow-visible
                                        h-12
                                        rounded-lg
                                        text-base
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                        transition-all
                                        duration-200
                                        border
                                        border-black/10
                                        shadow-sm
                                        ${styles.bg}
                                        ${styles.hover}
                                        ${styles.text}
                                    `}
                                >
                                    <span className="text-[17px] font-bold">
                                        {index + 1}
                                    </span>

                                    {styles.icon && (
                                        <span
                                            className="
                                                absolute
                                                -bottom-2
                                                -right-2
                                                w-6
                                                h-6
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-[15px]
                                                font-black
                                                leading-none
                                                bg-white
                                                text-black
                                                border-2
                                                border-white
                                                shadow-md
                                            "
                                        >
                                            {styles.icon}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}