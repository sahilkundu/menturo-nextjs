'use client'

import { useEffect } from "react"
import { useTestDataStore } from "../store/testDataStore"
import { useTestSeriesStore } from "../store/testSeriesStore"

export default function TestTimer() {

    const {
        activeTest,
        timeLeft,
        setTimeLeft,
        isSubmitted,
        fetchResult,
        activeSubject

    } = useTestDataStore()
    useEffect(() => {

        if (
            timeLeft !== 0 ||
            isSubmitted
        ) {
            return
        }

        const submitTest = async () => {

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
                                    h.status === "running"
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
                                            timeLeft
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

            await fetchResult(payload)
        }

        submitTest()

    }, [
        timeLeft,
        isSubmitted,
        activeSubject,
        fetchResult
    ])

    // INITIALIZE TIMER
    useEffect(() => {

        if (
            activeTest?.duration &&
            timeLeft <= 0 &&
            !isSubmitted
        ) {

            setTimeLeft(activeTest.duration)
        }

    }, [activeTest])

    // START TIMER
    useEffect(() => {

        // STOP TIMER AFTER SUBMIT
        if (isSubmitted) return

        if (timeLeft <= 0) return

        const timer =
            setInterval(() => {

                useTestDataStore.setState(
                    (state: any) => ({

                        timeLeft:
                            state.timeLeft - 1

                    })
                )

            }, 1000)

        return () =>
            clearInterval(timer)

    }, [
        timeLeft,
        isSubmitted
    ])

    // FORMAT
    const formatTime = (
        seconds: number
    ) => {

        const hrs =
            Math.floor(seconds / 3600)

        const mins =
            Math.floor(
                (seconds % 3600) / 60
            )

        const secs =
            seconds % 60

        if (hrs > 0) {

            return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        }

        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return (
        <>
            {formatTime(timeLeft)}
        </>
    )
}