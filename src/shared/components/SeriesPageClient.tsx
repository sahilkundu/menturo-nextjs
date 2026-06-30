'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import Header from "./Header"
import TestCard from "./TestCard"
import TestCardSkeleton from "./Skeleton/TestCardSkeleton"
import AdSenseAd from "./AdSenseAd"
import { BASE_URL, LOAD_SERIES } from "../../../api"

type Pagination = {
    currentPage: number
    limit: number
    loaded: number
    remaining: number
    total: number
    hasMore: boolean
}

const PAGE_LIMIT = 12

const normalizeTag = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")

const getPlan = (series: any) =>
    Array.isArray(series?.plans) && series.plans.length > 0
        ? series.plans[0]
        : null

export default function SeriesPageClient() {
    const [series, setSeries] = useState<any[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [selectedTag, setSelectedTag] = useState("")
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState("")
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(search.trim())
        }, 350)

        return () => {
            window.clearTimeout(timer)
        }
    }, [search])

    useEffect(() => {
        let cancelled = false

        const loadTags = async () => {
            try {
                const response = await fetch(`${BASE_URL}/tags`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: "no-store"
                })

                const data = await response.json()

                if (!cancelled && Array.isArray(data?.tags)) {
                    const seenTags = new Set<string>()

                    setTags(
                        data.tags
                            .filter((tag: unknown): tag is string => (
                                typeof tag === "string" &&
                                tag.trim().length > 0
                            ))
                            .map((tag: string) => tag.trim())
                            .filter((tag: string) => {
                                const key = normalizeTag(tag)

                                if (seenTags.has(key)) {
                                    return false
                                }

                                seenTags.add(key)
                                return true
                            })
                    )
                }
            } catch {
                if (!cancelled) {
                    setTags([])
                }
            }
        }

        void loadTags()

        return () => {
            cancelled = true
        }
    }, [])

    const searchMatchedTag =
        useMemo(() => {
            const normalizedSearch =
                normalizeTag(debouncedSearch)

            if (!normalizedSearch) {
                return ""
            }

            return tags.find((tag) => {
                const normalizedTag =
                    normalizeTag(tag)

                return normalizedTag === normalizedSearch ||
                    normalizedTag.includes(normalizedSearch) ||
                    normalizedSearch.includes(normalizedTag)
            }) || ""
        }, [debouncedSearch, tags])

    const activeTag =
        searchMatchedTag ||
        selectedTag

    const activeTagKey =
        normalizeTag(activeTag)

    const fetchSeries = useCallback(async (
        page: number,
        mode: "replace" | "append"
    ) => {
        if (mode === "replace") {
            setLoading(true)
        } else {
            setLoadingMore(true)
        }

        setError("")

        try {
            const response = await fetch(LOAD_SERIES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    tag: activeTag,
                    search: debouncedSearch,
                    page,
                    limit: PAGE_LIMIT
                })
            })

            const data = await response.json()

            if (!response.ok || data?.success === false) {
                throw new Error(data?.error || "Failed to load series")
            }

            const incoming = Array.isArray(data?.series)
                ? data.series
                : []

            setSeries((current) => {
                if (mode === "replace") {
                    return incoming
                }

                const seen = new Set(current.map((item) => item?._id))
                const next = incoming.filter((item: any) => item?._id && !seen.has(item._id))
                return [...current, ...next]
            })

            setPagination(data?.pagination || null)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load series"
            )

            if (mode === "replace") {
                setSeries([])
                setPagination(null)
            }
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [activeTag, debouncedSearch])

    useEffect(() => {
        void fetchSeries(1, "replace")
    }, [fetchSeries])

    useEffect(() => {
        const marker = loadMoreRef.current

        if (!marker) return

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]

            if (!entry?.isIntersecting) return
            if (loading || loadingMore) return
            if (!pagination?.hasMore) return

            void fetchSeries(pagination.currentPage + 1, "append")
        }, {
            rootMargin: "420px 0px"
        })

        observer.observe(marker)

        return () => {
            observer.disconnect()
        }
    }, [
        fetchSeries,
        loading,
        loadingMore,
        pagination?.currentPage,
        pagination?.hasMore
    ])

    const resultText = useMemo(() => {
        if (loading) return "Loading series..."

        const total = pagination?.total ?? series.length
        return `${total} series found`
    }, [loading, pagination?.total, series.length])

    return (
        <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-gray-100">
            <div className="flex-shrink-0">
                <Header variant="topbar" />
            </div>

            <div className="min-h-0 flex-1 px-1.5 py-2 min-[360px]:px-2 sm:px-3 sm:py-3 lg:px-4">
                <main className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[20px] bg-white p-2.5 shadow-[0_8px_30px_rgba(0,0,0,.05)] min-[360px]:rounded-[24px] min-[360px]:p-3 sm:rounded-[30px] sm:p-5">
                    <div className="flex-shrink-0 bg-white">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-black leading-none text-[#5B21B6] sm:text-[28px]">
                                    All Test Series
                                </h2>
                                <p className="mt-1 text-xs font-bold text-gray-500 sm:text-sm">
                                    {resultText}
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-md">
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search series..."
                                    className="h-10 w-full rounded-2xl border border-[#6D28D9] bg-white px-4 pr-11 text-sm font-semibold text-[#171426] outline-none transition placeholder:text-[#8B85A7] focus:ring-4 focus:ring-[#6D28D9]/10 sm:h-12"
                                />
                                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6D28D9] sm:h-5 sm:w-5" />
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-4">
                            <button
                                onClick={() => setSelectedTag("")}
                                className={`h-10 flex-shrink-0 rounded-full border px-4 text-xs font-black uppercase transition ${activeTag === ""
                                    ? "border-[#4A3F77] bg-[#4A3F77] text-white"
                                    : "border-[#E2DDF3] bg-[#F8F6FF] text-[#4A3F77] hover:bg-[#F0ECFF]"
                                    }`}
                            >
                                All
                            </button>

                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`h-10 flex-shrink-0 rounded-full border px-4 text-xs font-black uppercase transition ${activeTagKey === normalizeTag(tag)
                                        ? "border-[#4A3F77] bg-[#4A3F77] text-white"
                                        : "border-[#E2DDF3] bg-[#F8F6FF] text-[#4A3F77] hover:bg-[#F0ECFF]"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <AdSenseAd className="mt-4 border border-[#E2DDF3] shadow-[0_8px_20px_rgba(74,63,119,0.06)]" />

                        {error && (
                            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:#8B7BC9_#EEEAFB] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#EEEAFB] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8B7BC9] [&::-webkit-scrollbar-thumb:hover]:bg-[#6D5CAF]">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] justify-items-center gap-x-4 gap-y-5 pb-4 max-[799px]:grid-cols-2 max-[525px]:grid-cols-1 max-[525px]:gap-y-4">
                            {series.map((item) => {
                                const plan = getPlan(item)

                                return (
                                    <div key={item._id} className="w-full min-w-0 max-w-[300px] max-[799px]:max-w-[360px] max-[525px]:max-w-[320px]">
                                        <TestCard
                                            access={item?.access}
                                            av={item?.av !== false}
                                            slug={item._id}
                                            board={item.tags?.[0] || "TEST"}
                                            liveName={item.demo ? "Demo" : "Live"}
                                            name={item.n}
                                            totalTest={`${plan?.allowedAttempt || 0} Attempts`}
                                            totalPrice={plan?.price ? `₹${plan.price}` : "₹0"}
                                            offerPrice={plan?.offerPrice ? `₹${plan.offerPrice}` : "₹0"}
                                            demoInfo={
                                                item?.access?.message?.displayMessage ||
                                                (
                                                    item.demo
                                                        ? "Free Demo Available"
                                                        : "Premium Test Series"
                                                )
                                            }
                                            demoHead={item.demo ? "Demo Free" : "Premium"}
                                            btnName={item?.av === false ? item?.btnName : undefined}
                                            img={item.i}
                                        />
                                    </div>
                                )
                            })}

                            {loading && (
                                <TestCardSkeleton count={8} />
                            )}
                        </div>

                        {!loading && series.length === 0 && !error && (
                            <div className="mt-8 rounded-2xl border border-[#E2DDF3] bg-[#FBFAFF] px-4 py-10 text-center">
                                <p className="text-sm font-black text-[#4A3F77]">
                                    No series found
                                </p>
                            </div>
                        )}

                        <div ref={loadMoreRef} className="h-10" />

                        {loadingMore && (
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] justify-items-center gap-x-4 gap-y-5 max-[799px]:grid-cols-2 max-[525px]:grid-cols-1">
                                <TestCardSkeleton count={4} />
                            </div>
                        )}

                        <AdSenseAd className="mt-6 border border-[#E2DDF3] shadow-[0_8px_20px_rgba(74,63,119,0.06)]" />
                    </div>
                </main>
            </div>
        </div>
    )
}
