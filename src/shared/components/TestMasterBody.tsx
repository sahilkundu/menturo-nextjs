'use client'

import { ReactNode, useEffect, useMemo, useState } from "react"
import DOMPurify from "isomorphic-dompurify"
import { useTestDataStore } from "../store/testDataStore"
import TestMasterButtons from "./TestMasterButtons"

type RichRecord = Record<string, any>

const hasValue = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    value !== ''

const isImageSource = (value: string) =>
    /^(https?:\/\/|data:image\/)/i.test(value) ||
    /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value)

const hasHtml = (value: string) =>
    /<\/?[a-z][\s\S]*>/i.test(value)

const solutionTone = (label: string) => {
    const normalized =
        label.trim().toLowerCase()

    if (
        normalized.startsWith("✓") ||
        normalized.includes("correct")
    ) {
        return {
            wrapper:
                "border-emerald-100 bg-emerald-50/55",
            label:
                "text-emerald-700",
            marker:
                "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]",
        }
    }

    if (
        normalized.startsWith("✗") ||
        normalized.includes("wrong") ||
        normalized.includes("incorrect")
    ) {
        return {
            wrapper:
                "border-rose-100 bg-rose-50/45",
            label:
                "text-rose-700",
            marker:
                "bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]",
        }
    }

    return {
        wrapper:
            "border-slate-200 bg-white",
        label:
            "text-[#4A3F77]",
        marker:
            "bg-[#4A3F77] shadow-[0_0_0_3px_rgba(74,63,119,0.10)]",
    }
}

function RichValue({
    value,
    className = "",
}: {
    value: any
    className?: string
}) {
    if (!hasValue(value)) return null

    if (Array.isArray(value)) {
        return (
            <div className={`space-y-1.5 ${className}`}>
                {value.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-2 rounded-md border border-slate-200/70 bg-white/80 px-2.5 py-2 text-[12px] leading-relaxed text-slate-700 shadow-sm shadow-slate-200/40"
                    >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4A3F77]" />
                        <RichValue value={item} />
                    </div>
                ))}
            </div>
        )
    }

    if (typeof value === "object") {
        if (typeof value.image === "string") {
            return <RichValue value={value.image} className={className} />
        }

        return (
            <div className={`space-y-3 ${className}`}>
                {Object.entries(value).map(([key, item]) => (
                    <div
                        key={key}
                        className={
                            key.toLowerCase().includes("important points")
                                ? "space-y-2"
                                : `rounded-lg border p-2.5 shadow-sm shadow-slate-200/50 ${solutionTone(key).wrapper}`
                        }
                    >
                        <div
                            className={`flex items-center gap-2 text-[11px] font-black tracking-wide ${solutionTone(key).label}`}
                        >
                            <span className={`h-2 w-2 shrink-0 rounded-full ${solutionTone(key).marker}`} />
                            <span>{key}</span>
                        </div>
                        <div className={key.toLowerCase().includes("important points") ? "" : "mt-2"}>
                            <RichValue value={item} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const text = String(value)

    if (isImageSource(text)) {
        return (
            <img
                src={text}
                alt=""
                className={`max-h-[360px] max-w-full rounded-lg border border-slate-200 object-contain ${className}`}
            />
        )
    }

    if (hasHtml(text)) {
        const sanitizedHtml =
            DOMPurify.sanitize(text)

        return (
            <span
                className={`break-words [&_img]:my-2 [&_img]:max-h-[360px] [&_img]:max-w-full [&_img]:rounded-lg [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-1.5 [&_th]:border [&_th]:border-slate-200 [&_th]:p-1.5 ${className}`}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
        )
    }

    return (
        <span className={`break-words whitespace-pre-wrap ${className}`}>
            {text}
        </span>
    )
}

function LinkImageBlock({
    links,
    name,
}: {
    links?: RichRecord
    name: string
}) {
    const value = links?.[name]

    if (!hasValue(value)) return null

    return (
        <div className="mt-2">
            <RichValue value={value} />
        </div>
    )
}

function AdvancedBlock({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            <div className="mb-1 text-[11px] font-black uppercase text-slate-500">
                {title}
            </div>
            {children}
        </section>
    )
}

function renderObjectEntries(value: RichRecord) {
    return Object.entries(value).map(([key, item]) => (
        <div key={key} className="flex gap-2 rounded-md bg-white px-2 py-1.5 text-xs">
            <span className="shrink-0 font-black text-slate-700">{key}</span>
            <RichValue value={item} />
        </div>
    ))
}

function AdvancedQuestionContent({
    data,
}: {
    data?: RichRecord
}) {
    if (!data) return null

    return (
        <>
            <LinkImageBlock links={data.links} name="qType" />

            {data.match && (
                <AdvancedBlock title="Match">
                    <div className="grid gap-2 md:grid-cols-2">
                        {["column1", "column2"].map((column) => (
                            <div key={column} className="space-y-1 rounded-lg bg-white p-2">
                                <div className="text-[11px] font-black text-slate-500">
                                    {data.match?.[column]?.title || column}
                                </div>
                                <div className="space-y-1">
                                    {renderObjectEntries(data.match?.[column]?.options || {})}
                                </div>
                            </div>
                        ))}
                    </div>
                </AdvancedBlock>
            )}

            {data.pqrs && (
                <AdvancedBlock title="PQRS">
                    <div className="space-y-1">
                        {renderObjectEntries(data.pqrs)}
                    </div>
                </AdvancedBlock>
            )}

            {data.shape && (
                <AdvancedBlock title="Shape">
                    <RichValue value={data.shape} />
                </AdvancedBlock>
            )}

            {data.statement && (
                <AdvancedBlock title="Statement">
                    <RichValue value={data.statement} />
                </AdvancedBlock>
            )}

            {data.assertion && (
                <AdvancedBlock title="Assertion">
                    <RichValue value={data.assertion} />
                </AdvancedBlock>
            )}

            {data.mcq2 && (
                <AdvancedBlock title="MCQ2">
                    <div className="space-y-1">
                        {renderObjectEntries(data.mcq2?.options || data.mcq2)}
                    </div>
                </AdvancedBlock>
            )}

            {data.line && (
                <AdvancedBlock title="Line">
                    <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(data.line) ? data.line : [data.line]).map((item: any, index: number) => (
                            <span key={index} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                                <RichValue value={item} />
                            </span>
                        ))}
                    </div>
                </AdvancedBlock>
            )}
        </>
    )
}

const getPromptValue = (option: any) =>
    option?.prompt ?? option?.opKey ?? option?.value

const answerIncludes = (answer: any, prompt: any) =>
    Array.isArray(answer)
        ? answer.some((value) => String(value) === String(prompt))
        : String(answer) === String(prompt)

const answerEquals = (left: any, right: any) => {
    if (Array.isArray(left) || Array.isArray(right)) {
        const leftValues = Array.isArray(left) ? left.map(String).sort() : [String(left)]
        const rightValues = Array.isArray(right) ? right.map(String).sort() : [String(right)]

        return leftValues.length === rightValues.length &&
            leftValues.every((value, index) => value === rightValues[index])
    }

    return String(left) === String(right)
}

const normalizeOptions = (options: any) => {
    if (Array.isArray(options)) return options
    if (options && typeof options === "object") {
        return Object.entries(options).map(([key, value]) => ({
            opKey: key,
            prompt: key,
            value,
        }))
    }
    return []
}

const findSolutionText = (
    solution: any,
    activeSubject: string,
    qId: string,
    activeLan: string
) => {
    const candidates = [
        solution?.solution?.[activeLan],
        solution?.explanation?.[activeLan],
        solution?.explanations?.[activeLan],
        solution?.solution,
        solution?.explanation,
        solution?.explanations,
        solution?.solutionWithExplanations?.[activeSubject]?.[qId]?.solution?.[activeLan],
        solution?.solutionWithExplanations?.[activeSubject]?.[qId],
    ]

    return candidates.find(hasValue)
}

export default function TestMasterBody() {

    const activeTest =
        useTestDataStore((state) => state.activeTest)
    const activeQuestionIndex =
        useTestDataStore((state) => state.activeQuestionIndex)
    const activeSubject =
        useTestDataStore((state) => state.activeSubject)
    const activeLan =
        useTestDataStore((state) => state.activeLan)
    const selectedOptions =
        useTestDataStore((state) => state.selectedOptions)
    const visitQuestion =
        useTestDataStore((state) => state.visitQuestion)

    const historyObj =
        activeTest?.activeQuestionHistoryObj?.[
        activeSubject
        ]

    const qId =
        historyObj?.qIDs?.[
        activeQuestionIndex
        ]

    const question =
        activeTest?.questions?.[
        qId
        ]

    const currentQuestion =
        question?.[
        activeLan
        ] || question?.en || question?.hn

    const options =
        useMemo(
            () => normalizeOptions(currentQuestion?.options),
            [currentQuestion?.options]
        )

    const savedPrompt =
        selectedOptions?.[qId]

    const isSubmitted =
        useTestDataStore(
            (state) => state.isSubmitted
        )

    const solution =
        activeTest?.solution?.[qId]

    const correctAnswer =
        solution?.answer

    const obtainedMarks =
        Number(solution?.ob || 0)

    const selectedAnswer =
        solution?.selected ?? savedPrompt

    const isCorrect =
        obtainedMarks > 0

    const solutionText =
        findSolutionText(
            solution,
            activeSubject,
            String(qId),
            activeLan
        )

    const [showSolution, setShowSolution] =
        useState(false)

    useEffect(() => {
        setShowSolution(isSubmitted)
    }, [isSubmitted])

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

    const activeQType2 =
        question?.qType2 || question?.qType || ""

    return (

        <div className="relative mt-0 flex h-full min-h-0 flex-col bg-white">

            <div className="flex-1 overflow-y-auto">

                <div className="mt-0">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                        <div className="flex items-center gap-2">

                            <h2 className="text-base font-black text-slate-800">
                                Question No: {activeQuestionIndex + 1}
                            </h2>

                            {
                                isSubmitted && (
                                    <div
                                        className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
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
                        {
                            activeQType2 && (
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <div className="rounded-xl bg-green-100 px-3 py-1 font-medium text-green-600">
                                        {activeQType2}
                                    </div>
                                </div>
                            )
                        }

                    </div>

                    <div className="mt-1 rounded-xl border border-slate-100 p-2 shadow-inner">
                        <LinkImageBlock links={currentQuestion?.links} name="questionTop" />
                        <LinkImageBlock links={currentQuestion?.links} name="question" />

                        <div className="text-xs font-semibold leading-relaxed text-slate-800 md:text-sm">
                            <RichValue value={currentQuestion?.question} />
                        </div>

                        <AdvancedQuestionContent data={currentQuestion} />
                    </div>

                </div>

                <LinkImageBlock links={currentQuestion?.links} name="options" />

                <div className="mt-2 space-y-2.5">

                    {
                        options.map(
                            (option: any, index: number) => {

                                const prompt =
                                    getPromptValue(option)
                                const currentSelected =
                                    savedPrompt
                                const isSelected =
                                    answerIncludes(currentSelected, prompt)
                                const isCorrectOption =
                                    isSubmitted &&
                                    answerIncludes(correctAnswer, prompt)

                                const isWrongSelected =
                                    isSubmitted &&
                                    answerIncludes(selectedAnswer, prompt) &&
                                    !answerEquals(selectedAnswer, correctAnswer)
                                return (

                                    <label
                                        key={`${prompt}-${index}`}
                                        className={`
    flex
    w-full
    cursor-pointer
    items-center
    gap-3
    rounded-xl
    px-4
    py-2
    text-xs
    transition-colors
    md:text-sm

    ${isSubmitted
                                                ? isCorrectOption
                                                    ? `
                    border-2
                    border-green-600
                    bg-green-50
                    text-green-800
                `
                                                    : isWrongSelected
                                                        ? `
                        border-2
                        border-red-600
                        bg-red-50
                        text-red-700
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
                                                    type={question?.isMultiAnsweres ? "checkbox" : "radio"}
                                                    name={qId}
                                                    checked={isSelected}
                                                    className="h-4 w-4 shrink-0"
                                                    onChange={() =>
                                                        useTestDataStore
                                                            .getState()
                                                            .selectOption(
                                                                qId,
                                                                prompt
                                                            )
                                                    }
                                                />
                                            )
                                        }

                                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">

                                            <div className="flex min-w-0 items-center leading-[18px]">
                                                {option.opKey && (
                                                    <span className="mr-1 shrink-0 font-normal">
                                                        {option.opKey}
                                                    </span>
                                                )}
                                                <RichValue
                                                    value={option.value}
                                                    className="leading-[18px]"
                                                />
                                            </div>

                                            {
                                                isSubmitted && isCorrectOption && (
                                                    <span className="
                ml-3
                rounded-full
                bg-green-600
                px-2
                py-1
                text-[10px]
                font-bold
                text-white
            ">
                                                        Correct
                                                    </span>
                                                )
                                            }

                                            {
                                                isSubmitted && isWrongSelected && (
                                                    <span className="
                ml-3
                rounded-full
                bg-red-600
                px-2
                py-1
                text-[10px]
                font-bold
                text-white
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

                {
                    isSubmitted && (
                        <div className="mt-2 border-t border-slate-200 pt-2">

                            <button
                                onClick={() =>
                                    setShowSolution(!showSolution)
                                }
                                className="text-xs font-bold text-blue-600"
                            >
                                {
                                    showSolution
                                        ? "Hide Detailed Solution"
                                        : "View Detailed Solution"
                                }
                            </button>

                            {
                                showSolution && (
                                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2 text-xs">

                                        <div className="grid gap-2 md:grid-cols-2">
                                            <p className="text-slate-600">
                                                Your Answer:
                                                <span className="font-bold text-red-600">
                                                    {" "}
                                                    {String(selectedAnswer ?? "")}
                                                </span>
                                            </p>

                                            <p className="text-slate-600">
                                                Correct Answer:
                                                <span className="font-bold text-green-600">
                                                    {" "}
                                                    {String(correctAnswer ?? "")}
                                                </span>
                                            </p>
                                        </div>

                                        {
                                            hasValue(solutionText) && (
                                                <div className="mt-3 rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-3 leading-relaxed text-slate-800 shadow-inner shadow-slate-200/60">
                                                    <RichValue value={solutionText} />
                                                </div>
                                            )
                                        }

                                    </div>
                                )
                            }

                        </div>
                    )
                }

            </div>

            <TestMasterButtons
                qId={qId}
            />

        </div>
    )
}
