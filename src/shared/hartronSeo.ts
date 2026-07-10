export type HartronPageSlug =
    | 'hartron-test-series'
    | 'hartron-syllabus'
    | 'hartron-exam-pattern'
    | 'hartron-previous-year-papers'
    | 'hartron-cut-off'

export type HartronSupportPage = {
    slug: HartronPageSlug
    title: string
    description: string
    intro: string
}

export type HartronSyllabusGroup = {
    title: string
    note?: string
    topics: string[]
}

export const hartronSeriesLinks = [
    {
        match: 'programmer',
        exclude: ['junior'],
        searches: ['hartron programmer', 'programmer'],
        title: 'HARTRON Programmer Test Series',
        text: 'Practice programmer-level computer questions, reasoning, aptitude, and exam-style online mock tests.',
    },
    {
        match: 'junior programmer',
        searches: ['hartron junior programmer', 'junior programmer'],
        title: 'HARTRON Junior Programmer Test Series',
        text: 'Prepare for junior programmer posts with topic-wise practice and full-length online tests.',
    },
    {
        match: 'data entry',
        searches: ['hartron data entry', 'data entry operator', 'deo'],
        title: 'HARTRON Data Entry Operator Test Series',
        text: 'Build speed and accuracy for DEO computer knowledge, typing, and office-work related questions.',
    },
    {
        match: 'software developer',
        searches: ['hartron software developer', 'software developer'],
        title: 'HARTRON Software Developer Test Series',
        text: 'Attempt software development practice sets covering programming, databases, web basics, and logic.',
    },
]

export const hartronSupportPages: HartronSupportPage[] = [
    {
        slug: 'hartron-test-series',
        title: 'HARTRON Test Series',
        description:
            'Prepare for HARTRON Programmer, Junior Programmer, Software Developer, System Analyst, Networking posts, and DEO practice with online mock tests, PYQs, syllabus, and exam-pattern practice on Menturo.',
        intro:
            'Menturo HARTRON test series pages bring post-wise online mock tests, technical syllabus topics, computer questions, exam-pattern practice, and previous-year style preparation into one connected study path.',
    },
    {
        slug: 'hartron-syllabus',
        title: 'HARTRON Syllabus',
        description:
            'Check HARTRON syllabus topics for Programmer, Junior Programmer, Software Developer, System Analyst, Networking Engineer, and Networking Assistant preparation with practice links.',
        intro:
            'Use this HARTRON syllabus guide to map post-wise domain-knowledge topics to the right Menturo practice pages for Programmer, Junior Programmer, Software Developer, System Analyst, and Networking posts.',
    },
    {
        slug: 'hartron-exam-pattern',
        title: 'HARTRON Exam Pattern',
        description:
            'Understand HARTRON exam pattern, question types, computer knowledge areas, practice strategy, and mock-test planning for HARTRON posts.',
        intro:
            'The HARTRON exam pattern can vary by post, but most preparation should combine computer knowledge, practical aptitude, timed practice, and post-specific mock tests.',
    },
    {
        slug: 'hartron-previous-year-papers',
        title: 'HARTRON Previous Year Papers',
        description:
            'Practice HARTRON previous year paper style questions, computer PYQs, mock tests, and repeated topics for HARTRON Programmer, technical posts, and DEO preparation.',
        intro:
            'HARTRON previous-year style practice helps you understand repeated computer topics, question difficulty, and the kind of revision needed before the exam.',
    },
    {
        slug: 'hartron-cut-off',
        title: 'HARTRON Cut Off',
        description:
            'Check HARTRON cut off marks, result details, category-wise posts, and Data Entry Operator cutoff for Kurukshetra University, Kurukshetra.',
        intro:
            'Use this HARTRON cut off page to track result notices, category-wise cutoff marks, post counts, and district or deployment-specific cutoff details as they are added.',
    },
]

export const hartronSupportMap =
    Object.fromEntries(
        hartronSupportPages.map((page) => [page.slug, page])
    ) as Record<HartronPageSlug, HartronSupportPage>

export const hartronPagePath = (slug: HartronPageSlug) => `/${slug}`

export const hartronSyllabusGroups: HartronSyllabusGroup[] = [
    {
        title: 'Software Developer and Mobile Application Developer',
        topics: [
            'ASP .Net / Java / PHP',
            'Programming in C/C++',
            'Internet, HTML/DHTML',
            'System Analysis and Design',
            'SQL Server',
            'DBMS',
            'Project Management',
            'Linux/Unix',
        ],
    },
    {
        title: 'System Analyst',
        topics: [
            'ASP .Net',
            'Visual Basic',
            'Java',
            'Programming in C/C++',
            'Windows Server',
            'Internet, HTML/DHTML',
            'Oracle',
            'Networking',
            'System Analysis and Design',
            'SQL Server',
            'Operating System',
            'DBMS',
            'Project Management',
            'Linux/Unix',
            'PHP',
        ],
    },
    {
        title: 'Programmer',
        topics: [
            'ASP .Net',
            'Visual Basic',
            'Java',
            'Programming in C/C++',
            'Windows Server',
            'Internet, HTML/DHTML',
            'Oracle',
            'Networking',
            'System Analysis and Design',
            'SQL Server',
            'Operating System',
            'DBMS',
            'Windows and Computer Fundamental',
            'Linux/Unix',
            'PHP',
        ],
    },
    {
        title: 'Junior Programmer',
        topics: [
            'ASP .Net',
            'Visual Basic',
            'Java',
            'Programming in C/C++',
            'MS Office',
            'Internet, HTML/DHTML',
            'Windows and Computer Fundamentals',
            'Networking',
            'System Analysis and Design',
            'Hardware concept',
            'Operating System',
            'DBMS',
            'PHP',
        ],
    },
    {
        title: 'Networking Engineer',
        topics: [
            'Hardware Concept',
            'Windows Server',
            'Internet, HTML/DHTML',
            'Oracle',
            'Networking',
            'System Analysis and Design',
            'SQL Server',
            'Operating System',
            'DBMS',
            'Linux/Unix',
            'Windows and Computer Fundamentals',
        ],
    },
    {
        title: 'Networking Assistant',
        topics: [
            'Hardware Concept',
            'Windows Server',
            'Internet, HTML/DHTML',
            'MS Office',
            'Networking',
            'Operating System',
            'Linux/Unix',
            'Windows and Computer Fundamentals',
        ],
    },
]
