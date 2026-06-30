import { create } from 'zustand'


import {
    START_TEST,
    RESUME_TEST,
    SUBMIT_TEST,
    SAVE_TEST,
    FETCH_SOLUTION
} from '../../../api'
import { useTestSeriesStore } from './testSeriesStore'
import { showPopupMessage } from '../utils/popup'
import { useQHistoryStore } from './qHisStore'

// =====================================
// PAYLOADS
// =====================================
type SolutionPayload = {

    historyId: string
}
type SaveTestPayload = {

    historyId: string

    data: any

    time?: number

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

type SelectedOptionValue = string | number | Array<string | number>

const readJsonResponse = async (
    response: Response
) => {

    const text =
        await response.text()

    if (!text) {

        return {}
    }

    try {

        return JSON.parse(text)

    } catch {

        return {
            success: false,
            message:
                response.ok
                    ? 'Invalid server response'
                    : 'Server returned a non-JSON error response'
        }
    }
}

// =====================================
// STORE TYPE
// =====================================

type TestDataStore = {
    activeQuestionIndex: number
    isSubmitted: boolean

    selectedOptions: {
        [qId: string]: SelectedOptionValue
    }
    selectOption: (
        qId: string,
        prompt: string | number
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
    scheduleProgressSave: () => void
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
const buildSelectedOptions = (
    historyObj: any
) => {

    const selectedOptions: Record<
        string,
        SelectedOptionValue
    > = {}

    Object.values(historyObj || {}).forEach(
        (subject: any) => {

            // answered
            Object.entries(
                subject?.answered || {}
            ).forEach(([qId, value]) => {

                selectedOptions[qId] =
                    value as SelectedOptionValue
            })

            // answered + review
            Object.entries(
                subject?.answeredAndMarkedForReview || {}
            ).forEach(([qId, value]) => {

                selectedOptions[qId] =
                    value as SelectedOptionValue
            })
        }
    )

    return selectedOptions
}

const SAVE_DEBOUNCE_MS = 1000
let pendingSaveTimer: ReturnType<typeof setTimeout> | null = null
const lastSavedProgress = new Map<string, string>()
const submitInFlightByHistory = new Map<string, Promise<any>>()
const submitIdempotencyKeyByHistory = new Map<string, string>()

const createIdempotencyKey = () =>
    globalThis.crypto
        .randomUUID()
        .replace(/-/g, '')
        .slice(0, 24)

const normalizeForSignature = (value: any): any => {
    if (Array.isArray(value)) {
        return value
            .map(normalizeForSignature)
            .sort((left, right) =>
                JSON.stringify(left).localeCompare(JSON.stringify(right))
            )
    }

    if (value && typeof value === 'object') {
        return Object.keys(value)
            .sort()
            .reduce((result: Record<string, any>, key) => {
                result[key] = normalizeForSignature(value[key])
                return result
            }, {})
    }

    return value
}

const getProgressSignature = (history: any) =>
    JSON.stringify(normalizeForSignature({
        answered: history?.answered || {},
        answeredAndMarkedForReview:
            history?.answeredAndMarkedForReview || {},
        markedForReview: history?.markedForReview || [],
        notAnswered: history?.notAnswered || [],
        visited: history?.visited || [],
        notVisited: history?.notVisited || [],
        clearResponse: history?.clearResponse || []
    }))

const getProgressKey = (
    historyId: string,
    subject: string
) => `${historyId}:${subject}`

const rememberServerProgress = (
    historyId: string | undefined,
    historyObj: any
) => {
    if (!historyId) {
        return
    }

    Object.entries(historyObj || {}).forEach(
        ([subject, history]) => {
            lastSavedProgress.set(
                getProgressKey(historyId, subject),
                getProgressSignature(history)
            )
        }
    )
}
export const useTestDataStore =
    create<TestDataStore>()(

        (set, get) => ({
            timeLeft: 0,
            isSubmitted: false,
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
                if (get().isSubmitted) {
                    return
                }
                set((state: any) => {
                    const historyObj =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                        state.activeSubject
                        ]

                    const question =
                        state.activeTest?.questions?.[
                        qId
                        ]

                    const isMultiAnswer =
                        Boolean(question?.isMultiAnsweres)

                    const currentValue =
                        state.selectedOptions?.[qId]

                    const nextValue =
                        isMultiAnswer
                            ? Array.isArray(currentValue)
                                ? currentValue.some((value) => String(value) === String(prompt))
                                    ? currentValue.filter((value) => String(value) !== String(prompt))
                                    : [...currentValue, prompt]
                                : currentValue === undefined
                                    ? [prompt]
                                    : String(currentValue) === String(prompt)
                                        ? []
                                        : [currentValue, prompt]
                            : prompt

                    const nextSelectedOptions = {
                        ...state.selectedOptions,
                    }

                    if (Array.isArray(nextValue) && nextValue.length === 0) {
                        delete nextSelectedOptions[qId]
                    } else {
                        nextSelectedOptions[qId] = nextValue
                    }

                    return {

                        selectedOptions: nextSelectedOptions,

                        activeTest: historyObj
                            ? {
                                ...state.activeTest,
                                activeQuestionHistoryObj: {
                                    ...state.activeTest.activeQuestionHistoryObj,
                                    [state.activeSubject]: {
                                        ...historyObj,
                                        visited: [
                                            ...new Set([
                                                ...(historyObj.visited || []),
                                                qId
                                            ])
                                        ],
                                        notVisited:
                                            (historyObj.notVisited || []).filter(
                                                (id: string | number) =>
                                                    String(id) !== String(qId)
                                            )
                                    }
                                }
                            }
                            : state.activeTest
                    }
                })
            },
            visitQuestion: (qId) => {
                if (get().isSubmitted) {
                    return
                }
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
                if (get().isSubmitted) {

                    get().nextQuestion()

                    return
                }
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
                        total <= 0
                    ) {
                        return {}
                    }

                    return {
                        activeQuestionIndex:
                            state.activeQuestionIndex >= total - 1
                                ? 0
                                : state.activeQuestionIndex + 1
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
                if (get().isSubmitted) {
                    return
                }
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
                if (get().isSubmitted) {
                    return
                }
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

                const subject =
                    Object.keys(payload?.data || {})[0]
                const history = subject
                    ? payload.data[subject]
                    : null
                const progressKey = subject
                    ? getProgressKey(payload.historyId, subject)
                    : ''
                const progressSignature = history
                    ? getProgressSignature(history)
                    : ''

                if (
                    !payload?.e &&
                    progressKey &&
                    lastSavedProgress.get(progressKey) === progressSignature
                ) {
                    return {
                        success: true,
                        skipped: true
                    }
                }

                if (payload?.e && pendingSaveTimer) {
                    clearTimeout(pendingSaveTimer)
                    pendingSaveTimer = null
                }

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
                            payload?.historyId,
                        time:
                            payload?.time,

                        data:
                            payload?.data,

                        ...(payload?.e && {
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
                        await readJsonResponse(
                            response
                        )

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
                    } else {
                        set({
                            loadingSave: false,
                            saveError: null
                        })

                        if (progressKey) {
                            lastSavedProgress.set(
                                progressKey,
                                progressSignature
                            )
                        }
                    }

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
            scheduleProgressSave: () => {
                if (pendingSaveTimer) {
                    clearTimeout(pendingSaveTimer)
                }

                const scheduledState = get()
                const scheduledSubject =
                    scheduledState.activeSubject
                const scheduledHistoryId =
                    scheduledState.activeTest?.history?._id

                pendingSaveTimer = setTimeout(async () => {
                    pendingSaveTimer = null

                    const state = get()
                    const history =
                        state.activeTest
                            ?.activeQuestionHistoryObj?.[
                            scheduledSubject
                        ]

                    if (
                        state.isSubmitted ||
                        state.loadingResult ||
                        !scheduledHistoryId ||
                        state.activeTest?.history?._id !==
                            scheduledHistoryId ||
                        !history
                    ) {
                        return
                    }

                    await state.fetchSave({
                        historyId: scheduledHistoryId,
                        time: state.timeLeft,
                        data: {
                            [scheduledSubject]: {
                                ...history,
                                activeIndex:
                                    state.activeQuestionIndex,
                                language: state.activeLan,
                                timeLeft: state.timeLeft
                            }
                        }
                    })
                }, SAVE_DEBOUNCE_MS)
            },
            fetchResult: async (
                payload
            ) => {
                const historyId =
                    payload?.historyId || ''

                if (
                    historyId &&
                    submitInFlightByHistory.has(historyId)
                ) {
                    return submitInFlightByHistory.get(historyId)
                }

                const request = (async () => {
                    try {

                        const idempotencyKey =
                            historyId
                                ? submitIdempotencyKeyByHistory.get(historyId) ||
                                createIdempotencyKey()
                                : createIdempotencyKey()

                        if (historyId) {
                            submitIdempotencyKeyByHistory.set(
                                historyId,
                                idempotencyKey
                            )
                        }

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
                                            'application/json',
                                        'Idempotency-Key':
                                            idempotencyKey
                                    },

                                    body: JSON.stringify(
                                        {
                                            ...payload,
                                            idempotencyKey
                                        }
                                    )
                                }
                            )

                        const data =
                            await readJsonResponse(
                                response
                            )

                        // =====================================
                        // FAILED
                        // =====================================

                        if (!data.success) {

                            const retryableProcessing =
                                data.retryable === true &&
                                String(data.message || '')
                                    .toLowerCase()
                                    .includes('processing')

                            set({

                                loadingResult: false,

                                resultError:
                                    retryableProcessing
                                        ? null
                                        : data.message ||
                                        'Failed to get result'
                            })

                            if (retryableProcessing) {
                                showPopupMessage(
                                    'Submission is already processing. Please wait...',
                                    true
                                )
                            } else {
                                showPopupMessage(
                                    data.message,
                                    false
                                )
                            }

                            return data
                        }

                        // =====================================
                        // RESULT DATA
                        // =====================================
                        useQHistoryStore
                            .getState()
                            .setQHistory(data?.qHistory || {});
                        const result =
                            data?.result || {}
                        const historyObj =
                            result?.activeQuestionHistoryObj || {}

                        const selectedOptions =
                            buildSelectedOptions(historyObj)

                        // =====================================
                        // SUCCESS
                        // =====================================

                        set({
                            isSubmitted: true,
                            selectedOptions,

                            activeQuestionIndex: 0,
                            activeSubject:
                                result?.allSubj?.[0] || '',

                            activeLan: "en",
                            activeTest: {

                                questions:
                                    result?.questions || {},

                                activeQuestionHistoryObj:
                                    historyObj,
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

                        if (historyId) {
                            submitIdempotencyKeyByHistory.delete(historyId)
                        }

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
                    } finally {
                        if (historyId) {
                            submitInFlightByHistory.delete(historyId)
                        }
                    }
                })()

                if (historyId) {
                    submitInFlightByHistory.set(
                        historyId,
                        request
                    )
                }

                return request
            },
            fetchStartTest: async (
                payload
            ) => {

                try {
                    const idempotencyKey =
                        globalThis.crypto
                            .randomUUID()
                            .replace(/-/g, '')
                            .slice(0, 24)

                    set({
                        isSubmitted: false,
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
                                        'application/json',
                                    'Idempotency-Key':
                                        idempotencyKey
                                },

                                body: JSON.stringify(
                                    {
                                        ...payload,
                                        idempotencyKey
                                    }
                                )
                            }
                        )

                    const data =
                        await readJsonResponse(
                            response
                        )

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


                    // useTestSeriesStore
                    //     .getState()
                    //     .updateTestHistory(data.history)


                    // if (data.history) {

                    //     useTestSeriesStore
                    //         .getState()
                    //         .updateTestHistory(
                    //             data.history
                    //         )
                    // }
                    useQHistoryStore
                        .getState()
                        .setQHistory(data?.qHistory || {});
                    const historyObj =
                        data?.test?.activeQuestionHistoryObj || {}

                    const selectedOptions =
                        buildSelectedOptions(historyObj)

                    lastSavedProgress.clear()
                    rememberServerProgress(
                        data?.history?._id,
                        historyObj
                    )

                    set({

                        timeLeft:
                            data?.test?.duration || 0,
                        activeSubject:
                            data?.test?.allSubj?.[0] || '',

                        activeLan: "en",

                        selectedOptions,

                        activeQuestionIndex: 0,

                        activeTest: {
                            history: data?.history || null,
                            questions:
                                data?.test?.questions || {},

                            activeQuestionHistoryObj:
                                historyObj,

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
                        isSubmitted: false,

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
                    useQHistoryStore
                        .getState()
                        .setQHistory(data?.qHistory || {});
                    const historyObj =
                        data?.test?.activeQuestionHistoryObj || {}


                    const selectedOptions =
                        buildSelectedOptions(historyObj)

                    const firstSubject =
                        data?.test?.allSubj?.[0] || ''

                    const activeIndex =
                        historyObj?.[firstSubject]?.activeIndex || 0

                    const savedTimeLeft =
                        historyObj?.[firstSubject]?.timeLeft || 0

                    lastSavedProgress.clear()
                    rememberServerProgress(
                        data?.history?._id,
                        historyObj
                    )

                    set({
                        activeSubject: firstSubject,
                        timeLeft: savedTimeLeft,
                        activeLan: "en",

                        activeQuestionIndex: activeIndex,

                        selectedOptions,

                        activeTest: {
                            history: data?.history || null,

                            questions:
                                data?.test?.questions || {},

                            activeQuestionHistoryObj:
                                historyObj,

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
                    useQHistoryStore
                        .getState()
                        .setQHistory(data?.qHistory || {});
                    const result =
                        data?.result || {}
                    const historyObj =
                        result?.activeQuestionHistoryObj || {}

                    const selectedOptions =
                        buildSelectedOptions(historyObj)

                    // =====================================
                    // SUCCESS
                    // =====================================

                    const firstSubject =
                        result?.allSubj?.[0] || ''
                    const savedTimeLeft =
                        historyObj?.[firstSubject]?.timeLeft || 0
                    set({
                        isSubmitted: true,
                        timeLeft: savedTimeLeft,
                        selectedOptions,

                        activeQuestionIndex: 0,

                        activeSubject: firstSubject,

                        activeLan:
                            historyObj?.[firstSubject]?.language || "en",
                        activeTest: {

                            questions:
                                result?.questions || {},

                            activeQuestionHistoryObj:
                                historyObj,
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
            applySubmittedResult: (resultData) => {

                const result =
                    resultData?.result || {}

                const historyObj =
                    result?.activeQuestionHistoryObj || {}

                const selectedOptions =
                    buildSelectedOptions(historyObj)

                set({
                    isSubmitted: true,

                    selectedOptions,

                    activeQuestionIndex: 0,

                    activeSubject:
                        result?.allSubj?.[0] || '',

                    activeLan: "en",

                    activeTest: {

                        questions:
                            result?.questions || {},

                        activeQuestionHistoryObj:
                            historyObj,

                        deviceInfo:
                            result?.deviceInfo || {},

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
            },

            // =====================================
            // CLEAR ACTIVE TEST
            // =====================================

            clearActiveTest: () => {

                if (pendingSaveTimer) {
                    clearTimeout(pendingSaveTimer)
                    pendingSaveTimer = null
                }
                lastSavedProgress.clear()

                set({
                    isSubmitted: false,
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
                    timeLeft: 0,
                    solutionError: null,
                    saveError: null,
                    resultError: null,
                    startTestError: null,
                    resumeTestError: null,
                })
            }


        }))
