import type { MetadataRoute } from 'next'
import {
    createSeriesSlug,
    siteUrl,
} from '../shared/seo'

const getSeriesRoutes = async (
    now: Date
): Promise<MetadataRoute.Sitemap> => {
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.API_BASE_URL

    if (!apiBaseUrl) {
        return []
    }

    try {
        const response =
            await fetch(
                `${apiBaseUrl}/api/test-series/load`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tag: '',
                        page: 1,
                        limit: 100,
                    }),
                    next: {
                        revalidate: 3600,
                    },
                }
            )

        const data =
            await response.json()

        if (!Array.isArray(data?.series)) {
            return []
        }

        return data.series
            .map((series: any) => createSeriesSlug(series?.n, series?._id))
            .filter(Boolean)
            .map((slug: string) => ({
                url: `${siteUrl}/series/${slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.9,
            }))
    } catch {
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
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
           priority: 0.9,
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
        ...staticRoutes,
        ...seriesRoutes,
    ]
}
