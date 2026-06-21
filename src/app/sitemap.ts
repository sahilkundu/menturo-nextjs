import type { MetadataRoute } from 'next'
import {
    createSeriesSlug,
    siteUrl,
} from '../shared/seo'
import { BASE_URL } from '../../api'

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
                        next: {
                            revalidate: 3600,
                        },
                    }
                )

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

    const seriesRoutes =
        await getSeriesRoutes(now)

    return seriesRoutes
}
