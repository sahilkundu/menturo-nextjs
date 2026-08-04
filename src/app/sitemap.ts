import type { MetadataRoute } from 'next'
import {
    createSeriesSlug,
    siteUrl,
} from '../shared/seo'
import {
    hartronPagePath,
    hartronSupportPages,
} from '../shared/hartronSeo'
import { BASE_URL, LOAD_SEO_SITEMAP } from '../../api'

export const dynamic = 'force-dynamic'

const getSeriesRoutes = async (
    now: Date
): Promise<MetadataRoute.Sitemap> => {
    try {
        const routes: MetadataRoute.Sitemap = []
        let page = 1
        let hasMore = true

        while (hasMore && page <= 50) {
            const response =
                await fetch(
                    `${BASE_URL}/api/seo/series-sitemap?page=${page}&limit=100`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    }
                )

            if (!response.ok) {
                throw new Error(
                    `Series sitemap API returned ${response.status}`
                )
            }

            const data =
                await response.json()

            if (!Array.isArray(data?.series)) {
                break
            }

            for (const series of data.series) {
                const slug =
                    createSeriesSlug(series?.n, series?.slug || series?._id)

                if (!slug) {
                    continue
                }

                routes.push({
                    url: `${siteUrl}/series/${slug}`,
                    lastModified: series?.updatedAt
                        ? new Date(series.updatedAt)
                        : now,
                    changeFrequency: 'weekly',
                    priority: 0.9,
                })
            }

            hasMore =
                Boolean(data?.pagination?.hasMore)

            page += 1
        }

        return routes
    } catch {
        return []
    }
}

const getSeoRoutes = async (
    kind: 'questions' | 'topics' | 'subjects' | 'chapters' | 'subtopics',
    now: Date
): Promise<MetadataRoute.Sitemap> => {
    try {
        const routes: MetadataRoute.Sitemap = []
        let page = 1
        let hasMore = true

        while (hasMore && page <= 50) {
            const response = await fetch(
                `${LOAD_SEO_SITEMAP}/${kind}?page=${page}&limit=5000`,
                {
                    method: 'GET',
                    next: {
                        revalidate: 3600,
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`SEO ${kind} sitemap API returned ${response.status}`)
            }

            const data = await response.json()
            const items = Array.isArray(data?.items) ? data.items : []

            for (const item of items) {
                if (!item?.url) {
                    continue
                }

                routes.push({
                    url: item.url.startsWith('http')
                        ? item.url
                        : `${siteUrl}${item.url}`,
                    lastModified: item?.lastModified
                        ? new Date(item.lastModified)
                        : now,
                    changeFrequency: item?.changeFrequency || (kind === 'questions' ? 'monthly' : 'weekly'),
                    priority: typeof item?.priority === 'number'
                        ? item.priority
                        : kind === 'subjects'
                            ? 0.9
                            : kind === 'chapters'
                                ? 0.86
                                : kind === 'topics'
                            ? 0.82
                                    : kind === 'subtopics'
                                        ? 0.78
                                        : 0.64,
                })
            }

            hasMore = Boolean(data?.pagination?.hasMore)
            page += 1
        }

        return routes
    } catch {
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const publicRoutes: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/typingPro`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/series`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/privacy-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/terms-and-conditions`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/ad-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/cancellation-and-refund`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...hartronSupportPages.map((page) => ({
            url: `${siteUrl}${hartronPagePath(page.slug)}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: page.slug === 'hartron-test-series' ? 0.9 : 0.82,
        })),
    ]

    const seriesRoutes =
        await getSeriesRoutes(now)
    const questionRoutes =
        await getSeoRoutes('questions', now)
    const subjectRoutes =
        await getSeoRoutes('subjects', now)
    const chapterRoutes =
        await getSeoRoutes('chapters', now)
    const topicRoutes =
        await getSeoRoutes('topics', now)
    const subtopicRoutes =
        await getSeoRoutes('subtopics', now)

    return [
        ...publicRoutes,
        ...seriesRoutes,
        ...subjectRoutes,
        ...chapterRoutes,
        ...topicRoutes,
        ...subtopicRoutes,
        ...questionRoutes,
    ]
}
