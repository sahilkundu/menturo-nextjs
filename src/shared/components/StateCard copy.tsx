'use client'

import { useState } from "react"

interface ExamCardProps {
    title: string
    posts: string
    btnText?: string
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

    const [selectedState, setSelectedState] = useState(states[0]?.value)

    const activeState = states.find(
        (state) => state.value === selectedState
    )

    return (
        <>
            <div className="mt-10">

                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-5">

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
                            border-gray-200
                            bg-white
                            outline-none
                            font-medium
                            text-gray-700
                            focus:border-violet-400
                            focus:ring-2
                            focus:ring-violet-200
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
                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-5
                        transition-all
                        duration-300
                    "
                >

                    {
                        activeState?.exams.map((exam, index) => (

                            <div
                                key={index}
                                className="
                                    rounded-[28px]
                                    border
                                    border-gray-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:shadow-lg
                                "
                            >

                                {/* TOP */}
                                <div className="flex items-center justify-between mb-5">

                                    <span
                                        className="
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-green-100
                                            text-green-700
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Active
                                    </span>

                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>

                                </div>

                                {/* TITLE */}
                                <h3 className="text-2xl font-black text-gray-900 mb-2">
                                    {exam.title}
                                </h3>

                                {/* POSTS */}
                                <p className="text-gray-500 mb-6">
                                    {exam.posts} Posts
                                </p>

                                {/* BUTTON */}
                                <button
                                    className="
                                        w-full
                                        h-12
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-violet-600
                                        to-purple-500
                                        text-white
                                        font-bold
                                        transition
                                        hover:opacity-90
                                        cursor-pointer
                                    "
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