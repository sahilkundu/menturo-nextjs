import { create } from 'zustand'


import {
    START_TEST,
    RESUME_TEST,
    SUBMIT_TEST,
    SAVE_TEST,
    FETCH_SOLUTION
} from '../../../api'
import { useTestSeriesStore } from './testSeriesStore'

// =====================================
// PAYLOADS
// =====================================
type SolutionPayload = {

    historyId: string
}
type SaveTestPayload = {

    historyId: string

    data: any

    e?: number
}
type StartTestPayload = {

    relationId: string

    testId: string

    ts: string
}

type ResumeTestPayload = {

    historyId: string
}
type ResultPayload = {

    relationId: string

    testId: string

    ts: string

    historyId: string

    data: any
}

// =====================================
// STORE TYPE
// =====================================

type TestDataStore = {
    activeQuestionIndex: number

    selectedOptions: {
        [qId: string]: number | number[]
    }
    selectOption: (
        qId: string,
        prompt: number
    ) => void

    visitQuestion: (
        qId: string
    ) => void

    saveAndNext: (
        qId: string
    ) => void

    nextQuestion: () => void
    setActiveQuestionIndex: (
        index: number
    ) => void




    prevQuestion: () => void

    clearResponse: (
        qId: string
    ) => void

    markForReview: (
        qId: string
    ) => void

    // =====================================
    // STATE
    // =====================================
    timeLeft: number

    setTimeLeft: (
        time: number
    ) => void
    loadingSolution: boolean
    isSavingProgress: boolean
    solutionError: string | null
    activeTest: any | null

    loadingStartTest: boolean

    loadingResumeTest: boolean

    startTestError: string | null

    resumeTestError: string | null
    loadingResult: boolean

    resultError: string | null
    loadingSave: boolean

    saveError: string | null
    activeSubject: string
    activeLan: string



    // =====================================
    // ACTIONS
    // =====================================
    setActiveLan: (
        language: string
    ) => void
    setActiveSubject: (
        subject: string
    ) => void
    fetchSolution: (
        payload: SolutionPayload
    ) => Promise<any>
    fetchSave: (
        payload: SaveTestPayload
    ) => Promise<any>
    fetchResult: (
        payload: ResultPayload
    ) => Promise<any>
    fetchStartTest: (
        payload: StartTestPayload
    ) => Promise<any>

    fetchResumeTest: (
        payload: ResumeTestPayload
    ) => Promise<any>

    clearActiveTest: () => void
}

// =====================================
// STORE
// =====================================

export const useTestDataStore =
    create<TestDataStore>()(

        (set, get) => ({
            timeLeft: 0,
            isSavingProgress: false,
            setTimeLeft: (time) =>
                set({
                    timeLeft: time
                }),
            activeQuestionIndex: 0,

            selectedOptions: {},
            setActiveQuestionIndex: (
                index
            ) => {

                set({
                    activeQuestionIndex: index
                })
            },

            selectOption: (qId, prompt) => {

                set((state: any) => ({

                    selectedOptions: {

                        ...state.selectedOptions,

                        [qId]: prompt
                    }
                }))
            },
            visitQuestion: (qId) => {

                set((state: any) => {

                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    return {

                        activeTest: {

                            ...state.activeTest,

                            activeQuestionHistoryObj: {

                                ...state.activeTest?.activeQuestionHistoryObj,

                                [state.activeSubject]: {

                                    ...historyObj,

                                    visited: [
                                        ...new Set([
                                            ...historyObj.visited,
                                            Number(qId)
                                        ])
                                    ],

                                    notVisited:
                                        historyObj.notVisited.filter(
                                            (id: number) =>
                                                String(id) !== String(qId)
                                        )
                                }
                            }
                        }
                    }
                })
            },
            saveAndNext: (qId) => {

                set((state: any) => {

                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    const selectedPrompt =
                        state.selectedOptions?.[qId]

                    // =====================================
                    // NO NEW ANSWER SELECTED
                    // =====================================

                    if (selectedPrompt === undefined) {

                        // check old saved answer exists
                        const alreadyAnswered =
                            historyObj?.answered?.[qId] !== undefined

                        const alreadyAnsweredAndReview =
                            historyObj?.answeredAndMarkedForReview?.[qId] !== undefined

                        // =====================================
                        // KEEP OLD ANSWER
                        // =====================================

                        if (
                            alreadyAnswered ||
                            alreadyAnsweredAndReview
                        ) {

                            return {}
                        }

                        // =====================================
                        // TRULY NOT ANSWERED
                        // =====================================

                        return {

                            activeTest: {

                                ...state.activeTest,

                                activeQuestionHistoryObj: {

                                    ...state.activeTest.activeQuestionHistoryObj,

                                    [state.activeSubject]: {

                                        ...historyObj,

                                        markedForReview:
                                            historyObj.markedForReview.filter(
                                                (id: number) =>
                                                    String(id) !== String(qId)
                                            ),

                                        notAnswered: [
                                            ...new Set([
                                                ...historyObj.notAnswered,
                                                Number(qId)
                                            ])
                                        ]
                                    }
                                }
                            }
                        }
                    }

                    // =====================================
                    // ANSWERED
                    // =====================================

                    const updatedAnsweredAndReview = {
                        ...historyObj.answeredAndMarkedForReview
                    }

                    delete updatedAnsweredAndReview[qId]

                    return {

                        activeTest: {

                            ...state.activeTest,

                            activeQuestionHistoryObj: {

                                ...state.activeTest.activeQuestionHistoryObj,

                                [state.activeSubject]: {

                                    ...historyObj,

                                    answered: {

                                        ...historyObj.answered,

                                        [qId]: selectedPrompt
                                    },

                                    answeredAndMarkedForReview:
                                        updatedAnsweredAndReview,

                                    markedForReview:
                                        historyObj.markedForReview.filter(
                                            (id: number) =>
                                                String(id) !== String(qId)
                                        ),

                                    notAnswered:
                                        historyObj.notAnswered.filter(
                                            (id: number) =>
                                                String(id) !== String(qId)
                                        ),

                                    clearResponse:
                                        (historyObj.clearResponse || []).filter(
                                            (id: number) =>
                                                String(id) !== String(qId)
                                        )
                                }
                            }
                        }
                    }
                })

                get().nextQuestion()
            },
            nextQuestion: () => {

                set((state: any) => {

                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    const total =
                        Object.keys(
                            historyObj?.qIDs || {}
                        ).length

                    if (
                        state.activeQuestionIndex >=
                        total - 1
                    ) {
                        return {}
                    }

                    return {
                        activeQuestionIndex:
                            state.activeQuestionIndex + 1
                    }
                })
            },

            prevQuestion: () => {

                set((state: any) => {

                    if (
                        state.activeQuestionIndex <= 0
                    ) {
                        return {}
                    }

                    return {
                        activeQuestionIndex:
                            state.activeQuestionIndex - 1
                    }
                })
            },

            clearResponse: (qId) => {

                set((state: any) => {

                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    const updatedAnswered = {
                        ...historyObj.answered
                    }

                    const updatedAnsweredReview = {
                        ...historyObj.answeredAndMarkedForReview
                    }

                    delete updatedAnswered[qId]
                    delete updatedAnsweredReview[qId]

                    const updatedSelectedOptions = {
                        ...state.selectedOptions
                    }

                    delete updatedSelectedOptions[qId]

                    return {

                        selectedOptions: updatedSelectedOptions,

                        activeTest: {

                            ...state.activeTest,

                            activeQuestionHistoryObj: {

                                ...state.activeTest.activeQuestionHistoryObj,

                                [state.activeSubject]: {

                                    ...historyObj,

                                    answered: updatedAnswered,

                                    answeredAndMarkedForReview:
                                        updatedAnsweredReview,

                                    markedForReview:
                                        historyObj.markedForReview.filter(
                                            (id: number) =>
                                                String(id) !== String(qId)
                                        ),

                                    notAnswered: [
                                        ...new Set([
                                            ...historyObj.notAnswered,
                                            Number(qId)
                                        ])
                                    ],

                                    clearResponse: [
                                        ...new Set([
                                            ...(historyObj.clearResponse || []),
                                            Number(qId)
                                        ])
                                    ]
                                }
                            }
                        }
                    }
                })
            },
            markForReview: (qId) => {

                set((state: any) => {

                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    const selectedPrompt =
                        state.selectedOptions?.[qId]

                    // =================================
                    // ANSWERED + REVIEW
                    // =================================

                    if (selectedPrompt !== undefined) {

                        const updatedAnswered = {
                            ...historyObj.answered
                        }

                        delete updatedAnswered[qId]

                        return {

                            activeTest: {

                                ...state.activeTest,

                                activeQuestionHistoryObj: {

                                    ...state.activeTest.activeQuestionHistoryObj,

                                    [state.activeSubject]: {

                                        ...historyObj,

                                        answered: updatedAnswered,

                                        answeredAndMarkedForReview: {

                                            ...historyObj.answeredAndMarkedForReview,

                                            [qId]: selectedPrompt
                                        },

                                        markedForReview:
                                            historyObj.markedForReview.filter(
                                                (id: number) =>
                                                    String(id) !== String(qId)
                                            ),

                                        clearResponse:
                                            (historyObj.clearResponse || []).filter(
                                                (id: number) =>
                                                    String(id) !== String(qId)
                                            )
                                    }
                                }
                            }
                        }
                    }

                    // =================================
                    // ONLY REVIEW
                    // =================================

                    // ONLY REVIEW

                    const updatedAnswered = {
                        ...historyObj.answered
                    }

                    const updatedAnsweredReview = {
                        ...historyObj.answeredAndMarkedForReview
                    }

                    delete updatedAnswered[qId]
                    delete updatedAnsweredReview[qId]

                    return {

                        activeTest: {

                            ...state.activeTest,

                            activeQuestionHistoryObj: {

                                ...state.activeTest.activeQuestionHistoryObj,

                                [state.activeSubject]: {

                                    ...historyObj,

                                    answered: updatedAnswered,

                                    answeredAndMarkedForReview:
                                        updatedAnsweredReview,

                                    markedForReview: [
                                        ...new Set([
                                            ...historyObj.markedForReview,
                                            Number(qId)
                                        ])
                                    ]
                                }
                            }
                        }
                    }
                })
                get().nextQuestion()
            },
            // =====================================
            // INITIAL STATE
            // =====================================
            activeSubject: '',
            activeLan: '',
            loadingResult: false,
            loadingSave: false,
            loadingSolution: false,

            solutionError: null,
            saveError: null,

            resultError: null,
            activeTest: null,

            loadingStartTest: false,

            loadingResumeTest: false,

            startTestError: null,

            resumeTestError: null,
            setActiveSubject: (
                subject
            ) => {

                set({
                    activeSubject: subject
                })
            },
            setActiveLan: (
                lan
            ) => {

                set({
                    activeLan: lan
                })
            },
            fetchSave: async (
                payload
            ) => {

                try {

                    set({

                        loadingSave: true,

                        saveError: null
                    })

                    // =====================================
                    // ONLY SEND historyId WHEN EXIT
                    // =====================================

                    const body = {

                        historyId:
                            payload.historyId,

                        data:
                            payload.data,

                        ...(payload.e && {
                            e: 1
                        })
                    }

                    const response =
                        await fetch(

                            SAVE_TEST,

                            {
                                method: 'POST',

                                credentials: 'include',

                                headers: {

                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(
                                    body
                                )
                            }
                        )

                    const data =
                        await response.json()

                    // =====================================
                    // FAILED
                    // =====================================

                    if (!data.success) {

                        set({

                            loadingSave: false,

                            saveError:
                                data.message ||
                                'Failed to save test'
                        })

                    }

                    // =====================================
                    // SUCCESS
                    // =====================================

                    set({

                        loadingSave: false,

                        saveError: null
                    })

                    return data

                } catch (error: any) {

                    set({

                        loadingSave: false,

                        saveError:
                            error?.message ||
                            'Something went wrong'
                    })

                    return {

                        success: false,

                        message:
                            error?.message
                    }
                }
            },
            fetchResult: async (
                payload
            ) => {

                try {

                    set({

                        loadingResult: true,

                        resultError: null
                    })

                    // =====================================
                    // API CALL
                    // =====================================

                    const response =
                        await fetch(

                            SUBMIT_TEST,

                            {
                                method: 'POST',

                                credentials: 'include',

                                headers: {

                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(
                                    payload
                                )
                            }
                        )

                    const data =
                        await response.json()

                    // =====================================
                    // FAILED
                    // =====================================

                    if (!data.success) {

                        set({

                            loadingResult: false,

                            resultError:
                                data.message ||
                                'Failed to get result'
                        })

                        return data
                    }

                    // =====================================
                    // RESULT DATA
                    // =====================================

                    const result =
                        data?.result || {}

                    // =====================================
                    // SUCCESS
                    // =====================================

                    set({

                        activeTest: {

                            questions:
                                result?.questions || {},

                            activeQuestionHistoryObj:
                                result?.activeQuestionHistoryObj || {},

                            deviceInfo:
                                result?.deviceInfo ||
                                data?.deviceInfo ||
                                {},

                            allSubj:
                                result?.allSubj || [],

                            count:
                                result?.count || 0,

                            duration:
                                result?.duration || 0,

                            maxMarks:
                                result?.maxMarks || 0,

                            obtainedMarks:
                                result?.obtainedMarks || 0,

                            totalMarks:
                                result?.totalMarks || 0,

                            time:
                                result?.time || 0,

                            solution:
                                result?.solution || {}
                        },

                        loadingResult: false,

                        resultError: null
                    })

                    return data

                } catch (error: any) {

                    set({

                        loadingResult: false,

                        resultError:
                            error?.message ||
                            'Something went wrong'
                    })

                    return {

                        success: false,

                        message:
                            error?.message
                    }
                }
            },
            fetchStartTest: async (
                payload
            ) => {

                try {

                    set({

                        loadingStartTest: true,

                        startTestError: null
                    })

                    // =====================================
                    // API CALL
                    // =====================================

                    const response =
                        await fetch(

                            START_TEST,

                            {
                                method: 'POST',

                                credentials: 'include',

                                headers: {

                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(
                                    payload
                                )
                            }
                        )

                    const data =
                        await response.json()

                    // =====================================
                    // FAILED
                    // =====================================

                    if (!data.success) {

                        set({

                            loadingStartTest: false,

                            startTestError:
                                data.message ||
                                'Failed to start test'
                        })

                        return data
                    }

                    // =====================================
                    // SUCCESS
                    // =====================================
                    // =====================================
                    // UPDATE TEST HISTORY GLOBALLY
                    // =====================================

                    if (data.history) {

                        useTestSeriesStore
                            .getState()
                            .updateTestHistory(
                                data.history
                            )
                    }
                    set({
                        activeSubject:
                            data?.test?.allSubj?.[0] || '',
                        activeLan: "en",
                        activeTest: {

                            questions:
                                data?.test?.questions || {},

                            activeQuestionHistoryObj:
                                data?.test?.activeQuestionHistoryObj || {},

                            deviceInfo:
                                data?.deviceInfo || {},


                            allSubj:
                                data?.test?.allSubj || [],

                            count:
                                data?.test?.count || 0,

                            duration:
                                data?.test?.duration || 0,

                            maxMarks:
                                data?.test?.maxMarks || 0,

                            solution: []
                        },

                        loadingStartTest: false,

                        startTestError: null
                    })

                    return data

                } catch (error: any) {

                    set({

                        loadingStartTest: false,

                        startTestError:
                            error?.message ||
                            'Something went wrong'
                    })

                    return {

                        success: false,

                        message:
                            error?.message
                    }
                }
            },

            // =====================================
            // RESUME TEST
            // =====================================

            fetchResumeTest: async (
                payload
            ) => {

                try {

                    set({

                        loadingResumeTest: true,

                        resumeTestError: null
                    })

                    // =====================================
                    // API CALL
                    // =====================================

                    const response =
                        await fetch(

                            RESUME_TEST,

                            {
                                method: 'POST',

                                credentials: 'include',

                                headers: {

                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(
                                    payload
                                )
                            }
                        )

                    const data =
                        await response.json()

                    // =====================================
                    // FAILED
                    // =====================================

                    if (!data.success) {

                        set({

                            loadingResumeTest: false,

                            resumeTestError:
                                data.message ||
                                'Failed to resume test'
                        })

                        return data
                    }

                    // =====================================
                    // SUCCESS
                    // =====================================

                    set({
                        activeSubject:
                            data?.test?.allSubj?.[0] || '',
                        activeLan: "en",
                        activeTest: {

                            questions:
                                data?.test?.questions || {},

                            activeQuestionHistoryObj:
                                data?.test?.activeQuestionHistoryObj || {},

                            deviceInfo:
                                data?.deviceInfo || {},

                            allSubj:
                                data?.test?.allSubj || [],

                            count:
                                data?.test?.count || 0,

                            duration:
                                data?.test?.duration || 0,

                            maxMarks:
                                data?.test?.maxMarks || 0,

                            solution:
                                data?.test?.solution || []
                        },

                        loadingResumeTest: false,

                        resumeTestError: null
                    })

                    return data

                } catch (error: any) {

                    set({

                        loadingResumeTest: false,

                        resumeTestError:
                            error?.message ||
                            'Something went wrong'
                    })

                    return {

                        success: false,

                        message:
                            error?.message
                    }
                }
            },
            fetchSolution: async (
                payload
            ) => {

                try {

                    set({

                        loadingSolution: true,

                        solutionError: null
                    })

                    // =====================================
                    // API CALL
                    // =====================================

                    const response =
                        await fetch(

                            FETCH_SOLUTION,

                            {
                                method: 'POST',

                                credentials: 'include',

                                headers: {

                                    'Content-Type':
                                        'application/json'
                                },

                                body: JSON.stringify(
                                    payload
                                )
                            }
                        )

                    const data =
                        await response.json()

                    // =====================================
                    // FAILED
                    // =====================================

                    if (!data.success) {

                        set({

                            loadingSolution: false,

                            solutionError:
                                data.message ||
                                'Failed to fetch solution'
                        })

                        return data
                    }

                    // =====================================
                    // RESULT DATA
                    // =====================================

                    const result =
                        data?.result || {}

                    // =====================================
                    // SUCCESS
                    // =====================================

                    set({
                        activeSubject:
                            data?.test?.allSubj?.[0] || '',
                        activeLan: "en",
                        activeTest: {

                            questions:
                                result?.questions || {},

                            activeQuestionHistoryObj:
                                result?.activeQuestionHistoryObj || {},

                            deviceInfo:
                                result?.deviceInfo ||
                                data?.deviceInfo ||
                                {},

                            allSubj:
                                result?.allSubj || [],

                            count:
                                result?.count || 0,

                            duration:
                                result?.duration || 0,

                            maxMarks:
                                result?.maxMarks || 0,

                            obtainedMarks:
                                result?.obtainedMarks || 0,

                            totalMarks:
                                result?.totalMarks || 0,

                            time:
                                result?.time || 0,

                            solution:
                                result?.solution || {}
                        },

                        loadingSolution: false,

                        solutionError: null
                    })

                    return data

                } catch (error: any) {

                    set({

                        loadingSolution: false,

                        solutionError:
                            error?.message ||
                            'Something went wrong'
                    })

                    return {

                        success: false,

                        message:
                            error?.message
                    }
                }
            },

            // =====================================
            // CLEAR ACTIVE TEST
            // =====================================

            clearActiveTest: () =>
                set({
                    activeQuestionIndex: 0,
                    selectedOptions: {},
                    activeSubject: '',
                    activeLan: '',
                    activeTest: null,

                    loadingResult: false,
                    loadingSave: false,
                    loadingSolution: false,
                    loadingStartTest: false,
                    loadingResumeTest: false,

                    solutionError: null,
                    saveError: null,
                    resultError: null,
                    startTestError: null,
                    resumeTestError: null,
                })


        }))