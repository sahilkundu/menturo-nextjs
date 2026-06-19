import type { Metadata } from 'next'

export const siteUrl = 'https://www.menturo.in'
export const siteName = 'Menturo'
export const defaultImage = `${siteUrl}/M3.png`

export const priorityExamSlugs = [
    'haryana-cet',
    'hartron',
    'ssc-cgl',
    'ssc-chsl',
    'ssc-gd',
    'dsssb',
    'upsc',
    'banking',
    'htet',
    'railway',
    'rrb-ntpc',
    'delhi-police',
    'haryana-police',
    'ctet',
]

export const stateExamSlugs = [
    'andhra-pradesh',
    'arunachal-pradesh',
    'assam',
    'bihar',
    'chhattisgarh',
    'goa',
    'gujarat',
    'haryana',
    'himachal-pradesh',
    'jharkhand',
    'karnataka',
    'kerala',
    'madhya-pradesh',
    'maharashtra',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'odisha',
    'punjab',
    'rajasthan',
    'sikkim',
    'tamil-nadu',
    'telangana',
    'tripura',
    'uttar-pradesh',
    'uttarakhand',
    'west-bengal',
    'delhi',
    'jammu-kashmir',
]

export const seoKeywords = [
    'Menturo',
    'online mock test',
    'government exam preparation',
    'test series',
    'previous year questions',
    'PYQ',
    'Haryana CET',
    'Haryana CET mock test',
    'Hartron',
    'Hartron mock test',
    'SSC CGL',
    'SSC CHSL',
    'SSC GD',
    'DSSSB',
    'UPSC',
    'Banking exam',
    'HTET',
    'state government exams',
    'Hindi typing test',
    'English typing test',
]

const uppercaseWords = new Set([
    'cet',
    'ssc',
    'cgl',
    'chsl',
    'gd',
    'upsc',
    'dsssb',
    'htet',
    'ctet',
    'rrb',
    'ntpc',
    'deo',
])

export const formatSlugTitle = (slug: string) => {
    return decodeURIComponent(slug)
        .replace(/-[a-f0-9]{24}$/i, '')
        .split('-')
        .filter(Boolean)
        .map((word) => {
            const lowerWord = word.toLowerCase()

            if (uppercaseWords.has(lowerWord)) {
                return lowerWord.toUpperCase()
            }

            return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1)
        })
        .join(' ')
}

export const mongoIdPattern = /^[a-f0-9]{24}$/i

export const extractSeriesIdFromSlug = (slug: string) => {
    const normalizedSlug =
        decodeURIComponent(slug || '').trim()
    const match =
        normalizedSlug.match(/[a-f0-9]{24}$/i)

    return match?.[0] || normalizedSlug
}

export const createSeriesSlug = (
    name?: string,
    id?: string
) => {
    const normalizedId =
        extractSeriesIdFromSlug(id || '')

    if (!normalizedId) {
        return ''
    }

    if (!name?.trim()) {
        return normalizedId
    }

    const nameSlug =
        name
            .trim()
            .toLowerCase()
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    return nameSlug
        ? `${nameSlug}-${normalizedId}`
        : normalizedId
}

export const isSeriesIdOnlySlug = (slug: string) => {
    return mongoIdPattern.test(
        decodeURIComponent(slug || '').trim()
    )
}

type PageSeoInput = {
    title: string
    description: string
    path: string
    keywords?: string[]
    index?: boolean
    image?: string
}

export const createPageMetadata = ({
    title,
    description,
    path,
    keywords = [],
    index = true,
    image = defaultImage,
}: PageSeoInput): Metadata => {
    const normalizedPath =
        path === '/' ? '/' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`
    const url = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`

    return {
        title,
        description,
        keywords: [
            ...seoKeywords,
            ...keywords,
        ],
        alternates: {
            canonical: normalizedPath,
        },
        robots: {
            index,
            follow: index,
            googleBot: {
                index,
                follow: index,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        openGraph: {
            title: `${title} - ${siteName}`,
            description,
            url,
            siteName,
            images: [
                {
                    url: image,
                    width: 512,
                    height: 512,
                    alt: `${siteName} exam preparation`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} - ${siteName}`,
            description,
            images: [image],
        },
    }
}
