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
import AdDownloadLink from './AdDownloadLink'
import Footer from './Footer'
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
    'hartron-cut-off': {
        label: 'Cut off tracker',
        title: 'Track HARTRON cut off marks by result notice',
        text: 'Use this page for HARTRON cutoff tables, category-wise post counts, result dates, advertisement numbers, and deployment-specific cutoff details.',
        cards: [
            {
                title: 'Category-wise marks',
                text: 'Cutoff tables show category, available posts, and cutoff marks in a clear format.',
            },
            {
                title: 'Result notice context',
                text: 'Each cutoff entry includes result date, advertisement number, exam/scrutiny dates, and deployment details.',
            },
            {
                title: 'Preparation signal',
                text: 'Use previous cutoff marks to understand score targets before attempting HARTRON mock tests.',
            },
        ],
    },
}

const practicalCards = [
    {
        title: 'DEO online test and typing',
        text: 'For Data Entry Operator preparation, plan for 30 questions in 15 minutes, followed by typing practice where speed and accuracy matter.',
        href: '/typingPro',
        linkText: 'Open typing practice',
    },
    {
        title: 'Other HARTRON posts',
        text: 'For posts other than DEO, prepare for 50 questions in 25 minutes, then a second paper focused on post-wise technical knowledge.',
    },
    {
        title: 'Training and final test focus',
        text: 'For technical posts, training may run around four weeks or as required after the first test, then the second/final technical evaluation can include project-style tasks.',
    },
    {
        title: 'Technical/project paper',
        text: 'The second paper can differ by post. Software and programmer posts may check project-making skills, website/software flow, forms, validations, database work, and reports.',
    },
    {
        title: 'Networking practical focus',
        text: 'Revise assembling, hardware identification, LAN/WAN design, routers, switches, UTP/STP/fiber cables, patch panels, and fault detection.',
    },
]

const examPatternRows = [
    {
        post: 'Data Entry Operator',
        paper: 'Online objective test',
        questions: '30 questions',
        time: '15 minutes',
        nextStep: 'Typing test after the online test',
    },
    {
        post: 'Data Entry Operator',
        paper: 'Typing test',
        questions: 'Speed and accuracy based',
        time: 'Practice with 5-minute typing sets',
        nextStep: 'Use Menturo Typing Pro for preparation',
        href: '/typingPro',
        linkText: 'Typing Pro',
    },
    {
        post: 'Programmer / Junior Programmer / Software Developer / Technical posts',
        paper: 'Online objective test',
        questions: '50 questions',
        time: '25 minutes',
        nextStep: 'Training around four weeks or as required before the second technical paper',
    },
    {
        post: 'Programmer / Junior Programmer / Software Developer / Technical posts',
        paper: 'Second technical paper / practical paper',
        questions: 'Varies by post',
        time: 'As per requirement',
        nextStep: 'May include programming, networking, software, website, database, or project-making skills',
    },
]

const deoCutoffRows = [
    {
        category: 'PWD (General)',
        posts: '02 posts',
        cutoff: '46.00',
    },
    {
        category: 'General',
        posts: '12 posts (total 14 posts including 02 PWD posts)',
        cutoff: '57.46',
    },
    {
        category: 'General-ESM',
        posts: '02 posts',
        cutoff: '46.06',
    },
    {
        category: 'EWS',
        posts: '03 posts',
        cutoff: '55.64',
    },
    {
        category: 'SC',
        posts: '05 posts',
        cutoff: '50.32',
    },
    {
        category: 'SC-ESM',
        posts: '01 post',
        cutoff: '50.30',
    },
    {
        category: 'BCA',
        posts: '05 posts',
        cutoff: '55.00',
    },
    {
        category: 'BCA-ESM',
        posts: '02 posts',
        cutoff: '54.52',
    },
    {
        category: 'BCB',
        posts: '02 posts',
        cutoff: '48.34',
    },
    {
        category: 'BCB-ESM',
        posts: '01 post',
        cutoff: '48.32',
    },
]

const resultPdfLinks = {
    kuk2026: 'https://cdn.menturo.in/hartron-deo-result/ResultDeoKUK032026.pdf',
    district2025: 'https://cdn.menturo.in/hartron-deo-result/result_scan_12_dec2025.pdf',
    district2024: 'https://cdn.menturo.in/hartron-deo-result/deo-result-final-3.pdf',
}

const resultDownloadAdUrl = 'https://omg10.com/4/11265393'

type DistrictCutoffRow = {
    district: string
    category: string
    posts: string
    cutoff: string
}

const groupDistrictCutoffRows = (rows: DistrictCutoffRow[]) =>
    rows.reduce((groups, row) => {
        const group =
            groups.find((item) => item.district === row.district)

        if (group) {
            group.rows.push(row)
            return groups
        }

        return [
            ...groups,
            {
                district: row.district,
                rows: [row],
            },
        ]
    }, [] as Array<{
        district: string
        rows: DistrictCutoffRow[]
    }>)

const deoDistrictCutoffRows: DistrictCutoffRow[] = [
    { district: 'Ambala', category: 'General', posts: '03 posts', cutoff: '54.98' },
    { district: 'Ambala', category: 'General-ESM', posts: '01 post', cutoff: '53.44' },
    { district: 'Ambala', category: 'SC', posts: '02 posts', cutoff: '48.58' },
    { district: 'Ambala', category: 'SC-ESM', posts: '01 post', cutoff: '48.50' },
    { district: 'Ambala', category: 'BCB', posts: '02 posts', cutoff: '52.32' },
    { district: 'Bhiwani', category: 'PWD (EWS)', posts: '01 post', cutoff: '44.38' },
    { district: 'Bhiwani', category: 'EWS', posts: '01 post (total 02 posts including 01 PWD post)', cutoff: '55.40' },
    { district: 'Bhiwani', category: 'SC', posts: '02 posts', cutoff: '48.36' },
    { district: 'Bhiwani', category: 'BCA', posts: '01 post', cutoff: '57.20' },
    { district: 'Bhiwani', category: 'BCA-ESM', posts: '01 post', cutoff: '54.88' },
    { district: 'Bhiwani', category: 'BCB', posts: '02 posts', cutoff: '48.26' },
    { district: 'Faridabad', category: 'General', posts: '08 posts', cutoff: '52.40' },
    { district: 'Faridabad', category: 'EWS', posts: '01 post', cutoff: '52.12' },
    { district: 'Faridabad', category: 'BCA', posts: '01 post', cutoff: '52.38' },
    { district: 'Fatehabad', category: 'General', posts: '01 post', cutoff: '59.00' },
    { district: 'Fatehabad', category: 'General-ESM', posts: '02 posts', cutoff: '54.60' },
    { district: 'Fatehabad', category: 'EWS', posts: '01 post', cutoff: '56.64' },
    { district: 'Fatehabad', category: 'BCA', posts: '02 posts', cutoff: '54.96' },
    { district: 'Fatehabad', category: 'BCA-ESM', posts: '01 post', cutoff: '53.86' },
    { district: 'Fatehabad', category: 'BCB', posts: '02 posts', cutoff: '54.22' },
    { district: 'Jind', category: 'General', posts: '01 post', cutoff: '53.72' },
    { district: 'Jind', category: 'EWS', posts: '01 post', cutoff: '53.06' },
    { district: 'Jind', category: 'SC', posts: '04 posts', cutoff: '48.66' },
    { district: 'Jind', category: 'SC-ESM', posts: '01 post', cutoff: '47.74' },
    { district: 'Jind', category: 'BCB', posts: '01 post', cutoff: '53.42' },
    { district: 'Jind', category: 'BCB-ESM', posts: '01 post', cutoff: '47.42' },
    { district: 'Kurukshetra', category: 'General', posts: '03 posts', cutoff: '55.36' },
    { district: 'Kurukshetra', category: 'General-ESM', posts: '01 post', cutoff: '54.70' },
    { district: 'Kurukshetra', category: 'EWS', posts: '01 post', cutoff: '53.10' },
    { district: 'Kurukshetra', category: 'SC', posts: '02 posts', cutoff: '49.00' },
    { district: 'Kurukshetra', category: 'SC-ESM', posts: '01 post', cutoff: '46.50' },
    { district: 'Kurukshetra', category: 'BCB', posts: '01 post', cutoff: '45.06' },
    { district: 'Nuh', category: 'General', posts: '02 posts', cutoff: '54.02' },
    { district: 'Nuh', category: 'EWS', posts: '03 posts', cutoff: '51.16' },
    { district: 'Nuh', category: 'SC', posts: '02 posts', cutoff: '45.86' },
    { district: 'Nuh', category: 'SC-ESM', posts: '01 post', cutoff: '44.68' },
    { district: 'Nuh', category: 'BCA', posts: '01 post', cutoff: '52.70' },
    { district: 'Palwal', category: 'General', posts: '04 posts', cutoff: '55.42' },
    { district: 'Palwal', category: 'EWS', posts: '01 post', cutoff: '54.42' },
    { district: 'Palwal', category: 'BCA', posts: '02 posts', cutoff: '51.40' },
    { district: 'Palwal', category: 'BCA-ESM', posts: '01 post', cutoff: '51.14' },
    { district: 'Palwal', category: 'BCB', posts: '01 post', cutoff: '54.22' },
    { district: 'Palwal', category: 'BCB-ESM', posts: '01 post', cutoff: '37.36' },
    { district: 'Panipat', category: 'General', posts: '02 posts', cutoff: '56.52' },
    { district: 'Panipat', category: 'General-ESM', posts: '02 posts', cutoff: '44.60' },
    { district: 'Panipat', category: 'EWS', posts: '01 post', cutoff: '53.66' },
    { district: 'Panipat', category: 'SC', posts: '02 posts', cutoff: '54.08' },
    { district: 'Panipat', category: 'BCA', posts: '01 post', cutoff: '50.98' },
    { district: 'Panipat', category: 'BCA-ESM', posts: '01 post', cutoff: '46.36' },
    { district: 'Panipat', category: 'BCB', posts: '01 post', cutoff: '50.58' },
    { district: 'Rohtak', category: 'PWD (General)', posts: '01 post', cutoff: '57.00' },
    { district: 'Rohtak', category: 'General', posts: '01 post (02 posts including 01 PWD post)', cutoff: '59.00' },
    { district: 'Rohtak', category: 'General-ESM', posts: '01 post', cutoff: '31.44' },
    { district: 'Rohtak', category: 'EWS', posts: '01 post', cutoff: '54.00' },
    { district: 'Rohtak', category: 'SC', posts: '01 post', cutoff: '49.00' },
    { district: 'Rohtak', category: 'SC-ESM', posts: '01 post', cutoff: '45.06' },
    { district: 'Rohtak', category: 'BCA', posts: '02 posts', cutoff: '57.60' },
    { district: 'Rohtak', category: 'BCB', posts: '01 post', cutoff: '51.18' },
    { district: 'Rohtak', category: 'BCB-ESM', posts: '01 post', cutoff: '48.40' },
    { district: 'Sirsa', category: 'General', posts: '02 posts', cutoff: '56.26' },
    { district: 'Sirsa', category: 'EWS', posts: '02 posts', cutoff: '54.92' },
    { district: 'Sirsa', category: 'SC', posts: '01 post', cutoff: '46.18' },
    { district: 'Sirsa', category: 'SC-ESM', posts: '01 post', cutoff: '45.20' },
    { district: 'Sirsa', category: 'BCA', posts: '01 post', cutoff: '50.34' },
    { district: 'Sirsa', category: 'BCA-ESM', posts: '01 post', cutoff: '49.42' },
    { district: 'Sirsa', category: 'BCB', posts: '01 post', cutoff: '53.70' },
    { district: 'Sirsa', category: 'BCB-ESM', posts: '01 post', cutoff: '52.90' },
    { district: 'Sonepat', category: 'PWD (SC)', posts: '01 post', cutoff: '50.00' },
    { district: 'Sonepat', category: 'EWS', posts: '01 post', cutoff: '52.00' },
    { district: 'Sonepat', category: 'SC-ESM', posts: '01 post', cutoff: '52.02' },
    { district: 'Sonepat', category: 'BCB', posts: '03 posts', cutoff: '48.02' },
    { district: 'Sonepat', category: 'BCB-ESM', posts: '01 post', cutoff: '47.82' },
    { district: 'Yamuna Nagar', category: 'General', posts: '03 posts', cutoff: '59.00' },
    { district: 'Yamuna Nagar', category: 'General-ESM', posts: '02 posts', cutoff: '53.54' },
    { district: 'Yamuna Nagar', category: 'EWS', posts: '02 posts', cutoff: '58.04' },
    { district: 'Yamuna Nagar', category: 'SC', posts: '01 post', cutoff: '48.26' },
    { district: 'Yamuna Nagar', category: 'BCB', posts: '02 posts', cutoff: '54.34' },
]

const deoDistrictCutoffGroups =
    groupDistrictCutoffRows(deoDistrictCutoffRows)

const deoResult2024CutoffRows: DistrictCutoffRow[] = [
    { district: 'Panchkula/Chandigarh', category: 'PWD (General)', posts: '01 post', cutoff: '48.74' },
    { district: 'Panchkula/Chandigarh', category: 'General', posts: '27 posts (28 posts including 01 PWD post)', cutoff: '54.00' },
    { district: 'Panchkula/Chandigarh', category: 'General-ESM', posts: '10 posts', cutoff: '39.10' },
    { district: 'Panchkula/Chandigarh', category: 'EWS', posts: '06 posts', cutoff: '51.16' },
    { district: 'Panchkula/Chandigarh', category: 'SC', posts: '17 posts', cutoff: '45.74' },
    { district: 'Panchkula/Chandigarh', category: 'SC-ESM', posts: '03 posts', cutoff: '44.36' },
    { district: 'Panchkula/Chandigarh', category: 'BCA', posts: '19 posts', cutoff: '48.30' },
    { district: 'Panchkula/Chandigarh', category: 'BCB', posts: '11 posts', cutoff: '44.60' },
    { district: 'Panchkula/Chandigarh', category: 'BCB-ESM', posts: '06 posts', cutoff: '40.62' },
    { district: 'Ambala', category: 'General', posts: '06 posts', cutoff: '53.56' },
    { district: 'Ambala', category: 'General-ESM', posts: '02 posts', cutoff: '45.38' },
    { district: 'Ambala', category: 'EWS', posts: '02 posts', cutoff: '48.96' },
    { district: 'Ambala', category: 'SC', posts: '02 posts', cutoff: '50.10' },
    { district: 'Ambala', category: 'BCA', posts: '02 posts', cutoff: '52.38' },
    { district: 'Ambala', category: 'BCB', posts: '01 post', cutoff: '44.56' },
    { district: 'Faridabad', category: 'PWD (BCA)', posts: '01 post', cutoff: '40.04' },
    { district: 'Faridabad', category: 'General', posts: '05 posts', cutoff: '48.20' },
    { district: 'Faridabad', category: 'General-ESM', posts: '01 post', cutoff: '45.32' },
    { district: 'Faridabad', category: 'EWS', posts: '01 post', cutoff: '42.08' },
    { district: 'Faridabad', category: 'SC', posts: '02 posts', cutoff: '39.12' },
    { district: 'Faridabad', category: 'SC-ESM', posts: '01 post', cutoff: '29.22' },
    { district: 'Faridabad', category: 'BCA-ESM', posts: '01 post', cutoff: '41.62' },
    { district: 'Faridabad', category: 'BCB', posts: '02 posts', cutoff: '39.16' },
    { district: 'Faridabad', category: 'BCB-ESM', posts: '01 post', cutoff: '38.84' },
    { district: 'Gurugram', category: 'PWD (General)', posts: '01 post', cutoff: '40.44' },
    { district: 'Gurugram', category: 'General', posts: '07 posts (08 posts including 01 PWD post)', cutoff: '46.76' },
    { district: 'Gurugram', category: 'General-ESM', posts: '01 post', cutoff: '46.74' },
    { district: 'Gurugram', category: 'EWS', posts: '03 posts', cutoff: '43.74' },
    { district: 'Gurugram', category: 'SC', posts: '04 posts', cutoff: '36.94' },
    { district: 'Gurugram', category: 'BCA', posts: '02 posts', cutoff: '45.02' },
    { district: 'Gurugram', category: 'BCA-ESM', posts: '01 post', cutoff: '43.88' },
    { district: 'Gurugram', category: 'BCB', posts: '01 post', cutoff: '46.58' },
    { district: 'Hisar', category: 'General', posts: '03 posts', cutoff: '52.00' },
    { district: 'Hisar', category: 'General-ESM', posts: '01 post', cutoff: '50.48' },
    { district: 'Hisar', category: 'EWS', posts: '02 posts', cutoff: '46.52' },
    { district: 'Hisar', category: 'SC', posts: '03 posts', cutoff: '43.08' },
    { district: 'Hisar', category: 'SC-ESM', posts: '01 post', cutoff: '43.04' },
    { district: 'Hisar', category: 'BCA', posts: '02 posts', cutoff: '50.56' },
    { district: 'Hisar', category: 'BCA-ESM', posts: '01 post', cutoff: '50.32' },
    { district: 'Hisar', category: 'BCB', posts: '02 posts', cutoff: '46.64' },
    { district: 'Jhajjar', category: 'General', posts: '06 posts', cutoff: '53.00' },
    { district: 'Jhajjar', category: 'General-ESM', posts: '02 posts', cutoff: '46.80' },
    { district: 'Jhajjar', category: 'EWS', posts: '01 post', cutoff: '46.58' },
    { district: 'Jhajjar', category: 'SC', posts: '02 posts', cutoff: '46.86' },
    { district: 'Jhajjar', category: 'SC-ESM', posts: '01 post', cutoff: '44.90' },
    { district: 'Jhajjar', category: 'BCA', posts: '01 post', cutoff: '52.00' },
    { district: 'Jhajjar', category: 'BCA-ESM', posts: '01 post', cutoff: '48.84' },
    { district: 'Jhajjar', category: 'BCB', posts: '01 post', cutoff: '35.14' },
    { district: 'Karnal', category: 'PWD (BCA)', posts: '01 post', cutoff: '54.16' },
    { district: 'Karnal', category: 'General', posts: '06 posts', cutoff: '49.26' },
    { district: 'Karnal', category: 'General-ESM', posts: '01 post', cutoff: '34.10' },
    { district: 'Karnal', category: 'EWS', posts: '02 posts', cutoff: '47.16' },
    { district: 'Karnal', category: 'SC', posts: '03 posts', cutoff: '45.08' },
    { district: 'Karnal', category: 'BCA', posts: '01 post (02 posts including 01 PWD post)', cutoff: '48.30' },
    { district: 'Karnal', category: 'BCB', posts: '01 post', cutoff: '41.98' },
    { district: 'Kurukshetra', category: 'PWD (SC)', posts: '01 post', cutoff: '48.00' },
    { district: 'Kurukshetra', category: 'General', posts: '06 posts', cutoff: '53.84' },
    { district: 'Kurukshetra', category: 'General-ESM', posts: '01 post', cutoff: '53.80' },
    { district: 'Kurukshetra', category: 'EWS', posts: '02 posts', cutoff: '51.08' },
    { district: 'Kurukshetra', category: 'SC', posts: '02 posts (03 posts including 01 PWD post)', cutoff: '49.26' },
    { district: 'Kurukshetra', category: 'BCA', posts: '02 posts', cutoff: '52.22' },
    { district: 'Kurukshetra', category: 'BCB', posts: '01 post', cutoff: '48.54' },
    { district: 'Palwal', category: 'PWD (SC)', posts: '01 post', cutoff: '34.06' },
    { district: 'Palwal', category: 'General', posts: '06 posts', cutoff: '47.86' },
    { district: 'Palwal', category: 'General-ESM', posts: '02 posts', cutoff: '43.50' },
    { district: 'Palwal', category: 'EWS', posts: '02 posts', cutoff: '41.96' },
    { district: 'Palwal', category: 'SC', posts: '01 post (02 posts including 01 PWD post)', cutoff: '46.00' },
    { district: 'Palwal', category: 'SC-ESM', posts: '01 post', cutoff: '39.20' },
    { district: 'Palwal', category: 'BCB', posts: '01 post', cutoff: '32.48' },
    { district: 'Rewari', category: 'General', posts: '06 posts', cutoff: '49.60' },
    { district: 'Rewari', category: 'General-ESM', posts: '02 posts', cutoff: '45.22' },
    { district: 'Rewari', category: 'EWS', posts: '02 posts', cutoff: '43.26' },
    { district: 'Rewari', category: 'SC', posts: '03 posts', cutoff: '39.64' },
    { district: 'Rewari', category: 'BCA', posts: '02 posts', cutoff: '48.14' },
    { district: 'Sirsa', category: 'PWD (BCA)', posts: '01 post', cutoff: '47.00' },
    { district: 'Sirsa', category: 'General', posts: '07 posts', cutoff: '52.00' },
    { district: 'Sirsa', category: 'General-ESM', posts: '02 posts', cutoff: '50.64' },
    { district: 'Sirsa', category: 'EWS', posts: '01 post', cutoff: '51.10' },
    { district: 'Sirsa', category: 'SC', posts: '02 posts', cutoff: '47.30' },
    { district: 'Sirsa', category: 'BCA', posts: '01 post (02 posts including 01 PWD post)', cutoff: '48.66' },
    { district: 'Sirsa', category: 'BCB', posts: '01 post', cutoff: '49.88' },
    { district: 'Sonipat', category: 'General', posts: '05 posts', cutoff: '47.38' },
    { district: 'Sonipat', category: 'EWS', posts: '01 post', cutoff: '40.92' },
    { district: 'Sonipat', category: 'SC', posts: '01 post', cutoff: '41.88' },
    { district: 'Sonipat', category: 'SC-ESM', posts: '01 post', cutoff: '40.44' },
    { district: 'Sonipat', category: 'BCB', posts: '01 post', cutoff: '31.00' },
]

const deoResult2024CutoffGroups =
    groupDistrictCutoffRows(deoResult2024CutoffRows)

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
    const showCutoff =
        page.slug === 'hartron-cut-off'
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
                                HARTRON Exam Pattern
                            </h2>
                            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                <div className="grid grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1.2fr] bg-slate-950 text-xs font-black uppercase tracking-[0.08em] text-white max-lg:hidden">
                                    <div className="px-4 py-3">
                                        Post
                                    </div>
                                    <div className="px-4 py-3">
                                        Paper
                                    </div>
                                    <div className="px-4 py-3">
                                        Questions
                                    </div>
                                    <div className="px-4 py-3">
                                        Time
                                    </div>
                                    <div className="px-4 py-3">
                                        Next step
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-200">
                                    {examPatternRows.map((item) => (
                                        <div key={`${item.post}-${item.paper}`} className="grid gap-3 bg-slate-50 px-4 py-4 text-sm font-semibold leading-6 text-slate-700 lg:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1.2fr] lg:items-center lg:bg-white">
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 lg:hidden">
                                                    Post
                                                </span>
                                                <span className="font-black text-slate-950">
                                                    {item.post}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 lg:hidden">
                                                    Paper
                                                </span>
                                                {item.paper}
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 lg:hidden">
                                                    Questions
                                                </span>
                                                {item.questions}
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 lg:hidden">
                                                    Time
                                                </span>
                                                {item.time}
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 lg:hidden">
                                                    Next step
                                                </span>
                                                {item.nextStep}
                                                {'href' in item && item.href && (
                                                    <Link className="ml-0 mt-2 inline-flex rounded-xl bg-violet-700 px-3 py-2 text-xs font-black text-white lg:ml-2 lg:mt-0" href={item.href}>
                                                        {item.linkText}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

                {showCutoff && (
                    <section className="mt-6 grid gap-6">
                        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                                Result 1 - Kurukshetra University cutoff
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-slate-950">
                                HARTRON DEO Kurukshetra University, Kurukshetra Cutoff
                            </h2>
                            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                                Declaration of result dated 06.04.2026 for advertisement no. HARTRON/ICTET/2025-26/06 dated 25.12.2025. Test/exam and document scrutiny were conducted from 17.02.2026 to 17.03.2026 at IDDC HARTRON, G.T. Road, Ambala Cantt for Data Entry Operator panel updation at Kurukshetra District on job-work basis for deployment in Kurukshetra University, Kurukshetra.
                            </p>
                            <AdDownloadLink
                                adUrl={resultDownloadAdUrl}
                                className="mt-4 inline-flex rounded-2xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700"
                                href={resultPdfLinks.kuk2026}
                            >
                                Download official result PDF
                            </AdDownloadLink>
                            <div className="mt-5 grid gap-3 md:grid-cols-4">
                                {[
                                    ['Result date', '06.04.2026'],
                                    ['Advertisement', 'HARTRON/ICTET/2025-26/06'],
                                    ['Post', 'Data Entry Operator'],
                                    ['Deployment', 'Kurukshetra University, Kurukshetra'],
                                ].map(([label, value]) => (
                                    <div key={label} className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                                        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-violet-700">
                                            {label}
                                        </p>
                                        <p className="mt-2 text-sm font-black leading-5 text-slate-950">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <div className="grid grid-cols-[1fr_1.35fr_0.65fr] bg-slate-950 text-xs font-black uppercase tracking-[0.08em] text-white max-md:hidden">
                                    <div className="px-4 py-3">
                                        Category
                                    </div>
                                    <div className="px-4 py-3">
                                        Posts
                                    </div>
                                    <div className="px-4 py-3">
                                        Cutoff
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-200">
                                    {deoCutoffRows.map((item) => (
                                        <div key={item.category} className="grid gap-2 bg-white px-4 py-4 text-sm font-semibold leading-6 text-slate-700 md:grid-cols-[1fr_1.35fr_0.65fr] md:items-center">
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                    Category
                                                </span>
                                                <span className="font-black text-slate-950">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                    Posts
                                                </span>
                                                {item.posts}
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                    Cutoff
                                                </span>
                                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                    {item.cutoff}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-violet-100 bg-violet-50/50 p-6 shadow-sm sm:p-8">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                                Result 2 - District-wise cutoff
                            </p>
                            <h3 className="mt-2 text-lg font-black text-slate-950">
                                HARTRON DEO District-wise Cutoff
                            </h3>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                                Declaration of result dated 11.12.2025 for advertisement no. HARTRON/ICTET/2025/02 dated 02.08.2025. The test/exam and document scrutiny were conducted from 15.09.2025 to 12.11.2025 at HMSDC Gurugram and IDDC Ambala Cantt for Data Entry Operator panel updation.
                            </p>
                            <AdDownloadLink
                                adUrl={resultDownloadAdUrl}
                                className="mt-4 inline-flex rounded-2xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700"
                                href={resultPdfLinks.district2025}
                            >
                                Download official result PDF
                            </AdDownloadLink>
                            <div className="mt-4 grid gap-4">
                                {deoDistrictCutoffGroups.map((group) => (
                                    <div key={group.district} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                        <div className="bg-slate-950 px-4 py-3">
                                            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-white">
                                                {group.district}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-[1fr_1.35fr_0.65fr] bg-slate-100 text-xs font-black uppercase tracking-[0.08em] text-slate-700 max-md:hidden">
                                            <div className="px-4 py-3">
                                                Category
                                            </div>
                                            <div className="px-4 py-3">
                                                Posts
                                            </div>
                                            <div className="px-4 py-3">
                                                Cutoff
                                            </div>
                                        </div>
                                        <div className="divide-y divide-slate-200">
                                            {group.rows.map((item) => (
                                                <div key={`${group.district}-${item.category}`} className="grid gap-2 bg-white px-4 py-4 text-sm font-semibold leading-6 text-slate-700 md:grid-cols-[1fr_1.35fr_0.65fr] md:items-center">
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Category
                                                        </span>
                                                        <span className="font-black text-slate-950">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Posts
                                                        </span>
                                                        {item.posts}
                                                    </div>
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Cutoff
                                                        </span>
                                                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                            {item.cutoff}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                                Result 3 - District-wise cutoff
                            </p>
                            <h3 className="mt-2 text-lg font-black text-slate-950">
                                HARTRON DEO District-wise Cutoff - 24.12.2024 Result
                            </h3>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                                Declaration of result dated 24.12.2024 for advertisement no. HARTRON/ICTET/2024-25/04 dated 15.08.2024. The test/exam and document scrutiny were conducted from 23.10.2024 to 28.11.2024 at HMSDC Gurugram and IDDC Ambala Cantt for Data Entry Operator posts across Panchkula/Chandigarh, Ambala, Faridabad, Gurugram, Hisar, Jhajjar, Karnal, Kurukshetra, Palwal, Rewari, Sirsa, and Sonipat.
                            </p>
                            <AdDownloadLink
                                adUrl={resultDownloadAdUrl}
                                className="mt-4 inline-flex rounded-2xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700"
                                href={resultPdfLinks.district2024}
                            >
                                Download official result PDF
                            </AdDownloadLink>
                            <div className="mt-4 grid gap-4">
                                {deoResult2024CutoffGroups.map((group) => (
                                    <div key={group.district} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                        <div className="bg-slate-950 px-4 py-3">
                                            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-white">
                                                {group.district}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-[1fr_1.35fr_0.65fr] bg-slate-100 text-xs font-black uppercase tracking-[0.08em] text-slate-700 max-md:hidden">
                                            <div className="px-4 py-3">
                                                Category
                                            </div>
                                            <div className="px-4 py-3">
                                                Posts
                                            </div>
                                            <div className="px-4 py-3">
                                                Cutoff
                                            </div>
                                        </div>
                                        <div className="divide-y divide-slate-200">
                                            {group.rows.map((item) => (
                                                <div key={`${group.district}-${item.category}`} className="grid gap-2 bg-white px-4 py-4 text-sm font-semibold leading-6 text-slate-700 md:grid-cols-[1fr_1.35fr_0.65fr] md:items-center">
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Category
                                                        </span>
                                                        <span className="font-black text-slate-950">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Posts
                                                        </span>
                                                        {item.posts}
                                                    </div>
                                                    <div>
                                                        <span className="mb-1 block text-[11px] font-black uppercase text-violet-700 md:hidden">
                                                            Cutoff
                                                        </span>
                                                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                            {item.cutoff}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

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
            <div className="mx-auto mt-8 max-w-6xl">
                <Footer />
            </div>
        </main>
    )
}
