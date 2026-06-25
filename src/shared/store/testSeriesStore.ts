// store/testSeriesStore.ts

import { create } from 'zustand'
import { LOAD_ONE_SERIES, LOAD_SERIES, LOAD_TESTS, LOAD_TESTS_BY_SUB, START_TEST } from '../../../api'
import { useUserStore } from './user'

// ======================================================
// TYPES
// ======================================================

export interface Pagination {

    currentPage: number


    limit: number

    loaded: number

    remaining: number

    total: number

    hasMore: boolean
}

export interface Config {

    testIdKey: string

    seriesIdKey: string

    buttonKey: string

    availableKey: string
}

const getSeriesId = (
    series: any
) => {
    if (typeof series?._id === 'string') {
        return series._id
    }

    if (typeof series?._id?.$oid === 'string') {
        return series._id.$oid
    }

    return ''
}

const attachSeriesAccess = (
    series: any,
    accessMap?: Record<string, any>
) => {
    const seriesId =
        getSeriesId(series)

    const fallbackAccess =
        useUserStore.getState().access

    const access =
        accessMap?.[seriesId] ||
        fallbackAccess?.[seriesId] ||
        series?.access

    const plans =
        Array.isArray(access?.plans)
            ? access.plans
            : series?.plans

    return {
        ...series,
        _id: seriesId || series?._id,
        access,
        // Custom plans are decided on the server for this user + series.
        // Rendering them from access prevents the public TS plan from
        // overwriting the authorised custom price.
        plans
    }
}

const attachAccessToSeriesMap = (
    seriesMap: Record<string, any>,
    accessMap?: Record<string, any>
) => {
    const hasProvidedAccessMap =
        accessMap !== undefined

    const fallbackAccess =
        useUserStore.getState().access

    const activeAccessMap =
        accessMap || fallbackAccess

    if (!activeAccessMap) {
        return seriesMap
    }

    const updatedSeriesMap:
        Record<string, any> = {}

    Object.entries(seriesMap)
        .forEach(([key, series]) => {
            const seriesId =
                getSeriesId(series) || key

            const seriesAccess =
                hasProvidedAccessMap
                    ? activeAccessMap?.[seriesId]
                    : activeAccessMap?.[seriesId] ||
                    series?.access

            updatedSeriesMap[key] = {
                ...series,
                access: seriesAccess,
                plans:
                    Array.isArray(seriesAccess?.plans)
                        ? seriesAccess.plans
                        : series?.plans
            }
        })

    return updatedSeriesMap
}

interface Store {

    // ======================================================
    // STATE
    // ======================================================

    // ALL SERIES
    testsPaginationBySubject:
    Record<
        string,
        Record<string, Pagination>
    >
    seriesMap: Record<
        string,
        any
    >

    // TESTS OF SERIES
    testsMap: Record<
        string,
        any[]
    >
    testsBySubjectMap: Record<
        string,
        Record<string, any[]>
    >

    // PAGINATION PER TAG
    seriesPaginationByTag:
    Record<
        string,
        Pagination
    >

    // PAGINATION PER SERIES
    testsPaginationBySeries:
    Record<
        string,
        Pagination
    >

    // BACKEND CONFIG
    config: Config | null

    // SELECTED
    selectedTag: string | null

    selectedSeriesId:
    string | null

    // LOADING
    loadingSeries: boolean

    loadingTests: boolean
    isFetchingMore: boolean

    // ======================================================
    // FUNCTIONS
    // ======================================================
    fetchTestsBySubject: (
        seriesId: string,
        subject: string,
        params?: {
            page?: number
            limit?: number
        }
    ) => Promise<void>
    // SERIES
    fetchSeries: (

        params?: {

            tag?: string

            page?: number

            limit?: number
        }

    ) => Promise<void>

    fetchSingleSeries: (
        seriesId: string
    ) => Promise<any | null>

    refreshSeriesAccess: (
        accessMap?: Record<string, any>
    ) => void

    // TESTS
    fetchTests: (

        seriesId: string,

        params?: {

            page?: number

            limit?: number
        }

    ) => Promise<void>

    // SELECT
    selectTag: (
        tag: string
    ) => void

    selectSeries: (
        seriesId: string
    ) => void

    // START TEST
    startTest: (
        test: any
    ) => Promise<void>
    updateTestHistory: (
        history: any,
        update?: any
    ) => void
    // CLEAR
    clearStore: () => void
}

// ======================================================
// STORE
// ======================================================

export const useTestSeriesStore =
    create<Store>((set, get) => ({

        // ======================================================
        // INITIAL
        // ======================================================

        seriesMap: {},
        testsPaginationBySubject: {},
        testsMap: {},

        testsBySubjectMap: {},

        seriesPaginationByTag: {},

        testsPaginationBySeries: {},

        config: null,

        selectedTag: null,

        selectedSeriesId: null,

        loadingSeries: false,

        loadingTests: false,
        isFetchingMore: false,

        // ======================================================
        // SELECT TAG
        // ======================================================

        selectTag: (
            tag
        ) => {

            set({
                selectedTag:
                    tag
                        .trim()
                        .toLowerCase()
            })
        },
        updateTestHistory: (
            history,
            update = {}
        ) => {

            set((state) => {
                const updatedTestId =
                    update?.testId ||
                    history?.testId

                const explicitAttemptUsed =
                    Number(
                        update?.attemptUsed ??
                        history?.attemptUsed
                    )

                const explicitAttemptLimit =
                    Number(
                        update?.attemptLimit ??
                        history?.attemptLimit
                    )

                const historyAttempt =
                    Number(
                        history?.attempt ??
                        history?.an ??
                        0
                    )

                const applyLiveTestUpdate = (
                    test: any
                ) => {
                    if (
                        !updatedTestId ||
                        test.testId !==
                        updatedTestId
                    ) {
                        return test
                    }

                    const currentAttemptUsed =
                        Number(test?.attemptUsed || 0)

                    const nextAttemptUsed =
                        Number.isFinite(explicitAttemptUsed)
                            ? explicitAttemptUsed
                            : historyAttempt > 0
                                ? Math.max(
                                    currentAttemptUsed,
                                    historyAttempt
                                )
                                : currentAttemptUsed

                    const nextAttemptLimit =
                        Number.isFinite(explicitAttemptLimit)
                            ? explicitAttemptLimit
                            : test?.attemptLimit

                    const filteredHistory =
                        history?._id
                            ? (
                                test.history || []
                            ).filter(
                                (h: any) =>
                                    h._id !==
                                    history._id
                            )
                            : test.history || []

                    return {

                        ...test,

                        attemptUsed:
                            nextAttemptUsed,

                        attemptLimit:
                            nextAttemptLimit,

                        history:
                            history?._id
                                ? [

                                    history,

                                    ...filteredHistory
                                ]
                                : filteredHistory
                    }
                }

                // =====================================
                // UPDATE testsMap
                // =====================================

                const updatedTestsMap = {
                    ...state.testsMap
                }

                Object.keys(
                    updatedTestsMap
                ).forEach((seriesId) => {

                    updatedTestsMap[
                        seriesId
                    ] =
                        updatedTestsMap[
                            seriesId
                        ].map(applyLiveTestUpdate)
                })

                // =====================================
                // UPDATE testsBySubjectMap
                // =====================================

                const updatedSubjectMap = {
                    ...state.testsBySubjectMap
                }

                Object.keys(
                    updatedSubjectMap
                ).forEach((seriesId) => {

                    Object.keys(
                        updatedSubjectMap[
                        seriesId
                        ]
                    ).forEach((subject) => {

                        updatedSubjectMap[
                            seriesId
                        ][subject] =
                            updatedSubjectMap[
                                seriesId
                            ][subject].map(
                                applyLiveTestUpdate
                            )
                    })
                })

                return {

                    testsMap:
                        updatedTestsMap,

                    testsBySubjectMap:
                        updatedSubjectMap
                }
            })
        },

        // ======================================================
        // SELECT SERIES
        // ======================================================

        selectSeries: (
            seriesId
        ) => {

            set({
                selectedSeriesId:
                    seriesId
            })
        },


        fetchTestsBySubject: async (
            seriesId,
            subject,
            params: any = {}
        ) => {

            const {
                page = 1,
                limit = 3
            } = params

            try {

                const normalizedSubject =
                    subject
                        .trim()
                        .toLowerCase()

                set({

                    loadingTests:
                        page === 1,

                    isFetchingMore:
                        page > 1
                })

                const response =
                    await fetch(
                        LOAD_TESTS_BY_SUB,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },
                            credentials: "include",
                            body: JSON.stringify({

                                seriesId,

                                subject:
                                    normalizedSubject,

                                page,

                                limit
                            })
                        }
                    )

                const data =
                    await response.json()

                set((state) => {

                    const oldTests =
                        state.testsBySubjectMap[
                        seriesId
                        ]?.[
                        normalizedSubject
                        ] || []

                    const mergedTests = [

                        ...oldTests,

                        ...data.tests
                    ]

                    // REMOVE DUPLICATES
                    const uniqueTests =
                        Array.from(

                            new Map(

                                mergedTests.map(
                                    (item: any, index) => [
                                        item.testId,
                                        item
                                    ]
                                )

                            ).values()
                        )
                    return {

                        testsBySubjectMap: {

                            ...state.testsBySubjectMap,

                            [seriesId]: {

                                ...(state.testsBySubjectMap[
                                    seriesId
                                ] || {}),

                                [normalizedSubject]:
                                    uniqueTests
                            }
                        },

                        testsPaginationBySubject: {

                            ...state.testsPaginationBySubject,

                            [seriesId]: {

                                ...(state.testsPaginationBySubject[
                                    seriesId
                                ] || {}),

                                [normalizedSubject]:
                                    data.pagination
                            }
                        },

                        config:
                            data.config,

                        loadingTests:
                            false,

                        isFetchingMore:
                            false
                    }
                })
            }

            catch (error) {

                console.error(error)

                set({

                    loadingTests: false,

                    isFetchingMore: false
                })
            }
        },
        fetchSingleSeries: async (seriesId) => {

            if (!seriesId) {

                set({
                    loadingSeries: false
                })

                return null
            }

            const state = get()

            // Already cached
            if (state.seriesMap[seriesId]) {
                const seriesWithFreshAccess =
                    attachSeriesAccess(
                        state.seriesMap[seriesId]
                    )

                set((currentState) => ({
                    seriesMap: {
                        ...currentState.seriesMap,
                        [seriesId]: seriesWithFreshAccess
                    }
                }))

                return seriesWithFreshAccess
            }

            set({
                loadingSeries: true
            })

            try {

                const response =
                    await fetch(
                        LOAD_ONE_SERIES,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            credentials: 'include',

                            body: JSON.stringify({
                                seriesId
                            })
                        }
                    )

                const data =
                    await response.json()

                if (!data?.series) {

                    set({
                        loadingSeries: false
                    })

                    return null
                }

                const seriesWithAccess =
                    attachSeriesAccess(
                        data.series,
                        data.access
                    )

                set((state) => ({

                    seriesMap: {

                        ...state.seriesMap,

                        [seriesWithAccess._id]:
                            seriesWithAccess
                    },

                    loadingSeries: false
                }))

                return seriesWithAccess
            }

            catch (error) {

                console.error(error)

                set({
                    loadingSeries: false
                })

                return null
            }
        },
        refreshSeriesAccess: (
            accessMap
        ) => {
            set((state) => ({
                seriesMap:
                    attachAccessToSeriesMap(
                        state.seriesMap,
                        accessMap
                    )
            }))
        },
        fetchSeries: async (
            params = {}
        ) => {

            const {

                tag = '',

                page = 1,

                limit = 10

            } = params

            const normalizedTag =
                tag
                    .trim()
                    .toLowerCase()

            set({
                loadingSeries: true
            })

            try {

                // ======================================================
                // POST REQUEST
                // ======================================================

                const response =
                    await fetch(
                        LOAD_SERIES,
                        {
                            method:
                                'POST',

                            headers:
                            {
                                'Content-Type':
                                    'application/json'
                            },
                            credentials: "include",
                            body:
                                JSON.stringify({

                                    tag:
                                        normalizedTag,

                                    page,

                                    limit
                                })
                        }
                    )

                const data =
                    await response.json()

                // backend:
                //
                // {
                //   series: [],
                //   pagination: {}
                // }

                set((state) => {

                    const updatedSeries =
                    {
                        ...state
                            .seriesMap
                    }

                    // direct indexing
                    for (
                        let i = 0;
                        i <
                        data.series
                            .length;
                        i++
                    ) {

                        const item =
                            attachSeriesAccess(
                                data.series[
                                i
                                ],
                                data.access
                            )

                        updatedSeries[
                            item._id
                        ] = item
                    }

                    return {

                        seriesMap:
                            updatedSeries,

                        seriesPaginationByTag:
                        {

                            ...state
                                .seriesPaginationByTag,

                            [normalizedTag]:
                                data
                                    .pagination
                        },

                        loadingSeries:
                            false
                    }
                })
            }

            catch {

                set({
                    loadingSeries:
                        false
                })
            }
        },

        // ======================================================
        // FETCH TESTS
        // ======================================================

        fetchTests: async (

            seriesId,

            params = {}

        ) => {

            const {

                page = 1,

                limit = 10

            } = params

            // set({
            //     loadingTests: true
            // })
            set({

                loadingTests:
                    page === 1,

                isFetchingMore:
                    page > 1
            })

            try {

                // ======================================================
                // POST REQUEST
                // ======================================================

                const response =
                    await fetch(
                        LOAD_TESTS,
                        {
                            method:
                                'POST',

                            headers:
                            {
                                'Content-Type':
                                    'application/json'
                            },
                            credentials: "include",
                            body:
                                JSON.stringify({

                                    seriesId,

                                    page,

                                    limit
                                })
                        }
                    )

                const data =
                    await response.json()

                // backend:
                //
                // {
                //   tests: [],
                //   config: {},
                //   pagination: {}
                // }

                set((state) => {

                    const oldTests =
                        state.testsMap[
                        seriesId
                        ] || []

                    const mergedTests = [

                        ...oldTests,

                        ...data.tests
                    ]

                    const uniqueTests =
                        Array.from(

                            new Map(

                                mergedTests.map(
                                    (item: any) => [
                                        item.testId,
                                        item
                                    ]
                                )

                            ).values()
                        )

                    return {

                        testsMap: {

                            ...state.testsMap,

                            [seriesId]:
                                uniqueTests
                        },

                        testsPaginationBySeries: {

                            ...state.testsPaginationBySeries,

                            [seriesId]:
                                data.pagination
                        },

                        config:
                            data.config,

                        loadingTests:
                            false,

                        isFetchingMore:
                            false
                    }
                })
            }

            catch (error) {

                console.error(error)

                set({

                    loadingTests: false,

                    isFetchingMore: false
                })
            }
        },

        // ======================================================
        // START TEST
        // ======================================================

        startTest: async (
            test
        ) => {

            const state =
                get()

            if (
                !state.config
            ) return

            const config =
                state.config

            const testId =
                test[
                config
                    .testIdKey
                ]

            const seriesId =
                test[
                config
                    .seriesIdKey
                ]

            await fetch(
                START_TEST,
                {
                    method:
                        'POST',

                    headers:
                    {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({

                            testId,

                            seriesId
                        })
                }
            )
        },

        // ======================================================
        // CLEAR
        // ======================================================

        clearStore: () => {
            set({

                seriesMap: {},

                testsMap: {},

                seriesPaginationByTag:
                    {},
                testsPaginationBySubject: {},
                testsPaginationBySeries:
                    {},
                testsBySubjectMap:
                    {},

                config: null,

                selectedTag:
                    null,

                selectedSeriesId:
                    null
            })
        },
        clearTests: () => {
            set({



                testsMap: {},


                testsPaginationBySubject: {},
                testsPaginationBySeries:
                    {},
                testsBySubjectMap:
                    {}
            })
        }
    }))
