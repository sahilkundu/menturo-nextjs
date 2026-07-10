import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import {
    createPageMetadata,
    extractSeriesIdFromSlug,
    formatSlugTitle,
    isSeriesIdOnlySlug,
    siteName,
    siteUrl
} from '../../../../shared/seo'
import {
    LOAD_SERIES_SEO
} from '../../../../../api'

type SeriesLayoutProps = {
    children: ReactNode
    params: Promise<{
        slug: string
    }>
}

type SeriesMetadata = {
    name?: string
    image?: string
}

const toAbsoluteImageUrl = (
    image?: string
) => {
    if (!image?.trim()) {
        return undefined
    }

    try {
        return new URL(
            image,
            siteUrl
        ).toString()
    } catch (_) {
        return undefined
    }
}

const loadSeriesMetadata = async (
    slug: string
): Promise<SeriesMetadata> => {
    const seriesId =
        extractSeriesIdFromSlug(slug)

    if (
        !seriesId ||
        !/^[a-f0-9]{24}$/i.test(seriesId)
    ) {
        return {}
    }

    try {
        const response =
            await fetch(
                `${LOAD_SERIES_SEO}/${seriesId}`,
                {
                    next: {
                        revalidate: 3600,
                    },
                }
            )

        if (!response.ok) {
            return {}
        }

        const data =
            await response.json()
        const series =
            data?.series || {}

        return {
            name:
                typeof series.n === 'string'
                    ? series.n
                    : undefined,
            image:
                typeof series.i === 'string'
                    ? toAbsoluteImageUrl(series.i)
                    : undefined,
        }
    } catch (_) {
        return {}
    }
}

export async function generateMetadata({
    params,
}: SeriesLayoutProps): Promise<Metadata> {
    const {
        slug,
    } = await params
    const idOnlySlug =
        isSeriesIdOnlySlug(slug)
    const seriesMetadata =
        await loadSeriesMetadata(slug)
    const examName =
        seriesMetadata.name ||
        (
            idOnlySlug
                ? 'Mock Test'
                : formatSlugTitle(slug)
        )

    return createPageMetadata({
        title: idOnlySlug
            ? 'Mock Test Series 2026'
            : `${examName} Mock Test Series 2026`,
        description: examName,
        path: `/series/${slug}`,
        index: !idOnlySlug,
        keywords: [
            `${examName} mock test`,
            `${examName} test series`,
            `${examName} previous year question`,
            `${examName} online test`,
            `${examName} preparation`,
            `${examName} practice set`,
            `${examName} syllabus`,
        ],
        image: seriesMetadata.image,
    })
}

export default async function SeriesLayout({
    children,
    params,
}: SeriesLayoutProps) {
    const {
        slug,
    } = await params
    const examName =
        isSeriesIdOnlySlug(slug)
            ? 'Mock Test'
            : formatSlugTitle(slug)
    const pageUrl = `${siteUrl}/series/${slug}`

    return (
        <>
            <Script
                id={`series-schema-${slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            '@context': 'https://schema.org',
                            '@type': 'Course',
                            name: `${examName} Mock Test Series 2026`,
                            description:
                                `Online mock tests, PYQs, and practice sets for ${examName} exam preparation.`,
                            provider: {
                                '@type': 'Organization',
                                name: siteName,
                                sameAs: siteUrl,
                            },
                            url: pageUrl,
                            educationalLevel: 'Competitive exam preparation',
                            inLanguage: [
                                'en',
                                'hi',
                            ],
                        },
                        {
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                {
                                    '@type': 'ListItem',
                                    position: 1,
                                    name: 'Home',
                                    item: siteUrl,
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 2,
                                    name: 'Test Series',
                                    item: `${siteUrl}/`,
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 3,
                                    name: `${examName} Mock Test Series`,
                                    item: pageUrl,
                                },
                            ],
                        },
                    ]),
                }}
            />
            {children}
        </>
    )
}
