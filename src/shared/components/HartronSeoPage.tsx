import Link from 'next/link'
import Script from 'next/script'
import {
    hartronPagePath,
    hartronSeriesLinks,
    hartronSyllabusGroups,
    hartronSupportPages,
    type HartronPageSlug,
} from '../hartronSeo'
import {
    siteName,
    siteUrl,
} from '../seo'
import TestCard from './TestCard'
import { LOAD_SERIES } from '../../../api'

type Props = {
    page: {
        slug: HartronPageSlug
        title: string
        description: string
        intro: string
    }
}

type InsightCard = {
    title: string
    text: string
}

type SeriesLink = {
    title: string
    text: string
    series: any
}

type SeriesMatch = {
    match: string
    exclude?: string[]
    searches?: string[]
    title: string
    text: string
}

const pageInsights: Record<HartronPageSlug, {
    label: string
    title: string
    text: string
    cards: InsightCard[]
}> = {
    'hartron-test-series': {
        label: 'Preparation hub',
        title: 'Choose the right HARTRON practice path',
        text: 'Start from the post you are targeting, then move between syllabus, previous-year style practice, computer questions, and timed test series. This page is the central HARTRON route for Menturo.',
        cards: [
            {
                title: 'Post-wise test series',
                text: 'Programmer, Junior Programmer, Software Developer, and DEO practice links are grouped in one place.',
            },
            {
                title: 'Topic-led revision',
                text: 'Use the syllabus and computer question pages to cover each technical area before attempting full mocks.',
            },
            {
                title: 'Internal exam cluster',
                text: 'HARTRON syllabus, exam pattern, PYQ, and computer question pages all link together for stronger discovery.',
            },
        ],
    },
    'hartron-syllabus': {
        label: 'Syllabus map',
        title: 'Post-wise HARTRON domain topics',
        text: 'The syllabus page is focused on technical/domain knowledge posts: Programmer, Junior Programmer, Software Developer, System Analyst, Networking Engineer, and Networking Assistant.',
        cards: [
            {
                title: 'Programming posts',
                text: 'ASP .Net, Java, PHP, C/C++, DBMS, SQL Server, operating systems, and system analysis.',
            },
            {
                title: 'Networking posts',
                text: 'Hardware concepts, Windows Server, networking components, Linux/Unix, and computer fundamentals.',
            },
            {
                title: 'Revision flow',
                text: 'First finish the topic list, then use computer questions and previous-year style practice for recall.',
            },
        ],
    },
    'hartron-exam-pattern': {
        label: 'Exam pattern',
        title: 'Turn syllabus into test-taking strategy',
        text: 'Use this page to understand how domain knowledge, programming practical tasks, and networking practical tasks should be prepared differently.',
        cards: [
            {
                title: 'Domain knowledge test',
                text: 'Expect technical questions from programming, databases, web basics, operating systems, networking, and project concepts.',
            },
            {
                title: 'Programming practical',
                text: 'Practice database tables, MVC flow, dropdowns, validation, calculations, and report output.',
            },
            {
                title: 'Networking practical',
                text: 'Prepare hardware identification, assembling, network design, cable/components, and maintenance faults.',
            },
        ],
    },
    'hartron-previous-year-papers': {
        label: 'PYQ practice',
        title: 'Use previous-year style questions to find repeated topics',
        text: 'Previous-year style practice should expose repeated computer topics, practical task formats, and the depth of revision needed before timed mocks.',
        cards: [
            {
                title: 'Repeated computer areas',
                text: 'Operating systems, DBMS, networking, web basics, programming syntax, and computer fundamentals appear across posts.',
            },
            {
                title: 'Practical paper patterns',
                text: 'Application-building and reporting tasks are useful for Programmer and Junior Programmer preparation.',
            },
            {
                title: 'Mock test timing',
                text: 'After PYQ revision, use full-length tests to improve speed and reduce avoidable mistakes.',
            },
        ],
    },
}

const practicalCards = [
    {
        title: 'DEO online test and typing',
        text: 'For Data Entry Operator preparation, plan for a 30-minute online test, a 15-minute attempt window, and a 5-minute typing test after the online test.',
        href: '/typingPro',
        linkText: 'Open typing practice',
    },
    {
        title: 'Other HARTRON posts',
        text: 'For posts other than DEO, prepare for 50 questions in 25 minutes, then post-selection training of around four weeks depending on the requirement.',
    },
    {
        title: 'Project and final test focus',
        text: 'After training, the final test may check software or website-making skills, so practice project building, forms, validations, database flow, and reports.',
    },
    {
        title: 'Programmer practical focus',
        text: 'Practice MVC-style applications, master/detail tables, commission calculation, dropdown selection, validations, and reports.',
    },
    {
        title: 'Networking practical focus',
        text: 'Revise assembling, hardware identification, LAN/WAN design, routers, switches, UTP/STP/fiber cables, patch panels, and fault detection.',
    },
]

const syllabusCardThemes = [
    {
        card: 'border-violet-200 bg-[linear-gradient(135deg,#F7F3FF_0%,#FFFFFF_58%,#ECFDF5_100%)] shadow-[0_18px_42px_rgba(91,33,182,0.14)]',
        chip: 'border-violet-100 bg-white/90 shadow-[0_8px_18px_rgba(91,33,182,0.06)]',
        accent: 'bg-violet-600',
    },
    {
        card: 'border-emerald-200 bg-[linear-gradient(135deg,#ECFDF5_0%,#FFFFFF_58%,#F5F3FF_100%)] shadow-[0_18px_42px_rgba(16,185,129,0.13)]',
        chip: 'border-emerald-100 bg-white/90 shadow-[0_8px_18px_rgba(16,185,129,0.06)]',
        accent: 'bg-emerald-500',
    },
    {
        card: 'border-sky-200 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_56%,#F7F3FF_100%)] shadow-[0_18px_42px_rgba(14,165,233,0.13)]',
        chip: 'border-sky-100 bg-white/90 shadow-[0_8px_18px_rgba(14,165,233,0.06)]',
        accent: 'bg-sky-500',
    },
    {
        card: 'border-amber-200 bg-[linear-gradient(135deg,#FFFBEB_0%,#FFFFFF_56%,#F5F3FF_100%)] shadow-[0_18px_42px_rgba(245,158,11,0.13)]',
        chip: 'border-amber-100 bg-white/90 shadow-[0_8px_18px_rgba(245,158,11,0.06)]',
        accent: 'bg-amber-500',
    },
]

const faqs = [
    {
        question: 'Which HARTRON posts can I prepare for on Menturo?',
        answer:
            'You can prepare for HARTRON Programmer, Junior Programmer, Data Entry Operator, Software Developer, System Analyst, Networking Engineer, and Networking Assistant style practice through linked pages and test series.',
    },
    {
        question: 'How should I use these HARTRON pages?',
        answer:
            'Start with the hub page, read the syllabus for your post, revise computer questions, practice previous-year style questions, and then attempt timed mock tests.',
    },
    {
        question: 'Are these pages connected to actual test series?',
        answer:
            'Yes. The HARTRON pages link directly to relevant Menturo test series pages, and HARTRON series pages link back to the preparation cluster.',
    },
]

const normalizeText = (value: unknown) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')

const getPlan = (series: any) =>
    Array.isArray(series?.plans) && series.plans.length > 0
        ? series.plans[0]
        : null

const fetchSeriesBatch = async (
    params: {
        tag?: string
        search?: string
    }
) => {
    const response =
        await fetch(
            LOAD_SERIES,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: JSON.stringify({
                    tag: params.tag || '',
                    search: params.search || '',
                    page: 1,
                    limit: 24,
                }),
            }
        )

    if (!response.ok) {
        return []
    }

    const data =
        await response.json()

    return Array.isArray(data?.series)
        ? data.series
        : Array.isArray(data?.data)
            ? data.data
            : []
}

const loadHartronSeries = async (): Promise<SeriesLink[]> => {
    try {
        const batches =
            await Promise.all([
                fetchSeriesBatch({ tag: 'hartron' }),
                fetchSeriesBatch({ search: 'hartron' }),
                ...hartronSeriesLinks.flatMap((item) =>
                    (item.searches || [item.match]).map((search) =>
                        fetchSeriesBatch({ search })
                    )
                ),
            ])
        const seriesById = new Map<string, any>()
        for (const item of batches.flat()) {
            const key =
                String(item?._id || item?.slug || item?.n || '')
            if (key) {
                seriesById.set(key, item)
            }
        }
        const series =
            Array.from(seriesById.values())

        return hartronSeriesLinks.flatMap((item: SeriesMatch) => {
            const matchedSeries =
                series.find((candidate: any) => {
                    const haystack =
                        normalizeText([
                            candidate?.n,
                            candidate?.slug,
                            ...(Array.isArray(candidate?.tags) ? candidate.tags : []),
                        ].join(' '))

                    return haystack.includes(item.match) &&
                        !(item.exclude || []).some((word) => haystack.includes(word))
                })

            if (!matchedSeries) {
                return []
            }

            if (!matchedSeries?.slug && !matchedSeries?._id) {
                return []
            }

            return [{
                title: item.title,
                text: item.text,
                series: matchedSeries,
            }]
        })
    } catch {
        return []
    }
}

export default async function HartronSeoPage({ page }: Props) {
    const details = pageInsights[page.slug]
    const supportLinks =
        hartronSupportPages.filter((item) => item.slug !== page.slug)
    const seriesLinks =
        await loadHartronSeries()
    const pageUrl = `${siteUrl}${hartronPagePath(page.slug)}`
    const showSyllabus =
        page.slug === 'hartron-syllabus' ||
        page.slug === 'hartron-exam-pattern'
    const showPractical =
        page.slug === 'hartron-exam-pattern'
    const showSeriesLinks =
        page.slug === 'hartron-test-series' ||
        page.slug === 'hartron-previous-year-papers'
    const seriesSectionTitle =
        page.slug === 'hartron-previous-year-papers'
            ? 'Practice With HARTRON Test Series'
            : 'HARTRON Test Series'

    return (
        <main className="min-h-[100dvh] bg-[#F6F7FB] px-4 py-8 text-slate-800 sm:py-12">
            <Script
                id={`${page.slug}-schema`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: page.title,
                            description: page.description,
                            url: pageUrl,
                            publisher: {
                                '@type': 'Organization',
                                name: siteName,
                                url: siteUrl,
                            },
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
                                    name: 'HARTRON Test Series',
                                    item: `${siteUrl}/hartron-test-series`,
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 3,
                                    name: page.title,
                                    item: pageUrl,
                                },
                            ],
                        },
                        {
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: faqs.map((item) => ({
                                '@type': 'Question',
                                name: item.question,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: item.answer,
                                },
                            })),
                        },
                    ]),
                }}
            />

            <article className="mx-auto max-w-6xl">
                <nav className="mb-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                    <Link className="rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm" href="/">
                        Home
                    </Link>
                    <Link className="rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm" href="/series">
                        Test Series
                    </Link>
                    <Link className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-violet-800 shadow-sm" href="/hartron-test-series">
                        HARTRON
                    </Link>
                </nav>

                <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">
                                {details.label}
                            </p>
                            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                {page.title}
                            </h1>
                            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                                {page.intro}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white" href="/hartron-test-series">
                                    HARTRON Hub
                                </Link>
                                <Link className="rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-black text-violet-800" href="/series">
                                    All Test Series
                                </Link>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 bg-slate-950 p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                                Page focus
                            </p>
                            <h2 className="mt-3 text-2xl font-black leading-tight">
                                {details.title}
                            </h2>
                            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                                {details.text}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-3">
                    {details.cards.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-black text-slate-950">
                                {item.title}
                            </h2>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-black text-slate-950">
                            HARTRON Topic Pages
                        </h2>
                        <div className="mt-4 grid gap-3">
                            {supportLinks.map((item) => (
                                <Link key={item.slug} href={hartronPagePath(item.slug)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50">
                                    <span className="text-sm font-black text-slate-950">
                                        {item.title}
                                    </span>
                                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                                        {item.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </aside>

                    {showPractical ? (
                        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-950">
                                Practical and Exam Pattern Focus
                            </h2>
                            <div className="mt-4 grid gap-3">
                                {practicalCards.map((item) => (
                                    <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                                        <h3 className="text-sm font-black text-slate-950">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                                            {item.text}
                                        </p>
                                        {'href' in item && item.href && (
                                            <Link className="mt-3 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white" href={item.href}>
                                                {item.linkText}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-950">
                                How to Use This Page
                            </h2>
                            <div className="mt-4 grid gap-3">
                                {[
                                    'Read the post-wise syllabus group that matches your target role.',
                                    'Revise matching computer questions before taking full mock tests.',
                                    'Use previous-year style questions to find repeated topics and weak areas.',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </section>

                {showSyllabus && (
                    <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                                    Post-wise syllabus
                                </p>
                                <h2 className="mt-2 text-2xl font-black text-slate-950">
                                    HARTRON Technical Topics
                                </h2>
                            </div>
                            <Link className="text-sm font-black text-violet-700" href="/hartron-syllabus">
                                Open syllabus page
                            </Link>
                        </div>
                        <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
                            {hartronSyllabusGroups.map((group, index) => {
                                const theme =
                                    syllabusCardThemes[index % syllabusCardThemes.length]

                                return (
                                    <div key={group.title} className={`relative overflow-hidden rounded-[22px] border p-4 ${theme.card}`}>
                                        <div className={`absolute left-0 top-0 h-full w-1.5 ${theme.accent}`} />
                                        <h3 className="pl-2 text-base font-black text-slate-950">
                                            {group.title}
                                        </h3>
                                        <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-slate-700 sm:grid-cols-2">
                                            {group.topics.map((topic) => (
                                                <li key={topic} className={`rounded-xl border px-3 py-2 ${theme.chip}`}>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-black text-slate-950">
                        HARTRON FAQs
                    </h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {faqs.map((item) => (
                            <details key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <summary className="cursor-pointer text-sm font-black text-slate-950">
                                    {item.question}
                                </summary>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {showSeriesLinks && seriesLinks.length > 0 && (
                    <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                                Related practice
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-slate-950">
                                {seriesSectionTitle}
                            </h2>
                        </div>
                        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-x-4 gap-y-5 max-[799px]:grid-cols-2 max-[525px]:grid-cols-1">
                            {seriesLinks.map((item) => (
                                <div key={item.series?._id || item.series?.slug || item.title} className="w-full min-w-0">
                                    <TestCard
                                        access={item.series?.access}
                                        av={item.series?.av !== false}
                                        slug={item.series?.slug || item.series?._id}
                                        board={item.series?.tags?.[0] || "HARTRON"}
                                        liveName={item.series?.demo ? "Demo" : "Live"}
                                        name={item.series?.n || item.title}
                                        totalTest={`${getPlan(item.series)?.allowedAttempt || 0} Attempts`}
                                        totalPrice={getPlan(item.series)?.price ? `₹${getPlan(item.series).price}` : "₹0"}
                                        offerPrice={getPlan(item.series)?.offerPrice ? `₹${getPlan(item.series).offerPrice}` : "₹0"}
                                        demoInfo={
                                            item.series?.access?.message?.displayMessage ||
                                            (
                                                item.series?.demo
                                                    ? "Free Demo Available"
                                                    : "Premium Test Series"
                                            )
                                        }
                                        demoHead={item.series?.demo ? "Demo Free" : "Premium"}
                                        btnName={item.series?.av === false ? item.series?.btnName : undefined}
                                        img={item.series?.i}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </main>
    )
}
