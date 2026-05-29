'use client'

import { useEffect } from "react"
import { useTestDataStore } from "../store/testDataStore"

export default function TestTimer() {

    const {

        activeTest,
        timeLeft,
        setTimeLeft,
        isSubmitted

    } = useTestDataStore()

    // INITIALIZE TIMER
    useEffect(() => {

        if (
            activeTest?.duration &&
            timeLeft === 0 &&
            !isSubmitted
        ) {

            setTimeLeft(
                activeTest.duration
            )
        }

    }, [
        activeTest,
        timeLeft,
        setTimeLeft,
        isSubmitted
    ])

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