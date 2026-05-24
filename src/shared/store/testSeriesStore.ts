// store/testSeriesStore.ts

import { create } from 'zustand'
import { LOAD_ONE_SERIES, LOAD_SERIES, LOAD_TESTS, LOAD_TESTS_BY_SUB, START_TEST } from '../../../api'

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
        seriesId: string,
        userId?: string | null
    ) => Promise<any | null>

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

        // ======================================================
        // FETCH SERIES
        // ======================================================
        // ======================================================
        // FETCH SINGLE SERIES
        // ======================================================
        // ======================================================
        // FETCH TESTS BY SUBJECT
        // ======================================================

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
                                    (item: any) => [
                                        item._id,
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
        fetchSingleSeries: async (seriesId, userId) => {
            // Early return if no seriesId
            if (!seriesId) {
                console.error('No seriesId provided')
                set({ loadingSeries: false })
                return null
            }

            // Check if already in store to avoid unnecessary fetch
            const state = get()
            if (state.seriesMap[seriesId]) {
                console.log('Series already in cache:', seriesId)
                return state.seriesMap[seriesId]
            }

            set({ loadingSeries: true })

            try {
                const response = await fetch(LOAD_ONE_SERIES, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        seriesId,
                        userId

                    })
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }

                const data = await response.json()

                if (!data?.series) {
                    console.error('No series in response:', data)
                    set({ loadingSeries: false })
                    return null
                }

                // Ensure the ID matches what we requested
                if (data.series._id !== seriesId) {
                    console.warn(`Returned series ID ${data.series._id} doesn't match requested ${seriesId}`)
                }

                set((state) => ({
                    seriesMap: {
                        ...state.seriesMap,
                        [data.series._id]: data.series
                    },
                    loadingSeries: false
                }))

                return data.series
            } catch (error) {
                console.error('Error fetching series:', error)
                set({ loadingSeries: false })
                return null
            }
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
                            data.series[
                            i
                            ]

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
                                        item._id,
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
        }
    }))