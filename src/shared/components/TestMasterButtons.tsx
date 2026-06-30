'use client'

import { useTestDataStore } from "../store/testDataStore"

export default function TestMasterButtons({

    qId,

}: any) {

    const prevQuestion =
        useTestDataStore(
            (state) => state.prevQuestion
        )
    const clearResponse =
        useTestDataStore(
            (state) => state.clearResponse
        )
    const markForReview =
        useTestDataStore(
            (state) => state.markForReview
        )
    const saveAndNext =
        useTestDataStore(
            (state) => state.saveAndNext
        )
    const scheduleProgressSave =
        useTestDataStore(
            (state) => state.scheduleProgressSave
        )
    const isSubmitted =
        useTestDataStore(
            (state) => state.isSubmitted
        )
    const activeQuestionIndex =
        useTestDataStore(
            (state) => state.activeQuestionIndex
        )
    const loadingSave =
        useTestDataStore(
            (state) => state.loadingSave
        )
    const loadingResult =
        useTestDataStore(
            (state) => state.loadingResult
        )
    const isFirstQuestion =
        activeQuestionIndex <= 0

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

            <div className="flex w-full flex-col gap-2 text-[11px] font-bold md:flex-row md:items-center md:justify-between">
                {!isSubmitted &&
                    <div className="flex w-full flex-wrap items-center justify-between gap-2 md:w-auto md:justify-start">
                        <button
                            onClick={() => {

                                markForReview(qId)

                            }}
                            className="min-h-9 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                        >
                            Mark for Review
                        </button>

                        <button
                            onClick={() => {

                                clearResponse(qId)

                            }}
                            className="min-h-9 rounded-xl border border-red-200 bg-white px-3 py-2 text-red-500 hover:bg-red-50"
                        >
                            Clear Response
                        </button>
                    </div>

                }
                <div className="flex w-full flex-wrap items-center justify-between gap-2 md:ml-auto md:w-auto md:justify-end">
                    <button
                        onClick={() => {
                            if (isFirstQuestion) {
                                return
                            }

                            prevQuestion()
                        }}
                        disabled={isFirstQuestion}
                        aria-disabled={isFirstQuestion}
                        className={`
                            min-h-9
                            rounded-xl
                            px-4
                            py-2
                            text-white
                            transition-all
                            ${isFirstQuestion
                                ? 'cursor-not-allowed bg-slate-400/70 opacity-55 blur-[0.35px] saturate-50'
                                : 'bg-slate-700 hover:bg-slate-800 active:scale-[0.98]'
                            }
                        `}
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => {
                            const store =
                                useTestDataStore.getState()

                            if (
                                store.loadingSave ||
                                store.loadingResult
                            ) {
                                return
                            }

                            saveAndNext(qId)

                            if (store.isSubmitted) {
                                return
                            }

                            scheduleProgressSave()

                        }}
                        disabled={loadingSave || loadingResult}
                        className="min-h-9 rounded-xl bg-emerald-600 px-5 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    >
                        {loadingSave ? 'Saving...' : 'Save & Next'}
                    </button>
                </div>

            </div>

        </div>
    )
}
