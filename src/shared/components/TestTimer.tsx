'use client'

import { useEffect } from "react"
import { useTestDataStore } from "../store/testDataStore"
import { useTestSeriesStore } from "../store/testSeriesStore"
import {
    hideTestActionLoader,
    showTestActionLoader,
} from "../utils/testActionLoader"

export function TestTimerController() {

    const activeTest =
        useTestDataStore((state) => state.activeTest)
    const timeLeft =
        useTestDataStore((state) => state.timeLeft)
    const setTimeLeft =
        useTestDataStore((state) => state.setTimeLeft)
    const isSubmitted =
        useTestDataStore((state) => state.isSubmitted)
    const fetchResult =
        useTestDataStore((state) => state.fetchResult)
    const activeSubject =
        useTestDataStore((state) => state.activeSubject)
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

            showTestActionLoader("Loading Solution")

            try {
                await fetchResult(payload)
            } finally {
                hideTestActionLoader()
            }
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

    }, [
        activeTest?.duration,
        timeLeft,
        isSubmitted,
        setTimeLeft
    ])

    // START TIMER
    useEffect(() => {

        // STOP TIMER AFTER SUBMIT
        if (isSubmitted) return

        const timer =
            setInterval(() => {

                useTestDataStore.setState(
                    (state: any) => {
                        if (state.timeLeft <= 0) {
                            return state
                        }

                        return {
                            timeLeft:
                                state.timeLeft - 1
                        }
                    }
                )

            }, 1000)

        return () =>
            clearInterval(timer)

    }, [
        isSubmitted
    ])

    return null
}

export default function TestTimer() {

    const timeLeft =
        useTestDataStore((state) => state.timeLeft)

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
