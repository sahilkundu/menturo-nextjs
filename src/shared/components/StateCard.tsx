'use client'

import { useState } from "react"

interface ExamCardProps {

    status?: string
    statusBg?: string
    statusText?: string

    title: string
    posts: string

    btnText?: string

    btnBg?: string
    btnHover?: string

    dotColor?: string
}

interface StateDataProps {

    stateName: string
    value: string

    exams: ExamCardProps[]
}

interface StateCardProps {

    states: StateDataProps[]
}

export default function StateCard({
    states
}: StateCardProps) {

    const [selectedState, setSelectedState] = useState(
        states[0]?.value
    )

    const activeState = states.find(
        (state) => state.value === selectedState
    )

    return (
        <>

            <div className="mt-10">

                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-3">

                    <div>

                        <h2 className="text-2xl font-black flex items-center gap-2">

                            <i className="fas fa-map-marked-alt text-indigo-500 text-2xl"></i>

                            State Wise Exams

                        </h2>

                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">

                            <i className="fas fa-arrow-right text-xs"></i>

                            Select your state & grab

                            <span className="font-bold text-amber-600">
                                🔥 Buy 1 Get 1 Demo Free
                            </span>

                        </p>

                    </div>

                    {/* SELECT */}
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="
                            h-12
                            px-5
                            rounded-2xl
                            border-2
                            border-violet-300
                            bg-white
                            shadow-[0_0_0_3px_rgba(139,92,246,0.15)]
                            outline-none
                            font-medium
                            text-gray-700
                            transition
                        "
                    >

                        {
                            states.map((state, index) => (

                                <option
                                    key={index}
                                    value={state.value}
                                >
                                    {state.stateName}
                                </option>

                            ))
                        }

                    </select>

                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {
                        activeState?.exams.map((exam, index) => (

                            <div
                                key={index}
                                className="
        rounded-[24px]
        border
        border-gray-200
        bg-[#f8f8fb]

        px-4
        py-4

        md:min-h-[170px]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-lg
    "
                            >

                                {/* TOP */}
                                <div className="flex items-center justify-between mb-3">

                                    <span
                                        className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            text-xs
                                            font-semibold

                                            ${exam.statusBg}
                                            ${exam.statusText}
                                        `}
                                    >
                                        {exam.status}
                                    </span>

                                    <div
                                        className={`
                                            w-3
                                            h-3
                                            rounded-full

                                            ${exam.dotColor}
                                        `}
                                    ></div>

                                </div>

                                {/* TITLE */}
                                <h3 className="text-[14px] font-black text-gray-900 leading-9 mb-1">

                                    {exam.title}

                                </h3>

                                {/* POSTS */}
                                <p className="text-gray-500 mb-5">

                                    {exam.posts} Posts

                                </p>

                                {/* BUTTON */}
                                <button
                                    className={`
        w-full
        h-8
        rounded-2xl
        text-white
        text-sm
        transition
        cursor-pointer

        ${exam.btnBg}
        ${exam.btnHover}
    `}
                                >
                                    {exam.btnText || "Apply Now"}
                                </button>

                            </div>

                        ))
                    }

                </div>

            </div>

        </>
    )
}