import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import {
    createPageMetadata,
    formatSlugTitle,
    isSeriesIdOnlySlug,
    siteName,
    siteUrl
} from '../../../../shared/seo'

type SeriesLayoutProps = {
    children: ReactNode
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({
    params,
}: SeriesLayoutProps): Promise<Metadata> {
    const {
        slug,
    } = await params
    const idOnlySlug =
        isSeriesIdOnlySlug(slug)
    const examName =
        idOnlySlug
            ? 'Mock Test'
            : formatSlugTitle(slug)

    return createPageMetadata({
        title: idOnlySlug
            ? 'Mock Test Series 2026'
            : `${examName} Mock Test Series 2026`,
        description:
            `Prepare for ${examName} with Menturo online mock tests, previous year questions, practice sets, exam-level questions, and performance analysis.`,
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
