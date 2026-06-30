import { create } from 'zustand'

import { LOAD_TEST_CARD_METADATA } from '../../../api'

export type TestCardMetadata = {
    seriesId: string
    testId: string
    relationId: string
    totalQuestions: number
    durationSeconds: number
    fileMetadataAvailable: boolean
    lastMarks: number
    totalAttempts: number
    totalUsers: number
    averageScore: number
    rank: number
    rankedUsers: number
    hasRank: boolean
    languages: string[]
}

type TestCardMetadataStore = {
    metadataByKey: Record<string, TestCardMetadata>
    loadingByKey: Record<string, boolean>
    errorByKey: Record<string, string | null>
    fetchedAtByKey: Record<string, number>
    fetchMetadata: (
        seriesId: string,
        testId: string,
        relationId?: string,
        force?: boolean
    ) => Promise<void>
    applyLifetimeStats: (
        seriesId: string,
        testId: string,
        totalAttempts: number,
        totalUsers: number
    ) => void
    refreshRanking: (
        seriesId: string,
        testId: string,
        averageScore: number,
        rankedUsers: number
    ) => void
    refreshMetadata: (
        seriesId: string,
        testId: string
    ) => void
}

const CACHE_TTL_MS = 8000
const inFlightRequests = new Map<string, Promise<void>>()

export const getTestCardMetadataKey = (
    seriesId: string,
    testId: string
) => `${seriesId}:${testId}`

export const useTestCardMetadataStore =
    create<TestCardMetadataStore>((set, get) => ({
        metadataByKey: {},
        loadingByKey: {},
        errorByKey: {},
        fetchedAtByKey: {},

        applyLifetimeStats: (
            seriesId,
            testId,
            totalAttempts,
            totalUsers
        ) => {
            const key =
                getTestCardMetadataKey(seriesId, testId)

            set((state) => {
                const current = state.metadataByKey[key]

                if (!current) {
                    return state
                }

                return {
                    metadataByKey: {
                        ...state.metadataByKey,
                        [key]: {
                            ...current,
                            totalAttempts: Math.max(
                                current.totalAttempts,
                                Number(totalAttempts || 0)
                            ),
                            totalUsers: Math.max(
                                current.totalUsers,
                                Number(totalUsers || 0)
                            )
                        }
                    }
                }
            })
        },

        refreshRanking: (
            seriesId,
            testId,
            averageScore,
            rankedUsers
        ) => {
            const key =
                getTestCardMetadataKey(seriesId, testId)
            const current = get().metadataByKey[key]

            if (!current) {
                return
            }

            set((state) => ({
                metadataByKey: {
                    ...state.metadataByKey,
                    [key]: {
                        ...current,
                        averageScore: Number(averageScore || 0),
                        rankedUsers: Number(rankedUsers || 0)
                    }
                }
            }))

            void get().fetchMetadata(
                seriesId,
                testId,
                current.relationId,
                true
            )
        },

        refreshMetadata: (
            seriesId,
            testId
        ) => {
            const key =
                getTestCardMetadataKey(seriesId, testId)

            if (!get().metadataByKey[key]) {
                return
            }

            void get().fetchMetadata(
                seriesId,
                testId,
                get().metadataByKey[key].relationId,
                true
            )
        },

        fetchMetadata: async (
            seriesId,
            testId,
            relationId = '',
            force = false
        ) => {
            if (!seriesId || !testId) {
                return
            }

            const key =
                getTestCardMetadataKey(seriesId, testId)
            const fetchedAt =
                get().fetchedAtByKey[key] || 0

            if (
                !force &&
                get().metadataByKey[key] &&
                Date.now() - fetchedAt < CACHE_TTL_MS
            ) {
                return
            }

            const existingRequest =
                inFlightRequests.get(key)
            if (existingRequest) {
                return existingRequest
            }

            const request = (async () => {
                set((state) => ({
                    loadingByKey: {
                        ...state.loadingByKey,
                        [key]: true
                    },
                    errorByKey: {
                        ...state.errorByKey,
                        [key]: null
                    }
                }))

                try {
                    const response = await fetch(
                        LOAD_TEST_CARD_METADATA,
                        {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                seriesId,
                                testId,
                                relationId
                            })
                        }
                    )
                    const data = await response.json()

                    if (!response.ok || !data?.success) {
                        throw new Error(
                            data?.message ||
                            'Unable to load test metadata'
                        )
                    }

                    const metadata = data.metadata || {}
                    const totalQuestions = Number(
                        metadata.totalQuestions || 0
                    )
                    const durationSeconds = Number(
                        metadata.durationSeconds || 0
                    )
                    const fileMetadataAvailable =
                        typeof metadata.fileMetadataAvailable === 'boolean'
                            ? metadata.fileMetadataAvailable
                            : totalQuestions > 0 || durationSeconds > 0

                    set((state) => ({
                        metadataByKey: {
                            ...state.metadataByKey,
                            [key]: {
                                seriesId,
                                testId,
                                relationId: String(
                                    metadata.relationId || relationId
                                ),
                                totalQuestions,
                                durationSeconds,
                                fileMetadataAvailable,
                                lastMarks: Number(
                                    metadata.lastMarks || 0
                                ),
                                totalAttempts: Number(
                                    Math.max(
                                        metadata.totalAttempts || 0,
                                        state.metadataByKey[key]
                                            ?.totalAttempts || 0
                                    )
                                ),
                                totalUsers: Number(
                                    Math.max(
                                        metadata.totalUsers || 0,
                                        state.metadataByKey[key]
                                            ?.totalUsers || 0
                                    )
                                ),
                                averageScore: Number(
                                    metadata.averageScore || 0
                                ),
                                rank: Number(
                                    metadata.rank || 0
                                ),
                                rankedUsers: Number(
                                    metadata.rankedUsers || 0
                                ),
                                hasRank:
                                    metadata.hasRank === true,
                                languages: Array.isArray(
                                    metadata.languages
                                )
                                    ? metadata.languages.map(String)
                                    : []
                            }
                        },
                        fetchedAtByKey: {
                            ...state.fetchedAtByKey,
                            [key]: Date.now()
                        }
                    }))
                } catch (error) {
                    set((state) => ({
                        errorByKey: {
                            ...state.errorByKey,
                            [key]: error instanceof Error
                                ? error.message
                                : 'Unable to load test metadata'
                        }
                    }))
                } finally {
                    set((state) => ({
                        loadingByKey: {
                            ...state.loadingByKey,
                            [key]: false
                        }
                    }))
                    inFlightRequests.delete(key)
                }
            })()

            inFlightRequests.set(key, request)
            return request
        }
    }))
