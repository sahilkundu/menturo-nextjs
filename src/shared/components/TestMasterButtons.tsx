'use client'

import { useTestDataStore } from "../store/testDataStore"
import { useTestSeriesStore } from "../store/testSeriesStore"

export default function TestMasterButtons({

    qId,

}: any) {

    const {

        selectedOptions,
        prevQuestion,
        clearResponse,
        markForReview,
        saveAndNext

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

                        markForReview(qId)

                    }}
                    className="bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                    Mark for Review & Next
                </button>

                <button
                    onClick={() => {

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
                    onClick={async () => {

                        saveAndNext(qId)

                        // =================================
                        // FLOOD BLOCK
                        // =================================

                        const store =
                            useTestDataStore.getState()

                        if (
                            store.loadingSave
                        ) {
                            return
                        }

                        // =================================
                        // ACTIVE DATA
                        // =================================

                        const activeSubject =
                            store.activeSubject

                        const history =
                            store.activeTest
                                ?.activeQuestionHistoryObj

                        // =================================
                        // GET historyId
                        // =================================

                        const testsMap =
                            useTestSeriesStore
                                .getState()
                                .testsMap

                        let historyId = ''

                        Object.values(
                            testsMap
                        ).forEach((tests: any) => {

                            tests.forEach((test: any) => {

                                const runningHistory =
                                    test?.history?.find(
                                        (h: any) =>
                                            h.status ===
                                            'running'
                                    )

                                if (
                                    runningHistory
                                ) {

                                    historyId =
                                        runningHistory._id
                                }
                            })
                        })

                        // =================================
                        // NO historyId
                        // =================================

                        if (!historyId) {
                            return
                        }

                        // =================================
                        // SEND SAVE
                        // =================================

                        await store.fetchSave({

                            historyId,

                            data: {

                                [activeSubject]: {

                                    ...history[
                                    activeSubject
                                    ],

                                    activeIndex:
                                        store.activeQuestionIndex,

                                    language:
                                        store.activeLan
                                }
                            }
                        })

                    }}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700"
                >
                    Save & Next
                </button>

            </div>

        </div>
    )
}