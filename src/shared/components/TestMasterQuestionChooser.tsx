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
                        icon: "",
                    }

                case "answeredAndMarked":
                    return {
                        bg: "bg-[#7D589E]",
                        hover: "hover:bg-[#624582]",
                        text: "text-white",
                        icon: "",
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
        <div className="relative pb-24">
            {/* HEADER */}
            <div className="mt-4 bg-[#4A3F77] text-white font-bold text-[11px] px-3 py-2 rounded-t-xl tracking-wider uppercase">
                <h4 className="text-[11px] font-bold text-white">
                    Choose a Question:
                </h4>
            </div>

            {/* BODY */}
            <div className="border border-t-0 border-slate-200 rounded-b-xl p-2.5 bg-slate-50/50">
                <div className="overflow-y-auto max-h-[290px] pr-1">
                    <div className="grid grid-cols-5 gap-3 text-center py-1">
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
                                <div className="relative flex justify-center">

                                    <button
                                        key={qId}
                                        onClick={() =>
                                            setActiveQuestionIndex(index)
                                        }
                                        className={`
            relative
            w-12
            h-12
            rounded-xl
            text-sm
            font-extrabold
            flex
            items-center
            justify-center
            border-2
            transition-all
            duration-200
            shadow-sm

            ${activeQuestionIndex === index
                                                ? "scale-105 border-[#4A3F77] ring-2 ring-[#4A3F77]/30"
                                                : "border-black/10"
                                            }

            ${styles.bg}
            ${styles.hover}
            ${styles.text}
        `}
                                    >

                                        <span className="text-[15px] font-black">
                                            {index + 1}
                                        </span>

                                        {/* MARKS BADGE */}
                                        {
                                            isSubmitted &&
                                            obtainedMarks !== 0 && (
                                                <div
                                                    className={`
                        absolute
                        -top-2
                        -right-2
                        min-w-[22px]
                        h-[22px]
                        px-1
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-[10px]
                        font-black
                        shadow-lg
                        border-2
                        border-white

                        ${obtainedMarks > 0
                                                            ? "bg-green-600 text-white"
                                                            : "bg-red-600 text-white"
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
                    -top-2
                    -right-2
                    w-5
                    h-5
                    rounded-full
                    bg-white
                    border-2
                    border-[#7D589E]
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    text-[#7D589E]
                    font-black
                    shadow-md
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
        bg-white
        border-t
        border-slate-200
        p-3
        flex
        gap-2
        z-30
        shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
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
            bg-red-500
            text-white
            font-bold
            text-sm
            disabled:opacity-70
            disabled:pointer-events-none
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
            disabled:opacity-70
            disabled:pointer-events-none
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