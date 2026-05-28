'use client'

import { useTestDataStore } from "../store/testDataStore"

export default function TestMasterButtons({

    qId,
    tempSelections,
    setTempSelections

}: any) {

    const {

        selectOption,
        prevQuestion,
        clearResponse,
        markForReview

    } = useTestDataStore()

    return (

        <div
            className="
                sticky
                bottom-0
                left-0
                right-0
                border-t
                border-slate-200
                bg-white
                p-3
                z-20
                shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
            "
        >

            <div className="flex flex-wrap gap-2 w-full text-[11px] font-bold">

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
                    className="bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                    Mark for Review & Next
                </button>

                <button
                    onClick={() => {

                        setTempSelections((prev: any) => {

                            const updated = {
                                ...prev
                            }

                            delete updated[qId]

                            return updated
                        })

                        clearResponse(qId)

                    }}
                    className="bg-white border border-red-200 text-red-500 px-3 py-2 rounded-xl hover:bg-red-50"
                >
                    Clear Response
                </button>

                <button
                    onClick={prevQuestion}
                    className="ml-auto bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                >
                    Previous
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
                    className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700"
                >
                    Save & Next ✓
                </button>

            </div>

        </div>
    )
}