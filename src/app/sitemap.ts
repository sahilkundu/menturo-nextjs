import type { MetadataRoute } from 'next'
import {
    createSeriesSlug,
    siteUrl,
} from '../shared/seo'
import { BASE_URL } from '../../api'

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
                    createSeriesSlug(series?.n, series?._id)

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
            url: `${siteUrl}/cancellation-and-refund`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    const seriesRoutes =
        await getSeriesRoutes(now)

    return [
        ...publicRoutes,
        ...seriesRoutes,
    ]
}
