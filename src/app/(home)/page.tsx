'use client'

import { useEffect, useState, useRef } from "react"
import { useTheme } from "../../app/providers/ThemeProvider"
import { Menu, X, Lock, RefreshCw } from "lucide-react"
import Search from "../../shared/components/SearchBar"
import Image from "next/image"
import { useHomeStore } from "../../shared/store/homeStore"
import { fetchHomeData, fetchSeriesPage, fetchTags } from "../../shared/utils/loadInitial"

function CardSkeleton() {
    return (
        <div className="home-card-theme animate-pulse space-y-3">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="flex justify-between mt-4">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-24 h-6 bg-gray-300 rounded"></div>
            </div>
        </div>
    )
}

function TagSkeleton() {
    return <div className="h-8 bg-gray-300 animate-pulse rounded w-full" />
}

export default function HomePage() {
    const { system } = useTheme()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const {
        data,
        tags,
        setData,
        appendData,
        setTagPage,
        nextPage,
        setNextPage,
        hasMore,
        setHasMore,
        loading,
        setLoading,
        setTags,
    } = useHomeStore()

    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    console.log(tags)
    const filteredData = selectedTag
        ? data.filter((item: any) => item?.tags?.includes(selectedTag))
        : data

    const [retryCount, setRetryCount] = useState(0)
    const maxRetries = 3
    const [error, setError] = useState(false)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const loaderRef = useRef<HTMLDivElement | null>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    // ---------------- TAGS ----------------
    useEffect(() => {
        fetchTags().then((res) => setTags(res.tags))
    }, [])

    // ---------------- INITIAL LOAD ----------------
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(false)

                const res = await fetchHomeData()

                setData(res.data)
                setNextPage(res.nextPage)
                setHasMore(res.hasMore)

                setRetryCount(0)
            } catch (err) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    // ---------------- REFS FOR LATEST STATE ----------------
    const loadingRef = useRef(loading)
    const hasMoreRef = useRef(hasMore)
    const nextPageRef = useRef(nextPage)

    useEffect(() => {
        loadingRef.current = loading
    }, [loading])

    useEffect(() => {
        hasMoreRef.current = hasMore
    }, [hasMore])

    useEffect(() => {
        nextPageRef.current = nextPage
    }, [nextPage])

    // ---------------- LOAD NEXT PAGE ----------------
    const loadNextPage = async () => {
        console.log("📡 loadNextPage fired", {
            page: nextPageRef.current,
            loading: loadingRef.current,
            hasMore: hasMoreRef.current
        })
        if (loadingRef.current || !hasMoreRef.current) return
        if (retryCount >= maxRetries) return

        try {
            setLoading(true)

            const res = await fetchSeriesPage(nextPageRef.current)

            if (!res?.data?.length) {
                setHasMore(false)
                return
            }

            appendData(res.data)
            setNextPage(res.nextPage)
            setHasMore(res.hasMore)

            setRetryCount(0)
        } catch (err) {
            setRetryCount((prev) => prev + 1)
            setError(true)

            if (retryCount + 1 >= maxRetries) {
                setHasMore(false)
            }
        } finally {
            setLoading(false)
        }
    }

    // ---------------- INFINITE SCROLL FIX (IMPORTANT) ----------------
    useEffect(() => {
        const root = scrollContainerRef.current
        const el = loaderRef.current

        if (!root || !el) {
            console.log("❌ observer setup failed", { root, el })
            return
        }

        console.log("👀 observer created")

        // cleanup previous observer (VERY IMPORTANT)
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const target = entries[0]

                console.log("👁 intersect:", target.isIntersecting)

                if (target.isIntersecting) {
                    console.log("🔥 trigger loadNextPage")
                    loadNextPage()
                }
            },
            {
                root,
                threshold: 0,
                rootMargin: "200px",
            }
        )

        observerRef.current.observe(el)

        return () => {
            console.log("🧹 observer cleanup")
            observerRef.current?.disconnect()
        }
    }, [data.length, hasMore, loading])
    const visibleData = filteredData

    return (
        <div className="home-page-theme flex h-screen w-full overflow-hidden">

            {/* SIDEBAR */}
            <div
                className={`fixed lg:static top-0 left-0 h-full z-40 w-64 sidebar-theme transform transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 flex flex-col`}
            >
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                    {tags.length === 0
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TagSkeleton key={i} />
                        ))
                        : tags?.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    const matchedSeries = data.filter(item =>
                                        item.tags?.includes(tag)
                                    )

                                    const count = matchedSeries.length

                                    setSelectedTag(tag)

                                    // NEW: store how many match this tag
                                    setTagPage(tag, count)
                                }}
                                className={`sidebar-btn-theme ${selectedTag === tag ? "bg-green-500 text-white" : ""
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                </div>

                <div className="p-4 lg:hidden flex justify-between border-b">
                    <h2>Menu</h2>
                    <button onClick={() => setSidebarOpen(false)}>
                        <X />
                    </button>
                </div>
            </div>

            {/* OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* MAIN SCROLL AREA */}
            <div
                ref={scrollContainerRef}
                className="flex-1 flex flex-col overflow-auto p-2 login-scrollbar"
            >
                <div className="p-4">
                    <Search />
                </div>

                {error && retryCount >= maxRetries && (
                    <div className="text-center text-red-500 p-4">
                        <p>Failed to load data</p>
                        <button
                            className="flex items-center gap-2 mx-auto mt-2 bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw size={14} /> Retry
                        </button>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

                    {visibleData.map((item: any) => (
                        <div
                            key={item?._id?.$oid}
                            className="home-card-theme flex flex-col"
                        >
                            <div className="flex gap-3 mb-2">
                                <Image
                                    src={item?.i}
                                    alt={item?.n}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <div>
                                    <h3 className="h3-theme">{item?.n}</h3>
                                    <p className="text-theme2">
                                        Tests: {item?.plans?.length}
                                    </p>
                                </div>
                            </div>

                            <p className="text-theme mb-2">
                                <b>Language:</b> {item?.lan?.join(" & ")}
                            </p>

                            <ul className="list-disc pl-5 text-theme2 space-y-1 mb-4">
                                {item?.info?.map((info: string, i: number) => (
                                    <li key={i}>{info}</li>
                                ))}
                            </ul>

                            <div className="flex justify-between items-center mt-auto pt-4">
                                <Lock size={16} className="text-green-600" />
                                <button className="series-btn-sm px-3 py-1.5 text-xs rounded-md">
                                    Check Test Series
                                </button>
                            </div>
                        </div>
                    ))}

                    {loading &&
                        Array.from({ length: 2 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                </div>

                {/* 🔥 SENTINEL MUST BE OUTSIDE GRID */}
                <div ref={loaderRef} className="h-10 w-full" />
            </div>

            {/* MOBILE BUTTON */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--formButtonBackground)] text-[var(--buttonTextOpposite)] p-4 rounded-full shadow-lg z-50"
            >
                <Menu />
            </button>
        </div>

    )
}