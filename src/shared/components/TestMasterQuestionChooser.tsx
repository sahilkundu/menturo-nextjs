"use client"

import { useTestDataStore } from "../store/testDataStore"
import { useTestSeriesStore } from "../store/testSeriesStore"
import { useRouter } from "next/navigation"
import Spinner from "./Spinner"

type QuestionStatus =
    | "correct"
    | "wrong"
    | "notVisited"
    | "visited"
    | "marked"
    | "answered"
    | "answeredAndMarked"

export default function TestMasterQuestionChooser() {
    const router = useRouter()

    const {
        activeTest,
        activeSubject,
        activeQuestionIndex,
        selectedOptions,
        setActiveQuestionIndex,
        fetchResult,
        fetchSave,
        loadingResult,
        loadingSave,
        isSubmitted
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
                        bg: "bg-[#6AB81F] shadow-[0_4px_10px_rgba(106,184,31,0.25)]",
                        hover: "hover:bg-[#51A817] hover:scale-105",
                        text: "text-white",
                        icon: "✓",
                    }

                case "wrong":
                    return {
                        bg: "bg-[#F24C07] shadow-[0_4px_10px_rgba(242,76,7,0.25)]",
                        hover: "hover:bg-[#B72C07] hover:scale-105",
                        text: "text-white",
                        icon: "✕",
                    }

                // visited but not answered
                case "visited":
                    return {
                        bg: "bg-[#F24C07] shadow-[0_4px_10px_rgba(242,76,7,0.2)]",
                        hover: "hover:bg-[#B72C07] hover:scale-105",
                        text: "text-white",
                        icon: "",
                    }

                // answered but correctness not shown
                case "answered":
                    return {
                        bg: "bg-[#6AB81F] shadow-[0_4px_10px_rgba(106,184,31,0.2)]",
                        hover: "hover:bg-[#51A817] hover:scale-105",
                        text: "text-white",
                        icon: "",
                    }

                case "marked":
                    return {
                        bg: "bg-[#7D589E] shadow-[0_4px_10px_rgba(125,88,158,0.2)]",
                        hover: "hover:bg-[#624582] hover:scale-105",
                        text: "text-white",
                        icon: "",
                    }

                case "answeredAndMarked":
                    return {
                        bg: "bg-[#7D589E] shadow-[0_4px_10px_rgba(125,88,158,0.25)]",
                        hover: "hover:bg-[#624582] hover:scale-105",
                        text: "text-white",
                        icon: "",
                    }

                case "notVisited":
                default:
                    return {
                        bg: "bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-inner",
                        hover: "hover:bg-slate-100 hover:scale-105",
                        text: "text-slate-600",
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
                    bg: "bg-[#6AB81F] shadow-[0_4px_10px_rgba(106,184,31,0.25)]",
                    hover: "hover:bg-[#51A817] hover:scale-105",
                    text: "text-white",
                    icon: "",
                }

            // red without symbol
            case "visited":
                return {
                    bg: "bg-[#F24C07] shadow-[0_4px_10px_rgba(242,76,7,0.25)]",
                    hover: "hover:bg-[#B72C07] hover:scale-105",
                    text: "text-white",
                    icon: "",
                }

            case "marked":
            case "answeredAndMarked":
                return {
                    bg: "bg-[#7D589E] shadow-[0_4px_10px_rgba(125,88,158,0.25)]",
                    hover: "hover:bg-[#624582] hover:scale-105",
                    text: "text-white",
                    icon: "★",
                }

            case "notVisited":
            default:
                return {
                    bg: "bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-inner",
                    hover: "hover:bg-slate-100 hover:scale-105",
                    text: "text-slate-600",
                    icon: "",
                }
        }
    }

    return (
        <div className="relative pb-19 md:pb-19 w-full max-w-md mx-auto">
            {/* HEADER */}
            <div className="mt-4 bg-[#4A3F77]/95 backdrop-blur-md text-white font-bold text-[11px] px-4 py-3 rounded-t-2xl tracking-wider uppercase shadow-md border-b border-white/10">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-white rounded-full inline-block"></span>
                    Choose a Question:
                </h4>
            </div>

            {/* BODY */}
            <div className="border border-t-0 border-slate-200/60 rounded-b-2xl p-2 bg-gradient-to-b from-slate-50/80 to-white/90 shadow-xl backdrop-blur-md">
                <div className="overflow-y-auto max-h-[290px] pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="grid grid-cols-5 xs:grid-cols-6 gap-1.5 text-center py-1">
                        {qIDs?.map((qId: any, index: number) => {

                            const question =
                                activeTest?.questions?.[qId]

                            const solution =
                                activeTest?.solution?.[qId]

                            const obtainedMarks =
                                Number(solution?.ob || 0)

                            const selectedAnswer =
                                solution?.selected

                            const correctAnswer =
                                solution?.answer

                            const selected =
                                historyObj?.answered?.[qId] ??
                                historyObj?.answeredAndMarkedForReview?.[qId] ??
                                selectedOptions?.[qId]


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
                                <div key={qId} className="relative flex justify-center">

                                    <button
                                        key={qId}
                                        onClick={() =>
                                            setActiveQuestionIndex(index)
                                        }
                                        className={`
                                            relative
                                            w-8 
                                            h-8
                                            rounded-xl
                                            text-sm
                                            font-extrabold
                                            flex
                                            items-center
                                            justify-center
                                            transition-all
                                            duration-200
                                            active:scale-95
                                            shadow-sm

                                            ${activeQuestionIndex === index
                                                ? "scale-105 border-2 border-[#4A3F77] ring-4 ring-[#4A3F77]/20 z-10"
                                                : "border border-slate-200/80"
                                            }

                                            ${styles.bg}
                                            ${styles.hover}
                                            ${styles.text}
                                        `}
                                    >

                                        <span className="text-[14px] font-black tracking-tighter">
                                            {index + 1}
                                        </span>

                                        {/* MARKS BADGE */}
                                        {
                                            isSubmitted &&
                                            obtainedMarks !== 0 && (
                                                <div
                                                    className={`
                                                        absolute
                                                        -top-1.5
                                                        -right-1.5
                                                        min-w-[18px]
                                                        h-[18px]
                                                        px-1
                                                        rounded-full
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-[9px]
                                                        font-black
                                                        shadow-md
                                                        border
                                                        border-white

                                                        ${obtainedMarks > 0
                                                            ? "bg-green-500 text-white"
                                                            : "bg-red-500 text-white"
                                                        }
                                                    `}
                                                >
                                                    {obtainedMarks}
                                                </div>
                                            )
                                        }

                                        {/* ANSWERED + MARKED ONLY */}
                                        {/* ANSWERED + MARKED FOR REVIEW */}
                                        {
                                            status === "answeredAndMarked" &&
                                            !isSubmitted && (
                                                <>
                                                    {/* STAR */}
                                                    <span
                                                        className="
                                                            absolute
                                                            -top-1.5
                                                            -right-1.5
                                                            w-4
                                                            h-4
                                                            rounded-full
                                                            bg-white
                                                            border
                                                            border-[#7D589E]
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-[9px]
                                                            text-[#7D589E]
                                                            font-black
                                                            shadow-sm
                                                            z-10
                                                        "
                                                    >
                                                        ★
                                                    </span>


                                                </>
                                            )
                                        }

                                    </button>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
            {/* BOTTOM ACTION BAR */}
            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    bg-white/80
                    backdrop-blur-lg
                    border-t
                    border-slate-200/80
                    p-3.5
                    flex
                    gap-2.5
                    z-30
                    shadow-[0_-8px_24px_rgba(0,0,0,0.06)]
                    rounded-t-2xl
                "
            >

                {/* EXIT TEST */}
                <button
                    disabled={loadingSave || loadingResult}
                    onClick={async () => {
                        if (isSubmitted) {

                            router.back()

                            return
                        }
                        const store =
                            useTestDataStore.getState()

                        if (
                            store.loadingSave ||
                            store.loadingResult
                        ) {
                            return
                        }

                        const history =
                            store.activeTest
                                ?.activeQuestionHistoryObj

                        const testsMap =
                            useTestSeriesStore
                                .getState()
                                .testsMap

                        let historyId = ''

                        Object.values(testsMap).forEach(
                            (tests: any) => {

                                tests.forEach((test: any) => {

                                    const runningHistory =
                                        test?.history?.find(
                                            (h: any) =>
                                                h.status === 'running'
                                        )

                                    if (runningHistory) {

                                        historyId =
                                            runningHistory._id
                                    }
                                })
                            }
                        )

                        if (!historyId) {
                            return
                        }

                        await fetchSave({

                            historyId,

                            data: {

                                [activeSubject]: {

                                    ...history[
                                    activeSubject
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

                        router.back()
                    }}
                    className="
                        cursor-pointer
                        flex-1
                        h-11
                        rounded-xl
                        bg-gradient-to-r from-red-500 to-rose-600
                        text-white
                        font-bold
                        text-sm
                        transition-all
                        duration-200
                        active:scale-95
                        shadow-[0_4px_12px_rgba(244,63,94,0.2)]
                        hover:opacity-95
                        disabled:opacity-50
                        disabled:pointer-events-none
                        flex items-center justify-center
                    "
                >

                    {
                        loadingSave
                            ? <Spinner size={16} />
                            : "Exit Test"
                    }

                </button>

                {/* SUBMIT */}
                {!isSubmitted &&
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

                            const testsMap =
                                useTestSeriesStore
                                    .getState()
                                    .testsMap

                            let payload: any = null

                            Object.values(testsMap).forEach(
                                (tests: any) => {

                                    tests.forEach((test: any) => {

                                        const runningHistory =
                                            test?.history?.find(
                                                (h: any) =>
                                                    h.status === 'running'
                                            )

                                        if (runningHistory) {

                                            payload = {

                                                historyId:
                                                    runningHistory._id,

                                                relationId:
                                                    test.relationId,

                                                testId:
                                                    test.testId,

                                                ts:
                                                    test.ts,

                                                data: {

                                                    [activeSubject]: {

                                                        ...history[
                                                        activeSubject
                                                        ],

                                                        activeIndex:
                                                            store.activeQuestionIndex,

                                                        language:
                                                            store.activeLan,
                                                        timeLeft:
                                                            store.timeLeft
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            )

                            if (!payload) {
                                return
                            }

                            const data =
                                await fetchResult(payload)

                            // if (data?.success) {

                            //     router.refresh()
                            // }
                        }}
                        className="
                            flex-1
                            h-11
                            rounded-xl
                            bg-[#4A3F77]
                            text-white
                            font-bold
                            text-sm
                            cursor-pointer
                            transition-all
                            duration-200
                            active:scale-95
                            shadow-[0_4px_12px_rgba(74,63,119,0.25)]
                            hover:bg-[#3b3260]
                            disabled:opacity-50
                            disabled:pointer-events-none
                            flex items-center justify-center
                        "
                    >

                        {
                            loadingResult
                                ? <Spinner size={16} />
                                : "Submit Test"
                        }

                    </button>}

            </div>
        </div>
    )
}