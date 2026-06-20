'use client'

import { useRouter } from 'next/navigation'
import {
    useEffect,
    useDeferredValue,
    useMemo,
    useRef,
    useState
} from 'react'

import type {
    ChangeEvent,
    CompositionEvent,
    KeyboardEvent,
    ReactNode
} from 'react'

import {
    BadgeCheck,
    BarChart3,
    CalendarDays,
    ChevronDown,
    Check,
    Clock3,
    Expand,
    Eye,
    EyeOff,
    Gauge,
    Keyboard,
    Lightbulb,
    Lock,
    Minimize,
    Send,
    Settings,
    Sparkles,
    Target,
    Trophy,
    User,
    X
} from 'lucide-react'
import {
    LOAD_TYPING_TESTS,
    EXIT_TYPING_TEST,
    RESUME_TYPING_TEST,
    START_TYPING_TEST,
    TYPING_SOLUTION,
    TYPING_HISTORY,
    TYPING_RESULT
} from '../../../api'
import TestSectionHead from '../../shared/components/TestSectionHead'
import Spinner from '../../shared/components/Spinner'
import TestActionLoader from '../../shared/components/TestActionLoader'
import { useUserStore } from '../../shared/store/user'
import { showPopupMessage } from '../../shared/utils/popup'
import { showRouteLoader } from '../../shared/utils/routeLoader'
import {
    hideTestActionLoader,
    showTestActionLoader
} from '../../shared/utils/testActionLoader'

type Language = 'hindi' | 'english'

type HindiInputMode = 'unicode' | 'phonetic' | 'remington'

type Result = ReturnType<typeof computeResult>

type TypingTestData = {
    testId: string
    historyId?: string
    attemptNo?: number
    title: string
    language: Language
    level: number
    levelName: string
    duration: number
    words?: number
    paragraph: string
    typedText?: string
}

type TypingHistoryItem = {
    resultId: string
    testId: string
    title: string
    attemptedAt: number
    duration: number
    level: number
    levelName: string
    netWpm: number
    grossWpm: number
    accuracy: number
    rank?: number
    totalUsers?: number
}

type TypingTestListItem = {
    testId: string
    title: string
    language: Language
    level: number
    levelName: string
    duration: number
    totalAttempt?: number
    totalUsers?: number
    access?: boolean
    available?: boolean
    levelUnlocked?: boolean
    buttonName?: string
    actions?: {
        primary?: 'start' | 'resume' | 'test-again'
        resumeHistoryId?: string
        solutionHistoryId?: string
    }
    history?: Array<{
        historyId?: string
        status?: string
        attemptNo?: number
        score?: number
        accuracy?: number
    }>
}

type SubmitResponse = {
    success: boolean
    message?: string
    resultId?: string
    result?: Result
    rank?: number
    totalUsers?: number
    level?: number
    levelName?: string
    best?: boolean
    history?: TypingHistoryItem[]
    historyItem?: {
        historyId: string
        status: 'submitted' | 'resume'
        score?: number
        accuracy?: number
    }
    levelProgress?: Record<string, {
        total: number
        passed: number
        percent: number
        minimumSpeed: number
        minimumAccuracy: number
        complete: boolean
    }>
    levelAccess?: Record<string, boolean>
}

const romanMap = [
    ['ksh', 'क्ष'],
    ['tra', 'त्र'],
    ['gya', 'ज्ञ'],
    ['shr', 'श्र'],
    ['chh', 'छ'],
    ['thh', 'ठ'],
    ['dhh', 'ढ'],
    ['aa', 'आ'],
    ['ii', 'ई'],
    ['ee', 'ई'],
    ['uu', 'ऊ'],
    ['oo', 'ऊ'],
    ['ai', 'ऐ'],
    ['au', 'औ'],
    ['kh', 'ख'],
    ['gh', 'घ'],
    ['ch', 'च'],
    ['jh', 'झ'],
    ['th', 'थ'],
    ['dh', 'ध'],
    ['ph', 'फ'],
    ['bh', 'भ'],
    ['sh', 'श'],
    ['ri', 'ऋ'],
    ['a', 'अ'],
    ['b', 'ब'],
    ['c', 'क'],
    ['d', 'द'],
    ['e', 'ए'],
    ['f', 'फ'],
    ['g', 'ग'],
    ['h', 'ह'],
    ['i', 'इ'],
    ['j', 'ज'],
    ['k', 'क'],
    ['l', 'ल'],
    ['m', 'म'],
    ['n', 'न'],
    ['o', 'ओ'],
    ['p', 'प'],
    ['q', 'क'],
    ['r', 'र'],
    ['s', 'स'],
    ['t', 'त'],
    ['u', 'उ'],
    ['v', 'व'],
    ['w', 'व'],
    ['x', 'क्स'],
    ['y', 'य'],
    ['z', 'ज']
]

const hindiInputModes: Array<{
    value: HindiInputMode
    label: string
    detail: string
}> = [
    {
        value: 'unicode',
        label: 'Unicode',
        detail: 'Direct Hindi'
    },
    {
        value: 'phonetic',
        label: 'Google Indic',
        detail: 'bharat -> भारत'
    },
    {
        value: 'remington',
        label: 'Remington',
        detail: 'KrutiDev/DevLys'
    }
]

const krutiDevShortcutMap: Record<string, string> = {
    '¡': 'ँ',
    '£': 'ख्र',
    'ª': '्र',
    '«': 'त्र्',
    '¶': 'फ्',
    '¸': 'य्',
    '¼': '(',
    '½': ')',
    'Å': 'ऊ',
    'Ì': 'द्य',
    'Í': 'ट्ट',
    'Î': 'ट्ठ',
    'Ï': 'ड्ड',
    'Ñ': 'कृ',
    'Ô': 'ड्ढ',
    'Ø': 'क्र',
    'Ù': 'त्त्',
    'Ý': 'फ्र',
    'à': 'ह्न',
    'á': 'ह्य',
    'â': 'ह्र',
    'ã': 'ह्म',
    'ä': 'क्त',
    'æ': 'द्र',
    'é': 'न्न',
    'ó': 'स्त्र'
}

const remingtonKeyMap: Record<string, string> = {
    q: 'ु',
    w: 'ू',
    e: 'म',
    r: 'त',
    t: 'ज',
    y: 'ल',
    u: 'न',
    i: 'प',
    o: 'व',
    p: 'च',
    a: 'ं',
    s: 'े',
    d: 'क',
    f: 'ि',
    g: 'ह',
    h: 'ी',
    j: 'र',
    k: 'ा',
    l: 'स',
    z: '्र',
    x: 'ग',
    c: 'ब',
    v: 'अ',
    b: 'इ',
    n: 'द',
    m: 'उ',
    Q: 'फ',
    W: 'ऊ',
    E: 'म्',
    R: 'त्',
    T: 'ज्',
    Y: 'ल्',
    U: 'न्',
    I: 'प्',
    O: 'व्',
    P: 'च्',
    A: '।',
    S: 'ै',
    D: 'क्',
    F: 'थ',
    G: 'ळ',
    H: 'भ',
    J: 'श्र',
    K: 'ज्ञ',
    L: 'स्',
    Z: 'र्',
    X: 'ग्',
    C: 'ब्',
    V: 'ट',
    B: 'ठ',
    N: 'छ',
    M: 'ड',
    '`': '़',
    '~': 'द्य',
    '-': '-',
    '=': 'ृ',
    '[': 'ख',
    ']': ',',
    '\\': 'ॉ',
    ';': 'य',
    "'": 'श',
    ',': 'ए',
    '.': 'ण',
    '/': 'ध',
    '<': 'ऐ',
    '>': 'झ',
    '?': 'घ'
}

const legacyRemingtonInputChars =
    new Set([
        ...Object.keys(krutiDevShortcutMap),
        ...Object.keys(remingtonKeyMap)
    ])

const levels = [
    'Easy',
    'Medium',
    'Hard',
    'Expert',
    'Master'
]

export default function TypingProPage() {

    const router =
        useRouter()

    const typingRef =
        useRef<HTMLTextAreaElement>(null)

    const paragraphRef =
        useRef<HTMLDivElement>(null)

    const testShellRef =
        useRef<HTMLDivElement>(null)

    const timerRef =
        useRef<ReturnType<typeof setInterval> | null>(null)

    const scrollFrameRef =
        useRef<number | null>(null)

    const typingFrameRef =
        useRef<number | null>(null)

    const pendingTypingFocusRef =
        useRef(false)

    const typedRef =
        useRef('')

    const typingTestsLoadingRef =
        useRef(false)

    const typingTestsRequestIdRef =
        useRef(0)

    const resumeExpiredRef =
        useRef(false)

    const zeroTimeSubmitRef =
        useRef(false)

    const composingHindiRef =
        useRef(false)

    const user =
        useUserStore(
            (state) => state.user
        )

    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )

    const authChecked =
        useUserStore(
            (state) => state.authChecked
        )

    const fetchUser =
        useUserStore(
            (state) => state.fetchUser
        )

    const displayName =
        [
            user?.firstName,
            user?.lastName
        ]
            .filter(Boolean)
            .join(' ') ||
        user?.username ||
        'Guest'

    const [language, setLanguage] =
        useState<Language>('hindi')

    const [activeTypingLanguage, setActiveTypingLanguage] =
        useState<Language>('english')

    const [activeLevel, setActiveLevel] =
        useState('Easy')

    const [levelAccess, setLevelAccess] =
        useState<Record<string, boolean>>({
            Easy: true
        })

    const previousLevelAccessRef =
        useRef<Record<string, boolean>>({
            Easy: true
        })

    const [levelProgress, setLevelProgress] =
        useState<Record<string, {
            total: number
            passed: number
            percent: number
            minimumSpeed: number
            minimumAccuracy: number
            complete: boolean
        }>>({})

    const [testId, setTestId] =
        useState('')

    const [availableTests, setAvailableTests] =
        useState<TypingTestListItem[]>([])

    const [loadingAvailableTests, setLoadingAvailableTests] =
        useState(false)

    const [typingTestsPage, setTypingTestsPage] =
        useState(1)

    const [typingTestsHasMore, setTypingTestsHasMore] =
        useState(true)

    const [selectedTest, setSelectedTest] =
        useState<TypingTestListItem | null>(null)

    const [testData, setTestData] =
        useState<TypingTestData | null>(null)

    const [loadingTest, setLoadingTest] =
        useState(false)

    const [loadingTestKey, setLoadingTestKey] =
        useState('')

    const [submittingResult, setSubmittingResult] =
        useState(false)

    const [history, setHistory] =
        useState<TypingHistoryItem[]>([])

    const [historyPage, setHistoryPage] =
        useState(1)

    const [historyHasMore, setHistoryHasMore] =
        useState(true)

    const [loadingHistory, setLoadingHistory] =
        useState(false)

    const [resultMeta, setResultMeta] =
        useState<SubmitResponse | null>(null)

    const [duration, setDuration] =
        useState(1)

    const [remaining, setRemaining] =
        useState(60)

    const [typed, setTyped] =
        useState('')

    const [started, setStarted] =
        useState(false)

    const [ended, setEnded] =
        useState(false)

    const [backspaceEnabled, setBackspaceEnabled] =
        useState(true)

    const [highlightEnabled, setHighlightEnabled] =
        useState(true)

    const [autoScrollEnabled, setAutoScrollEnabled] =
        useState(true)

    const [liveSpellingEnabled, setLiveSpellingEnabled] =
        useState(true)

    const [hindiInputMode, setHindiInputMode] =
        useState<HindiInputMode>('phonetic')

    const [backspaces, setBackspaces] =
        useState(0)

    const [result, setResult] =
        useState<Result | null>(null)

    const [isFullscreen, setIsFullscreen] =
        useState(false)

    const [showLivePanel, setShowLivePanel] =
        useState(true)

    const [activeMode, setActiveMode] =
        useState<'idle' | 'test' | 'solution'>('idle')

    const activeText =
        testData?.paragraph || ''

    const hasLoadedParagraph =
        Boolean(testData?.paragraph)

    const activeDuration =
        testData?.duration || duration

    const displayLanguage =
        hasLoadedParagraph
            ? language
            : activeTypingLanguage

    const settingsLocked =
        activeMode === 'test' &&
        hasLoadedParagraph &&
        !ended

    const listControlsLocked =
        settingsLocked ||
        loadingAvailableTests ||
        loadingTest

    const solutionMode =
        activeMode === 'solution'

    const runningTest =
        activeMode === 'test' &&
        hasLoadedParagraph &&
        !ended

    const expectedChars =
        useMemo(
            () => splitGraphemes(activeText),
            [activeText]
        )

    const typedChars =
        useMemo(
            () => splitGraphemes(typed),
            [typed]
        )

    const deferredTyped =
        useDeferredValue(typed)

    const currentWordStart =
        useMemo(
            () => findExpectedBoundaryAfterWords(
                expectedChars,
                countCommittedTypedWords(typedChars)
            ),
            [
                expectedChars,
                typedChars
            ]
        )

    const hindiCommittedUntil =
        useMemo(
            () =>
                displayLanguage === 'hindi'
                    ? findHindiCommittedUntil(
                        expectedChars,
                        typedChars
                    )
                    : currentWordStart,
            [
                expectedChars,
                typedChars,
                displayLanguage,
                currentWordStart
            ]
        )

    const currentWordEnd =
        useMemo(
            () =>
                findCurrentWordEnd(
                    expectedChars,
                    currentWordStart
                ),
            [
                expectedChars,
                currentWordStart
            ]
        )

    const hindiActiveWordEnd =
        useMemo(
            () =>
                displayLanguage === 'hindi'
                    ? findCurrentWordEnd(
                        expectedChars,
                        currentWordStart
                    )
                    : currentWordEnd,
            [
                expectedChars,
                displayLanguage,
                currentWordStart,
                currentWordEnd
            ]
        )

    // Keep the entire paragraph visible, but render only three reactive text
    // nodes. Per-word/character React nodes make mobile browsers stutter.
    const paragraphDisplay =
        useMemo(() => {
            const activeEnd =
                displayLanguage === 'hindi'
                    ? hindiActiveWordEnd
                    : currentWordEnd + 1

            return {
                completed: expectedChars.slice(0, currentWordStart).join(''),
                current: expectedChars.slice(currentWordStart, activeEnd).join(''),
                upcoming: expectedChars.slice(activeEnd).join('')
            }
        }, [
            currentWordEnd,
            currentWordStart,
            displayLanguage,
            expectedChars,
            hindiActiveWordEnd
        ])

    const liveSpellingSegments =
        useMemo(() => {
            const segments: Array<{
                text: string
                className: string
                current: boolean
            }> = []
            const typedText = typedChars.join('')
            const typedWords = typedText.trim()
                ? typedText.trim().split(/\s+/)
                : []
            const endsWithSpace = /\s$/.test(typedText)
            const activeWordIndex = endsWithSpace
                ? typedWords.length
                : Math.max(0, typedWords.length - 1)
            const committedWordCount = endsWithSpace
                ? typedWords.length
                : Math.max(0, typedWords.length - 1)
            let expectedCursor = 0
            let wordIndex = 0

            const append = (
                text: string,
                className = '',
                current = false
            ) => {
                if (!text) return

                const previous = segments.at(-1)
                if (
                    previous &&
                    previous.className === className &&
                    previous.current === current
                ) {
                    previous.text += text
                    return
                }

                segments.push({ text, className, current })
            }

            while (expectedCursor < expectedChars.length) {
                if (isWhitespaceGrapheme(expectedChars[expectedCursor])) {
                    append(expectedChars[expectedCursor])
                    expectedCursor += 1
                    continue
                }

                const wordStart = expectedCursor
                while (
                    expectedCursor < expectedChars.length &&
                    !isWhitespaceGrapheme(expectedChars[expectedCursor])
                ) {
                    expectedCursor += 1
                }

                const expectedWord = expectedChars.slice(wordStart, expectedCursor)

                if (wordIndex > activeWordIndex) {
                    append(expectedChars.slice(wordStart).join(''))
                    break
                }

                const typedWord = splitGraphemes(typedWords[wordIndex] || '')
                const isCurrentWord = wordIndex === activeWordIndex
                const isIncompleteCommittedWord =
                    wordIndex < committedWordCount &&
                    typedWord.length !== expectedWord.length

                expectedWord.forEach((char, index) => {
                    const isWrongKeystroke =
                        isIncompleteCommittedWord ||
                        (
                            index < typedWord.length &&
                            typedWord[index] !== char
                        )
                    const className = isWrongKeystroke
                        ? 'rounded bg-red-100 text-red-700'
                        : isCurrentWord && highlightEnabled
                            ? 'bg-yellow-100 border-b-2 border-yellow-500'
                            : ''

                    append(char, className, isCurrentWord)
                })

                wordIndex += 1
            }

            return segments
        }, [
            expectedChars,
            highlightEnabled,
            typedChars
        ])

    const liveResult =
        useMemo(
            () =>
                computeLiveResult({
                    expected: activeText,
                    actual: deferredTyped,
                    durationSec: activeDuration * 60,
                    remaining,
                    backspaces
                }),
            [
                activeText,
                deferredTyped,
                activeDuration,
                remaining,
                backspaces
            ]
        )

    useEffect(() => {

        setRemaining(duration * 60)
        setTyped('')
        setStarted(false)
        setEnded(false)
        setBackspaces(0)
        setResult(null)
        setActiveMode('idle')
        typedRef.current = ''

        if (typingRef.current) {
            typingRef.current.value = ''
        }

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

    }, [
        duration
    ])

    useEffect(() => {
        const urlTestId =
            new URLSearchParams(window.location.search).get('testId')

        if (urlTestId) {
            setTestId(urlTestId)
        }

    }, [])

    useEffect(() => {
        void loadHistory(
            1,
            true
        )
    }, [
        testData?.testId,
        selectedTest?.testId,
        testId,
        activeTypingLanguage
    ])

    useEffect(() => {
        setAvailableTests([])
        setSelectedTest(null)
        setTestData(null)
        setTypingTestsPage(1)
        setTypingTestsHasMore(true)
        setLevelAccess({
            Easy: true
        })
        previousLevelAccessRef.current = {
            Easy: true
        }
        setLevelProgress({})
        resetTest()
        void loadTypingTests(
            activeLevel,
            1,
            true,
            activeTypingLanguage
        )
    }, [
        activeLevel,
        activeTypingLanguage
    ])

    useEffect(() => {
        if (!authenticated && !authChecked) {
            fetchUser()
        }
    }, [
        authChecked,
        authenticated,
        fetchUser
    ])

    useEffect(() => {

        const handleKeyUp = (
            event: globalThis.KeyboardEvent
        ) => {

            if (
                event.key === 'Escape' &&
                document.fullscreenElement
            ) {
                document.exitFullscreen()
            }
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement))
        }

        document.addEventListener(
            'keyup',
            handleKeyUp
        )

        document.addEventListener(
            'fullscreenchange',
            handleFullscreenChange
        )

        return () => {
            document.removeEventListener(
                'keyup',
                handleKeyUp
            )

            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
        }

    }, [])

    useEffect(() => {

        if (!highlightEnabled || !autoScrollEnabled) return

        const current =
            paragraphRef.current?.querySelector('[data-current="true"]')

        if (scrollFrameRef.current) {
            cancelAnimationFrame(scrollFrameRef.current)
        }

        scrollFrameRef.current =
            requestAnimationFrame(() => {
                current?.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest'
                })
            })

    }, [
        currentWordStart,
        hindiActiveWordEnd,
        highlightEnabled,
        autoScrollEnabled,
        runningTest
    ])

    useEffect(() => {

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }

            if (scrollFrameRef.current) {
                cancelAnimationFrame(scrollFrameRef.current)
            }

            if (typingFrameRef.current) {
                cancelAnimationFrame(typingFrameRef.current)
            }

        }

    }, [])

    const startTimer = () => {

        if (started || ended) return

        setStarted(true)

        timerRef.current =
            setInterval(() => {
                setRemaining((current) => {

                    if (current <= 1) {
                        if (timerRef.current) {
                            clearInterval(timerRef.current)
                        }

                        finishTest(
                            typedRef.current,
                            0
                        )
                        return 0
                    }

                    return current - 1
                })
            }, 1000)
    }

    const loadTypingTests = async (
        level = activeLevel,
        page = 1,
        reset = true,
        nextLanguage = activeTypingLanguage
    ) => {
        if(nextLanguage === 'hindi'){
            return
        }
        if (typingTestsLoadingRef.current) {
            return
        }

        typingTestsLoadingRef.current =
            true

        const requestId =
            typingTestsRequestIdRef.current + 1

        typingTestsRequestIdRef.current =
            requestId

        setLoadingAvailableTests(true)

        try {
            const response =
                await fetch(
                    LOAD_TYPING_TESTS,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            level,
                            lan: nextLanguage === 'hindi' ? 'hn' : 'en',
                            page,
                            limit: 8
                        })
                    }
                )

            const data =
                await response.json()

            if (requestId !== typingTestsRequestIdRef.current) {
                return
            }

            if (!data?.success) {
                showPopupMessage(
                    data?.message ||
                    'Unable to load typing tests',
                    false
                )
                return
            }

            const tests =
                (data.tests || data.typingTests || data.data || [])
                    .filter((test: any) => {
                        const rawLanguage =
                            Array.isArray(test?.lan)
                                ? test.lan[0]
                                : test?.lan ||
                                test?.language

                        const normalizedLanguage =
                            String(rawLanguage || '').toLowerCase()

                        return [
                            'en',
                            'hn',
                            'english',
                            'hindi'
                        ].includes(normalizedLanguage)
                    })
                    .map(normalizeTypingTest)
                    .filter((test: TypingTestListItem) => test.testId)

            if (requestId !== typingTestsRequestIdRef.current) {
                return
            }

            setAvailableTests((current) =>
                reset
                    ? tests
                    : [
                        ...current,
                        ...tests
                    ]
            )

            setTypingTestsPage(page)
            setTypingTestsHasMore(
                Boolean(
                    data.pagination?.hasMore ??
                    data.hasMore ??
                    tests.length >= 8
                )
            )

            if (data.levelName || data.userLevel) {
                setActiveLevel(data.levelName || data.userLevel)
            }

            if (data.levelAccess) {
                const previousAccess =
                    previousLevelAccessRef.current

                levels.forEach((level) => {
                    if (
                        level !== 'Easy' &&
                        data.levelAccess[level] === true &&
                        previousAccess[level] === false
                    ) {
                        showPopupMessage(
                            `${level} level unlocked`,
                            true
                        )
                    }
                })

                previousLevelAccessRef.current =
                    data.levelAccess
                setLevelAccess(data.levelAccess)
            }

            if (data.levelProgress) {
                setLevelProgress(data.levelProgress)
            }

            if (reset && tests.length > 0) {
                const urlTestId =
                    new URLSearchParams(window.location.search)
                        .get('testId')

                const nextSelectedTest =
                    tests.find((test: TypingTestListItem) => test.testId === urlTestId) ||
                    tests[0]

                setSelectedTest((current) => {
                    if (current) return current

                    return nextSelectedTest
                })

                setTestId((current) => current || nextSelectedTest.testId)
                void loadHistory(
                    1,
                    true
                )
            }
        } catch {
            if (requestId !== typingTestsRequestIdRef.current) {
                return
            }

            showPopupMessage(
                'Typing test list backend not available',
                false
            )
        } finally {
            if (requestId === typingTestsRequestIdRef.current) {
                typingTestsLoadingRef.current =
                    false
                setLoadingAvailableTests(false)
            }
        }
    }

    const loadTypingTest = async (
        nextTestId = testId,
        mode: 'start' | 'resume' | 'solution' = 'start',
        historyId = '',
        selectedDuration = duration
    ) => {
        if (!nextTestId.trim()) {
            showPopupMessage(
                'Please select a typing test',
                false
            )
            return false
        }

        setLoadingTest(true)
        resumeExpiredRef.current = false

        try {
            const endpoint =
                mode === 'resume'
                    ? RESUME_TYPING_TEST
                    : mode === 'solution'
                        ? TYPING_SOLUTION
                        : START_TYPING_TEST

            const response =
                await fetch(
                    endpoint,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            testId: nextTestId,
                            historyId,
                            durationSec:
                                mode === 'start'
                                    ? selectedDuration * 60
                                    : undefined
                        })
                    }
                )

            const data =
                await response.json()

            if (!data?.success) {
                showPopupMessage(
                    data?.message ||
                    'Unable to load typing paragraph',
                    false
                )
                return false
            }

            const rawParagraph =
                data.test?.paragraph ||
                data.paragraph ||
                ''

            const loadedLanguage =
                normalizeTypingLanguage(
                    data.test?.language ||
                    data.language ||
                    language
                )

            const paragraph =
                loadedLanguage === 'hindi'
                    ? normalizeHindiText(rawParagraph)
                    : rawParagraph

            const savedTypedText =
                data.test?.typedText ||
                data.typedText ||
                data.result?.typedText ||
                ''

            if (!paragraph) {
                showPopupMessage(
                    'Typing paragraph not found for this test id',
                    false
                )
                return false
            }

            const loadedTest:
                TypingTestData = {
                    testId:
                        data.test?.testId ||
                        data.testId ||
                        nextTestId,
                    historyId:
                        data.test?.historyId ||
                        data.historyId ||
                        historyId,
                    attemptNo:
                        data.test?.attemptNo ||
                        data.attemptNo ||
                        1,
                    title:
                        data.test?.title ||
                        data.title ||
                        'Typing Test',
                    language:
                        loadedLanguage,
                    level:
                        data.test?.level ||
                        data.level ||
                        1,
                    levelName:
                        data.test?.levelName ||
                        data.levelName ||
                        getLevelName(data.test?.level || data.level || 1),
                    duration:
                        Math.max(
                            1,
                            Math.round(
                                (data.durationSec || selectedDuration * 60) / 60
                            )
                        ),
                    paragraph,
                    typedText:
                        loadedLanguage === 'hindi'
                            ? normalizeHindiText(savedTypedText)
                            : savedTypedText
                }

            setTestData(loadedTest)
            setTestId(loadedTest.testId)
            setSelectedTest((current) =>
                current?.testId === loadedTest.testId
                    ? current
                    : availableTests.find((test) => test.testId === loadedTest.testId) ||
                    current
            )
            setLanguage(loadedTest.language)
            resetTest(
                loadedTest.duration,
                mode === 'solution'
                    ? 'solution'
                    : 'test'
            )

            if (mode === 'resume') {
                const resumedText =
                    loadedTest.typedText || ''
                const remainingSec = Math.max(
                    0,
                    data.remainingSec ?? loadedTest.duration * 60
                )

                typedRef.current = resumedText
                setTyped(resumedText)
                setBackspaces(Math.max(0, data.backspaces || 0))
                setRemaining(remainingSec)
                resumeExpiredRef.current = remainingSec === 0

                requestAnimationFrame(() => {
                    if (typingRef.current) {
                        typingRef.current.value = resumedText
                    }
                })
            }

            if (mode === 'solution') {
                typedRef.current =
                    savedTypedText
                setTyped(savedTypedText)

                requestAnimationFrame(() => {
                    if (typingRef.current) {
                        typingRef.current.value =
                            savedTypedText
                    }
                })
            }

            if (data.result) {
                setResult(data.result)
                setResultMeta({
                    success: true,
                    resultId:
                        loadedTest.historyId,
                    level:
                        loadedTest.level,
                    levelName:
                        loadedTest.levelName
                })
            }

            return true
        } catch {
            showPopupMessage(
                'Typing test backend not available',
                false
            )
            return false
        } finally {
            setLoadingTest(false)
        }
    }

    const loadHistory = async (
        page = historyPage,
        reset = false,
        historyTestId = ''
    ) => {
        if(activeTypingLanguage === 'hindi') return
        if (loadingHistory) return

        setLoadingHistory(true)

        try {
            const response =
                await fetch(
                    TYPING_HISTORY,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            testId: historyTestId,
                            lan: activeTypingLanguage === 'hindi' ? 'hn' : 'en',
                            page,
                            limit: 8
                        })
                    }
                )

            const data =
                await response.json()

            if (!response.ok) {
                showPopupMessage(
                    data?.message ||
                    'Unable to load typing history',
                    false
                )
                return
            }

            if (!data?.success) {
                showPopupMessage(
                    data?.message ||
                    'Unable to load typing history',
                    false
                )
                return
            }

            const nextHistory =
                data.history ||
                data.results ||
                []

            setHistory((current) =>
                reset
                    ? nextHistory
                    : [
                        ...current,
                        ...nextHistory
                    ]
            )

            setHistoryPage(page)
            setHistoryHasMore(
                Boolean(
                    data.pagination?.hasMore ??
                    data.hasMore ??
                    nextHistory.length >= 8
                )
            )
        } catch {
            showPopupMessage(
                'Unable to load typing history',
                false
            )
        } finally {
            setLoadingHistory(false)
        }
    }

    const requestTypingFullscreen = async () => {

        if (document.fullscreenElement) {
            await document.exitFullscreen()
            return
        }

        try {
            await testShellRef.current?.requestFullscreen()
        } catch {
            setIsFullscreen(false)
        }
    }

    const goHome = () => {
        showRouteLoader()
        router.push('/')
    }

    const goLogin = async () => {
        showRouteLoader()

        await fetch(
            '/redirect',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: window.location.pathname
                })
            }
        )

        router.push('/login')
    }

    const focusTypingArea = (
        behavior: ScrollBehavior = 'smooth'
    ) => {
        const textarea =
            typingRef.current

        if (!textarea) {
            return
        }

        const scrollTarget =
            textarea.closest('[data-typing-entry="true"]') as HTMLElement | null

        const focus = () => {
            try {
                textarea.focus({
                    preventScroll: true
                })
            } catch {
                textarea.focus()
            }
        }

        scrollTarget?.scrollIntoView({
            behavior,
            block: 'center',
            inline: 'nearest'
        })

        if (textarea.disabled) {
            return
        }

        focus()

        window.setTimeout(
            focus,
            120
        )

        window.setTimeout(
            () => {
                scrollTarget?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            },
            180
        )
    }

    useEffect(() => {
        if (
            !pendingTypingFocusRef.current ||
            !testData?.paragraph ||
            loadingTest ||
            activeMode !== 'test'
        ) {
            return
        }

        pendingTypingFocusRef.current = false

        requestAnimationFrame(() => {
            focusTypingArea()
        })

        const retryTimer =
            window.setTimeout(
                () => {
                    focusTypingArea('auto')
                },
                350
            )

        return () => {
            window.clearTimeout(retryTimer)
        }
    }, [
        activeMode,
        loadingTest,
        testData?.paragraph
    ])

    const handleStartTest = async (
        test = selectedTest,
        mode: 'start' | 'resume' | 'solution' = 'start',
        historyId = ''
    ) => {
        const buttonKey =
            `${test?.testId || testId}:${mode}:${historyId}`

        if (!authenticated) {
            showPopupMessage(
                'Please sign in to start typing test',
                false
            )
            await goLogin()
            return
        }

        if (!test?.testId) {
            showPopupMessage(
                'Typing test is not loaded yet',
                false
            )
            return
        }

        setSelectedTest(test)
        setTestId(test.testId)
        setLoadingTestKey(buttonKey)
        if (mode === 'resume') {
            showTestActionLoader('Resuming Typing Test')
        }
        pendingTypingFocusRef.current =
            mode !== 'solution'

        if (mode !== 'solution') {
            focusTypingArea()
        }

        try {
            // Every start, retry, and resume must obtain a fresh backend session.
            // In particular, resume transitions its history from `resume` to
            // `running` and returns backend-authoritative time remaining.
            let loaded = false

            if (!loaded && !loadingTest) {
                loaded =
                    await loadTypingTest(
                        test.testId,
                        mode,
                        historyId,
                        duration
                    )
            }

            if (!loaded) {
                return
            }

            if (mode === 'solution') {
                return
            }

            if (mode === 'resume') {
                if (resumeExpiredRef.current) {
                    return
                }

                startTimer()
            }

            void loadHistory(1, true)

            requestAnimationFrame(() => {
                focusTypingArea()
            })

            await requestTypingFullscreen()

            requestAnimationFrame(() => {
                focusTypingArea('auto')
            })
        } finally {
            setLoadingTestKey('')
            if (mode === 'resume') {
                hideTestActionLoader()
            }
        }
    }

    const handleTypingClick = async () => {
        if (!testData?.paragraph) {
            showPopupMessage(
                'Click Start Test to load paragraph first',
                false
            )
            return
        }

        if (solutionMode) {
            return
        }

        focusTypingArea()
    }

    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (solutionMode) {
            event.preventDefault()
            return
        }

        if (event.key === 'Backspace') {
            if (!backspaceEnabled) {
                event.preventDefault()
                return
            }

            setBackspaces((current) => current + 1)
        }

        if (
            language === 'hindi' &&
            hindiInputMode === 'remington' &&
            event.key.length === 1
        ) {
            const mappedKey =
                krutiDevShortcutMap[event.key] ||
                remingtonKeyMap[event.key]

            if (mappedKey) {
                event.preventDefault()
                insertRemingtonText(
                    event.currentTarget,
                    mappedKey
                )
                return
            }
        }

        if (!started && event.key.length === 1) {
            startTimer()
        }
    }

    const insertRemingtonText = (
        element: HTMLTextAreaElement,
        text: string
    ) => {
        const selectionStart =
            element.selectionStart

        const selectionEnd =
            element.selectionEnd

        const nextValue =
            [
                element.value.slice(0, selectionStart),
                text,
                element.value.slice(selectionEnd)
            ].join('')

        element.value =
            nextValue

        const nextCursor =
            selectionStart + text.length

        element.setSelectionRange(
            nextCursor,
            nextCursor
        )

        commitTypedValue(
            element,
            nextValue
        )
    }

    const commitTypedValue = (
        element: HTMLTextAreaElement,
        rawValue: string
    ) => {
        if (!testData?.paragraph) {
            return
        }

        if (solutionMode) {
            return
        }

        const nextValue =
            language === 'hindi'
                ? normalizeHindiInputByMode(
                    rawValue,
                    hindiInputMode
                )
                : rawValue

        if (nextValue !== rawValue) {
            element.value =
                nextValue
            element.setSelectionRange(
                nextValue.length,
                nextValue.length
            )
        }

        if (!started && nextValue.length > 0) {
            startTimer()
        }

        typedRef.current =
            nextValue

        if (typingFrameRef.current) {
            cancelAnimationFrame(typingFrameRef.current)
        }

        typingFrameRef.current =
            requestAnimationFrame(() => {
                setTyped(typedRef.current)
            })

        if (splitGraphemes(nextValue).length >= expectedChars.length) {
            setTyped(nextValue)
            finishTest(nextValue)
        }
    }

    const handleInput = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        const nativeEvent =
            event.nativeEvent as InputEvent

        if (
            language === 'hindi' &&
            (
                composingHindiRef.current ||
                nativeEvent.isComposing
            )
        ) {
            return
        }

        commitTypedValue(
            event.currentTarget,
            event.currentTarget.value
        )
    }

    const handleCompositionStart = () => {
        if (language === 'hindi') {
            composingHindiRef.current =
                true
        }
    }

    const handleCompositionEnd = (
        event: CompositionEvent<HTMLTextAreaElement>
    ) => {
        if (language !== 'hindi') {
            return
        }

        const element =
            event.currentTarget

        composingHindiRef.current =
            false

        commitTypedValue(
            element,
            element.value
        )

        requestAnimationFrame(() => {
            commitTypedValue(
                element,
                element.value
            )
        })
    }

    const finishTest = (
        finalText = typedRef.current,
        finalRemaining = remaining
    ) => {

        if (ended || submittingResult) return

        if (!testData?.paragraph) {
            showPopupMessage(
                'Load typing test before submitting',
                false
            )
            return
        }

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        setEnded(true)
        setStarted(false)

        const computed =
            computeResult({
                expected: activeText,
                actual: finalText,
                durationSec: activeDuration * 60,
                remaining: finalRemaining,
                backspaces
            })

        void submitTypingResult(computed, finalText)
    }

    useEffect(() => {
        if (
            !runningTest ||
            remaining > 0 ||
            ended ||
            submittingResult ||
            zeroTimeSubmitRef.current
        ) {
            if (remaining > 0) {
                zeroTimeSubmitRef.current = false
            }
            return
        }

        // This catches both a timer reaching 0:00 and a resume response that
        // already has no time remaining.
        zeroTimeSubmitRef.current = true
        const frame = requestAnimationFrame(() => {
            finishTest(typedRef.current, 0)
        })

        return () => cancelAnimationFrame(frame)
    }, [
        ended,
        remaining,
        runningTest,
        submittingResult,
        testData?.historyId
    ])

    const submitTypingResult = async (
        computed: Result,
        finalText: string
    ) => {
        if (!testData) {
            showPopupMessage(
                'Typing test data missing',
                false
            )
            return
        }

        setSubmittingResult(true)
        showTestActionLoader('Submitting Typing Test')

        const payload =
            buildTypingResultPayload({
                test: testData,
                result: computed,
                typedText: finalText,
                duration: activeDuration,
                remaining,
                backspaces,
                startedAt: Date.now() - computed.elapsed * 1000,
                submittedAt: Date.now()
            })

        try {
            const response =
                await fetch(
                    TYPING_RESULT,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    }
                )

            const data: SubmitResponse =
                await response.json()

            setResultMeta(data)

            if (data?.success) {
                showTestActionLoader('Loading Result')
                if (document.fullscreenElement) {
                    await document.exitFullscreen()
                }

                setResult(
                    data.result ||
                    computed
                )

                showPopupMessage(
                    data.message ||
                    'Typing result saved',
                    true
                )

                const historyItem = data.historyItem || {
                    historyId: testData.historyId || '',
                    status: 'submitted' as const,
                    score: data.result?.net3 || computed.net3,
                    accuracy: data.result?.accuracy || computed.accuracy
                }

                if (data.levelProgress) {
                    setLevelProgress(data.levelProgress)
                }

                if (data.levelAccess) {
                    setLevelAccess(data.levelAccess)
                }

                setAvailableTests((current) =>
                    current.map((item) =>
                        item.testId === testData.testId
                            ? {
                                ...item,
                                history: [historyItem],
                                actions: {
                                    primary: 'test-again',
                                    resumeHistoryId: '',
                                    solutionHistoryId: historyItem.historyId
                                }
                            }
                            : item
                    )
                )
            } else {
                showPopupMessage(
                    data?.message ||
                    'Unable to save typing result',
                    false
                )
            }
        } catch {
            showPopupMessage(
                'Unable to save typing result',
                false
            )
        } finally {
            setSubmittingResult(false)
            hideTestActionLoader()
        }
    }

    const exitTypingTest = async () => {
        if (!testData?.historyId || !testData.testId || !runningTest) {
            return
        }

        setSubmittingResult(true)
        showTestActionLoader('Saving Typing Progress')

        try {
            const response = await fetch(EXIT_TYPING_TEST, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    historyId: testData.historyId,
                    testId: testData.testId,
                    typedText: typedRef.current,
                    backspaces
                })
            })
            const data = await response.json()

            if (!response.ok || !data?.success) {
                showPopupMessage(data?.message || 'Unable to save typing progress', false)
                return
            }

            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }

            if (document.fullscreenElement) {
                await document.exitFullscreen()
            }

            showPopupMessage('Progress saved. You can resume this test later.', true)
            const historyItem = data.historyItem || {
                historyId: testData.historyId,
                status: 'resume' as const
            }
            setAvailableTests((current) =>
                current.map((item) =>
                    item.testId === testData.testId
                        ? {
                            ...item,
                            history: [historyItem],
                            actions: {
                                primary: 'resume',
                                resumeHistoryId: historyItem.historyId,
                                solutionHistoryId: ''
                            }
                        }
                        : item
                )
            )
            resetTest()
            setTestData(null)
        } catch {
            showPopupMessage('Unable to save typing progress', false)
        } finally {
            setSubmittingResult(false)
            hideTestActionLoader()
        }
    }

    const resetTest = (
        nextDuration = duration,
        nextMode: 'idle' | 'test' | 'solution' = 'idle'
    ) => {

        zeroTimeSubmitRef.current = false
        resumeExpiredRef.current = false

        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }

        if (typingFrameRef.current) {
            cancelAnimationFrame(typingFrameRef.current)
            typingFrameRef.current = null
        }

        setRemaining(nextDuration * 60)
        setTyped('')
        typedRef.current = ''

        if (typingRef.current) {
            typingRef.current.value = ''
        }

        setStarted(false)
        setEnded(false)
        setBackspaces(0)
        setResult(null)
        setResultMeta(null)
        setActiveMode(nextMode)
    }

    return (
        <main className="typing-font min-h-screen bg-[#f7f8fc] text-[#080d31]">

            <TestActionLoader />

            <div className="w-full px-0 pt-0">
                <TestSectionHead
                    userName=""
                    rollingId=""
                    activePlan={authenticated ? 'Typing Pro' : 'Guest'}
                    badgeText="Typing Test Pro"
                    onHome={goHome}
                    onLogin={goLogin}
                    showSignIn={!authenticated}
                />
            </div>

            <div
                className={[
                    'grid gap-6 px-2 py-2 xl:px-2',
                    runningTest
                        ? ''
                        : 'xl:grid-cols-[300px_minmax(0,1fr)]'
                ].join(' ')}
            >

                <aside className={runningTest ? 'hidden' : 'space-y-4'}>

                    <section className="overflow-hidden rounded-[10px] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]">

                        <div className="flex items-center gap-4 bg-gradient-to-r from-[#642be4] to-[#3519bd] p-1 text-white">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white/15">
                                <Settings size={23} />
                            </div>

                            <div>
                                <h2 className="text-lg font-black">Typing Tests</h2>
                                <p className="text-xs text-white/85">Select a test</p>
                            </div>
                        </div>

                        <div className="space-y-4 p-2">

                            <div>
                                <div className="mb-3 grid grid-cols-2 gap-2 rounded-[10px] bg-slate-100 p-1">
                                    {([
                                        ['english', 'English'],
                                        ['hindi', 'Hindi']
                                    ] as Array<[Language, string]>).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    listControlsLocked ||
                                                    activeTypingLanguage === value
                                                ) {
                                                    return
                                                }

                                                setActiveTypingLanguage(value)
                                            }}
                                            disabled={value === 'hindi' || listControlsLocked}
                                            className={[
                                                'rounded-[8px] px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60',
                                                activeTypingLanguage === value
                                                    ? 'bg-white text-indigo-700 shadow-sm'
                                                    : 'text-slate-600'
                                            ].join(' ')}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-xs font-black">{activeLevel} Typing Tests</h3>
                                    <button
                                        type="button"
                                        onClick={() => loadTypingTests(
                                            activeLevel,
                                            1,
                                            true,
                                            activeTypingLanguage
                                        )}
                                        disabled={listControlsLocked}
                                        className="text-[11px] font-black text-indigo-700 disabled:opacity-60"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                <div className="mt-2 min-h-[330px] max-h-[370px] space-y-2 overflow-y-auto pr-1">
                                    {loadingAvailableTests && availableTests.length === 0 && (
                                        <div className="space-y-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div
                                                    key={`typing-test-card-skeleton-${index}`}
                                                    className="h-[94px] animate-pulse rounded-[14px] bg-slate-100"
                                                ></div>
                                            ))}
                                        </div>
                                    )}

                                    {!loadingAvailableTests && availableTests.length === 0 && (
                                        <div className="rounded-[12px] border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">
                                            No typing tests found
                                        </div>
                                    )}

                                    {availableTests.map((test) => {
                                        const active =
                                            selectedTest?.testId === test.testId ||
                                            testData?.testId === test.testId

                                        const resumeHistory =
                                            test.history?.find((item) =>
                                                item.historyId === test.actions?.resumeHistoryId
                                            ) || test.history?.find((item) =>
                                                item.status === 'resume' ||
                                                item.status === 'running'
                                            )

                                        const submittedHistory =
                                            test.history?.find((item) =>
                                                item.historyId === test.actions?.solutionHistoryId
                                            ) || test.history?.find((item) => item.status === 'submitted')

                                        const hasSubmitted =
                                            Boolean(submittedHistory)

                                        const primaryAction =
                                            test.actions?.primary ||
                                            (resumeHistory
                                                ? 'resume'
                                                : hasSubmitted
                                                    ? 'test-again'
                                                    : 'start')

                                        const unavailable =
                                            test.available === false ||
                                            test.levelUnlocked === false ||
                                            test.access === false

                                        const minimumSpeed =
                                            levelProgress[test.levelName]?.minimumSpeed || 0
                                        const minimumAccuracy =
                                            levelProgress[test.levelName]?.minimumAccuracy || 0

                                        const submittedScore =
                                            submittedHistory?.score || 0
                                        const submittedAccuracy =
                                            submittedHistory?.accuracy || 0

                                        const testPassed =
                                            submittedScore >= minimumSpeed &&
                                            submittedAccuracy >= minimumAccuracy

                                        const testProgressColor =
                                            !submittedHistory
                                                ? 'bg-red-500'
                                                : testPassed
                                                ? 'bg-emerald-500'
                                                : 'bg-amber-400'

                                        const testProgressText =
                                            !submittedHistory
                                                ? `Not attempted • need ${minimumSpeed} WPM / ${minimumAccuracy}%`
                                                : testPassed
                                                ? `Passed • ${submittedScore} WPM / ${submittedAccuracy.toFixed(1)}%`
                                                : `${submittedScore} WPM / ${submittedAccuracy.toFixed(1)}% • need ${minimumSpeed} WPM / ${minimumAccuracy}%`

                                        return (
                                            <div
                                                key={test.testId}
                                                onClick={() => {
                                                    if (listControlsLocked) return

                                                    setSelectedTest(test)
                                                    setTestId(test.testId)
                                                    void loadHistory(
                                                        1,
                                                        true
                                                    )
                                                }}
                                                className={[
                                                    'cursor-pointer rounded-[14px] border bg-white p-3 shadow-[0_8px_20px_rgba(74,63,119,0.08)]',
                                                    active
                                                        ? 'border-[#4A3F77] ring-2 ring-[#4A3F77]/10'
                                                        : 'border-[#E5DFF4]'
                                                ].join(' ')}
                                            >
                                                <div className="grid gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <h4
                                                                title={test.title}
                                                                className="min-w-0 flex-1 truncate text-sm font-black text-slate-900"
                                                            >
                                                                {test.title}
                                                            </h4>
                                                        </div>

                                                        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-500">
                                                            <span className="min-w-0 truncate">🌐 {test.language}</span>
                                                            <span className="min-w-0 truncate">Level {test.level}: {test.levelName}</span>
                                                            <span className="min-w-0 truncate">{test.words || 0} words</span>
                                                        </div>

                                                        <div className="mt-3">
                                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                                <div
                                                                    className={`h-full rounded-full ${testProgressColor}`}
                                                                    style={{
                                                                        width: submittedHistory ? '100%' : '12%'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <p className="mt-1 text-[10px] font-black text-slate-500">
                                                                {testProgressText}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        {unavailable ? (
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="col-span-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-[11px] font-black text-slate-500 disabled:cursor-not-allowed"
                                                            >
                                                                {test.buttonName || 'Available Soon'}
                                                            </button>
                                                        ) : primaryAction === 'resume' && resumeHistory ? (
                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation()
                                                                    void handleStartTest(
                                                                        test,
                                                                        'resume',
                                                                        resumeHistory.historyId || ''
                                                                    )
                                                                }}
                                                                disabled={loadingTest || settingsLocked}
                                                                className="rounded-xl bg-[linear-gradient(135deg,#4A3F77_0%,#362D5F_100%)] px-4 py-2.5 text-[11px] font-black text-white shadow-[0_10px_24px_rgba(74,63,119,0.26)] disabled:cursor-wait disabled:opacity-70"
                                                            >
                                                                {loadingTestKey === `${test.testId}:resume:${resumeHistory.historyId || ''}`
                                                                    ? <Spinner size={16} />
                                                                    : 'Resume'}
                                                            </button>
                                                        ) : (
                                                        <button
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                void handleStartTest(test)
                                                            }}
                                                            disabled={loadingTest || settingsLocked}
                                                            className="rounded-xl bg-[linear-gradient(135deg,#4A3F77_0%,#362D5F_100%)] px-4 py-2.5 text-[11px] font-black text-white shadow-[0_10px_24px_rgba(74,63,119,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
                                                        >
                                                            {loadingTestKey === `${test.testId}:start:`
                                                                ? <Spinner size={16} />
                                                                : hasSubmitted
                                                                    ? 'Test Again'
                                                                    : test.buttonName || 'Start Test'}
                                                        </button>
                                                        )}

                                                        {!unavailable && submittedHistory && (
                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation()
                                                                    void handleStartTest(
                                                                        test,
                                                                        'solution',
                                                                        submittedHistory.historyId || ''
                                                                    )
                                                                }}
                                                                disabled={loadingTest || settingsLocked}
                                                                className="rounded-xl border border-[#D7D2E8] bg-[#F3F1FA] px-4 py-2.5 text-[11px] font-black text-[#4A3F77] disabled:cursor-wait disabled:opacity-70"
                                                            >
                                                                {loadingTestKey === `${test.testId}:solution:${submittedHistory.historyId || ''}`
                                                                    ? <Spinner size={16} />
                                                                    : 'Solution'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => loadTypingTests(
                                        activeLevel,
                                        typingTestsPage + 1,
                                        false,
                                        activeTypingLanguage
                                    )}
                                    disabled={!typingTestsHasMore || listControlsLocked}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[9px] bg-indigo-50 px-4 py-2.5 text-xs font-black text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loadingAvailableTests && availableTests.length > 0
                                        ? <Spinner size={16} />
                                        : typingTestsHasMore
                                            ? 'Load More Tests'
                                            : 'All Tests Loaded'}
                                </button>
                            </div>
                            <div>
                                <span className="text-xs font-black">Select Test Time</span>
                                <div className="mt-2 grid grid-cols-5 gap-2">
                                    {Array.from({ length: 10 }, (_, index) => index + 1).map((minute) => (
                                        <button
                                            key={minute}
                                            type="button"
                                            onClick={() => setDuration(minute)}
                                            disabled={settingsLocked}
                                            className={[
                                                'flex items-center justify-center gap-1 rounded-[9px] border px-2 py-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-50',
                                                duration === minute
                                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                                    : 'border-slate-200 bg-white text-slate-700'
                                            ].join(' ')}
                                        >
                                            <Clock3 size={13} />
                                            {minute}m
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {displayLanguage === 'hindi' && (
                                <div>
                                    <span className="text-xs font-black">Hindi Input Method</span>
                                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                        {hindiInputModes.map((mode) => (
                                            <button
                                                key={mode.value}
                                                type="button"
                                                onClick={() => setHindiInputMode(mode.value)}
                                                disabled={settingsLocked}
                                                className={[
                                                    'rounded-[9px] border px-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-50',
                                                    hindiInputMode === mode.value
                                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                                        : 'border-slate-200 bg-white text-slate-700'
                                                ].join(' ')}
                                            >
                                                <span className="block text-xs font-black">
                                                    {mode.label}
                                                </span>
                                                <span
                                                    className={[
                                                        'mt-1 block text-[10px] font-bold',
                                                        hindiInputMode === mode.value
                                                            ? 'text-white/80'
                                                            : 'text-slate-500'
                                                    ].join(' ')}
                                                >
                                                    {mode.detail}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 border-t border-slate-100 pt-3">

                                <ChoiceRow
                                    icon={<Keyboard size={16} />}
                                    title="Backspace"
                                    enabled={backspaceEnabled}
                                    disabled={settingsLocked}
                                    onChange={setBackspaceEnabled}
                                />

                                <ChoiceRow
                                    icon={<Sparkles size={16} />}
                                    title="Highlight & Auto Scroll"
                                    enabled={highlightEnabled && autoScrollEnabled}
                                    disabled={settingsLocked}
                                    onChange={(enabled) => {
                                        setHighlightEnabled(enabled)
                                        setAutoScrollEnabled(enabled)
                                    }}
                                />

                                <ChoiceRow
                                    icon={<Check size={16} />}
                                    title="Live Spelling Check"
                                    enabled={liveSpellingEnabled}
                                    disabled={settingsLocked}
                                    onChange={setLiveSpellingEnabled}
                                />
                            </div>

                        </div>

                    </section>

                    <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
                        <h2 className="flex items-center gap-2 text-sm font-black">
                            <BarChart3 size={18} className="text-indigo-700" />
                            Your Progress & Levels
                        </h2>

                        <div className="relative mt-4 px-1 pt-1">
                            <div className="absolute left-[9%] right-[9%] top-[23px] h-2 rounded-full bg-slate-200"></div>

                            <div className="relative grid grid-cols-5 gap-1">
                                {levels.map((level, index) => {

                                    const levelStyles = [
                                        'border-[#4421d3] bg-gradient-to-br from-[#702ee8] to-[#3518c4] text-white shadow-violet-200',
                                        'border-[#1392f4] bg-gradient-to-br from-[#45c3ff] to-[#0779e8] text-white shadow-sky-200',
                                        'border-[#f5b73a] bg-gradient-to-br from-[#ffc94b] to-[#f59d1e] text-white shadow-amber-200',
                                        'border-slate-300 bg-slate-100 text-slate-700 shadow-slate-200',
                                        'border-slate-300 bg-slate-100 text-slate-700 shadow-slate-200'
                                    ]

                                    const isActiveLevel =
                                        activeLevel === level

                                    const unlocked =
                                        levelAccess[level] === true

                                    const progress =
                                        levelProgress[level] || {
                                            total: 0,
                                            passed: 0,
                                            percent: unlocked ? 100 : 0,
                                            minimumSpeed: 0,
                                            minimumAccuracy: 0,
                                            complete: unlocked
                                        }

                                    return (
                                        <div key={level} className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        listControlsLocked ||
                                                        activeLevel === level
                                                    ) {
                                                        return
                                                    }

                                                    setActiveLevel(level)
                                                }}
                                                disabled={listControlsLocked}
                                                className="relative mx-auto block h-12 w-12 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <div
                                                    className={[
                                                        'flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-black shadow-lg',
                                                        isActiveLevel
                                                            ? 'border-[#22135f] bg-[#22135f] text-white shadow-violet-200'
                                                            : !unlocked
                                                            ? 'border-slate-300 bg-slate-100 text-slate-500 shadow-slate-200'
                                                            : levelStyles[index]
                                                    ].join(' ')}
                                                >
                                                    {index + 1}
                                                </div>

                                                {unlocked && index > 0 && (
                                                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </span>
                                                )}

                                                {!unlocked && (
                                                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm">
                                                        <Lock size={9} strokeWidth={3} />
                                                    </span>
                                                )}
                                            </button>

                                            <p className="mt-2 text-[11px] font-medium text-slate-600">{level}</p>
                                            <div className="mx-auto mt-1 h-1.5 w-12 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className={[
                                                        'h-full rounded-full',
                                                        progress.complete
                                                            ? 'bg-emerald-500'
                                                            : progress.percent > 0
                                                            ? 'bg-amber-400'
                                                            : 'bg-red-400'
                                                    ].join(' ')}
                                                    style={{
                                                        width: `${Math.max(0, Math.min(100, progress.percent))}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="mt-1 text-[10px] font-bold text-slate-500">
                                                {progress.passed}/{progress.total}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                        <div className="mt-3 rounded-[9px] bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700 shadow-inner shadow-slate-100">
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2">
                                    <Lock size={15} className="text-amber-500" />
                                    {activeLevel} progress
                                </span>
                                <span>
                                    {levelProgress[activeLevel]?.passed || 0}/{levelProgress[activeLevel]?.total || 0}
                                </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-500"
                                    style={{
                                        width: `${Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                levelProgress[activeLevel]?.percent || 0
                                            )
                                        )}%`
                                    }}
                                ></div>
                            </div>

                            <p className="mt-2 text-[11px] text-slate-500">
                                Next level unlocks after passing all tests in previous level
                            </p>
                        </div>

                    </section>

                </aside>

                <section
                    ref={testShellRef}
                    className="min-w-0 space-y-4 bg-[#f7f8fc] fullscreen:overflow-auto fullscreen:p-5"
                >

                    {isFullscreen && (
                        <div className="sticky top-3 z-30 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowLivePanel((current) => !current)}
                                className="flex h-10 items-center gap-2 rounded-[10px] bg-white px-3 text-xs font-black text-indigo-700 shadow-lg shadow-slate-300/60"
                            >
                                {showLivePanel ? <EyeOff size={16} /> : <Eye size={16} />}
                                {showLivePanel ? 'Hide Live' : 'Show Live'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (runningTest) {
                                        void exitTypingTest()
                                        return
                                    }

                                    void document.exitFullscreen()
                                }}
                                className="flex h-10 items-center gap-2 rounded-[10px] bg-[#22135f] px-3 text-xs font-black text-white shadow-lg shadow-violet-300/60"
                            >
                                {runningTest ? <X size={16} /> : <Minimize size={16} />}
                                {runningTest ? 'Exit & Save' : 'Exit'}
                            </button>
                        </div>
                    )}
{runningTest || hasLoadedParagraph &&
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-slate-200 bg-white p-2 shadow-[0_10px_28px_rgba(15,23,42,0.07)]">
                        <div className="mt-0 rounded-[9px] bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-inner shadow-slate-100">
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2">
                                    <Lock size={15} className="text-amber-500" />
                                    {activeLevel} progress
                                </span>
                                <span>
                                    {levelProgress[activeLevel]?.passed || 0}/{levelProgress[activeLevel]?.total || 0}
                                </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-500"
                                    style={{
                                        width: `${Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                levelProgress[activeLevel]?.percent || 0
                                            )
                                        )}%`
                                    }}
                                ></div>
                            </div>

                            <p className="mt-2 text-[11px] text-slate-500">
                                Next level unlocks after passing all tests in previous level
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowLivePanel((current) => !current)}
                            className={[
                                'items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-indigo-700 shadow-sm',
                                hasLoadedParagraph
                                    ? 'flex'
                                    : 'hidden'
                            ].join(' ')}
                        >
                            {showLivePanel ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showLivePanel ? 'Hide Live Result' : 'Show Live Result'}
                        </button>
                    </div>
}
                    {showLivePanel && (
                        <div
                            className={[
                                'grid gap-4 md:grid-cols-2 xl:grid-cols-5',
                                hasLoadedParagraph
                                    ? ''
                                    : 'hidden'
                            ].join(' ')}
                        >
                            <StatCard
                                icon={<User size={26} />}
                                label="USER NAME"
                                value={displayName}
                                detail={user?.id ? `ID: ${user.id}` : 'Sign in required'}
                                iconClass="bg-violet-100 text-violet-700"
                            />

                            <StatCard
                                icon={<Clock3 size={26} />}
                                label="TIME LEFT"
                                value={formatTime(remaining)}
                                detail={started ? 'Running' : ended ? 'Finished' : 'Ready'}
                                iconClass="bg-blue-50 text-blue-600"
                                meter={remaining / (activeDuration * 60)}
                            />

                            <StatCard
                                icon={<Gauge size={26} />}
                                label="LIVE SPEED"
                                value={`${liveResult.net1.toFixed(2)} WPM`}
                                detail={`${liveResult.grossWpm.toFixed(2)} gross`}
                                iconClass="bg-emerald-50 text-emerald-600"
                                accent="border-b-2 border-emerald-400"
                            />

                            <StatCard
                                icon={<Target size={26} />}
                                label="ACCURACY"
                                value={`${liveResult.accuracy.toFixed(2)}%`}
                                detail={`${liveResult.totalErrors} errors`}
                                iconClass="bg-red-50 text-red-600"
                                valueClass="text-red-600"
                                accent="border-b-2 border-amber-300"
                            />

                            <StatCard
                                icon={<Trophy size={26} />}
                                label="RANK"
                                value={resultMeta?.rank ? `#${resultMeta.rank}` : '--'}
                                detail={resultMeta?.totalUsers ? `${resultMeta.totalUsers} users` : 'After submit'}
                                iconClass="bg-amber-50 text-amber-600"
                            />
                        </div>
                    )}

                    <div
                        className={[
                            'grid gap-5',
                            isFullscreen || runningTest
                                ? ''
                                : 'lg:grid-cols-[minmax(0,1fr)_280px]'
                        ].join(' ')}
                    >

                        <section
                            className={[
                                'rounded-[10px] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]',
                                !loadingTest && !hasLoadedParagraph
                                    ? 'hidden md:block'
                                    : ''
                            ].join(' ')}
                        >

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-lg font-black">
                                    {displayLanguage === 'hindi'
                                        ? `Hindi Typing Test (${getHindiInputModeTitle(hindiInputMode)})`
                                        : 'English Typing Test'}
                                </h2>

                                <div className="flex items-center gap-2">
                                    {runningTest && (
                                        <div className="flex items-center gap-2 rounded-[9px] bg-indigo-700 px-3 py-2 text-xs font-black text-white">
                                            <Clock3 size={16} />
                                            Time Left: {formatTime(remaining)}
                                        </div>
                                    )}
                                    <p className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                                        <Keyboard size={17} />
                                        Exam-like result layout
                                    </p>
                                </div>
                            </div>

                            <div
                                ref={paragraphRef}
                                lang={displayLanguage === 'hindi' ? 'hi' : 'en'}
                                className={[
                                    'mt-5 h-[265px] overflow-y-auto rounded-[10px] border border-slate-200 bg-[#fbfbff] p-5 text-[20px] leading-[2] text-slate-900',
                                    displayLanguage === 'hindi'
                                        ? 'devanagari-text'
                                        : ''
                                ].join(' ')}
                            >
                                {loadingTest && (
                                    <div className="space-y-4">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div
                                                key={`typing-paragraph-skeleton-${index}`}
                                                className="h-5 animate-pulse rounded-full bg-slate-200"
                                                style={{
                                                    width: `${92 - index * 9}%`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                {!loadingTest && expectedChars.length === 0 && (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-indigo-50 text-indigo-700">
                                            <Keyboard size={26} />
                                        </div>
                                        <p className="mt-4 text-base font-black text-slate-800">
                                            Select a typing test and click Start Test
                                        </p>
                                        <p className="mt-1 max-w-md text-sm font-medium leading-6 text-slate-500">
                                            Paragraph will load from backend only after start.
                                        </p>
                                    </div>
                                )}

                                {!loadingTest && (ended || solutionMode) && expectedChars.map((char, index) => {
                                    const typedChar = typedChars[index]
                                    const wasTyped = index < typedChars.length
                                    const statusClass = wasTyped
                                        ? typedChar === char
                                            ? 'text-emerald-700'
                                            : 'rounded bg-red-100 text-red-700'
                                        : ''

                                    return (
                                        <span
                                            key={`${char}-${index}`}
                                            className={`whitespace-pre-wrap ${statusClass}`}
                                        >
                                            {char}
                                        </span>
                                    )
                                })}

                                {!loadingTest && !ended && !solutionMode && liveSpellingEnabled && expectedChars.length > 0 && (
                                    <>
                                        {liveSpellingSegments.map((segment, index) => (
                                            <span
                                                key={`${segment.text}-${index}`}
                                                data-current={segment.current || undefined}
                                                className={`whitespace-pre-wrap transition ${segment.className}`}
                                            >
                                                {segment.text}
                                            </span>
                                        ))}
                                    </>
                                )}

                                {!loadingTest && !ended && !solutionMode && !liveSpellingEnabled && expectedChars.length > 0 && (
                                    <>
                                        <span className="whitespace-pre-wrap text-slate-900">
                                            {paragraphDisplay.completed}
                                        </span>
                                        <span
                                            data-current="true"
                                            className={[
                                                'whitespace-pre-wrap transition',
                                                highlightEnabled
                                                    ? 'rounded bg-yellow-100 border-b-2 border-yellow-500'
                                                    : ''
                                            ].join(' ')}
                                        >
                                            {paragraphDisplay.current}
                                        </span>
                                        <span className="whitespace-pre-wrap text-slate-900">
                                            {paragraphDisplay.upcoming}
                                        </span>
                                    </>
                                )}

                            </div>

                            <div
                                data-typing-entry="true"
                                onClick={handleTypingClick}
                                className="mt-5 scroll-mt-24 rounded-[10px] border-2 border-sky-500 bg-white p-5 shadow-inner"
                            >
                                <textarea
                                    ref={typingRef}
                                    lang={displayLanguage === 'hindi' ? 'hi' : 'en'}
                                    onChange={handleInput}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={handleCompositionEnd}
                                    onKeyDown={handleKeyDown}
                                    disabled={ended || !hasLoadedParagraph}
                                    readOnly={solutionMode}
                                    spellCheck={false}
                                    className={[
                                        'h-48 w-full resize-none text-[16px] font-medium outline-none placeholder:text-slate-400 disabled:bg-white disabled:text-slate-500',
                                        displayLanguage === 'hindi'
                                            ? 'devanagari-text'
                                            : ''
                                    ].join(' ')}
                                    placeholder={
                                        !hasLoadedParagraph
                                            ? 'Click Start Test to load paragraph from backend...'
                                            : solutionMode
                                            ? 'Saved typed answer'
                                            : displayLanguage === 'hindi'
                                            ? getHindiInputPlaceholder(hindiInputMode)
                                            : 'Start typing here...'
                                    }
                                />

                                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                                    <span>{wordCount(typed)} Words • {typedChars.length} Characters</span>
                                    <span className="flex items-center gap-2">
                                        {isFullscreen ? 'Fullscreen active' : ''}
                                        <button
                                            type="button"
                                            onClick={handleTypingClick}
                                            className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 text-slate-600"
                                        >
                                            <Keyboard size={17} />
                                        </button>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_150px]">
                                <div className="flex items-center gap-3 rounded-[9px] bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-800">
                                    <Lightbulb size={18} />
                                    {displayLanguage === 'hindi'
                                        ? getHindiInputTip(hindiInputMode)
                                        : 'English mode active. Normal English typing chalegi.'}
                                </div>

                                <button
                                    onClick={requestTypingFullscreen}
                                    className="flex items-center justify-center gap-2 rounded-[9px] border border-slate-200 bg-white px-4 py-3 text-xs font-black shadow-sm"
                                >
                                    {isFullscreen
                                        ? <Minimize size={17} className="text-indigo-700" />
                                        : <Expand size={17} className="text-indigo-700" />}
                                    {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                                </button>
                            </div>

                            {testData?.paragraph && !ended && !solutionMode && (
                            <div className="mt-4 flex flex-wrap justify-end gap-3">
                                {runningTest && (
                                    <button
                                        type="button"
                                        onClick={exitTypingTest}
                                        disabled={submittingResult}
                                        className="flex items-center gap-2 rounded-[10px] border border-amber-300 bg-amber-50 px-7 py-3 text-sm font-black text-amber-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        <X size={18} />
                                        {submittingResult ? 'Saving...' : 'Exit & Resume Later'}
                                    </button>
                                )}
                                <button
                                    onClick={() => finishTest()}
                                    disabled={submittingResult || ended || solutionMode || !testData?.paragraph}
                                    className="flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <Send size={18} />
                                    {submittingResult ? 'Saving...' : 'Submit Test'}
                                </button>

                            </div>
                            )}

                        </section>

                        {!isFullscreen && !runningTest && (
                        <aside className="space-y-4">

                            <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-sm font-black">
                                        <Clock3 size={17} className="text-slate-600" />
                                        Your Test History
                                    </h2>
                                </div>

                                <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-1">
                                    {history.length === 0 && !loadingHistory && (
                                        <div className="rounded-[9px] border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">
                                            No typing history yet
                                        </div>
                                    )}

                                    {history.map((item, index) => (
                                        <div
                                            key={item.resultId || `${item.testId}-${item.attemptedAt}-${index}`}
                                            className={[
                                                'rounded-[9px] border p-3',
                                                index === 0
                                                    ? 'border-emerald-100 bg-emerald-50'
                                                    : 'border-slate-100 bg-white'
                                            ].join(' ')}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p
                                                        title={item.title || 'Typing Test'}
                                                        className="truncate text-xs font-black"
                                                    >
                                                        {item.title || 'Typing Test'}
                                                    </p>
                                                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                                        <CalendarDays size={12} />
                                                        {formatHistoryDate(item.attemptedAt)}
                                                    </p>
                                                    <p className="mt-1 text-[10px] font-black text-indigo-700">
                                                        Level {item.level}: {item.levelName || getLevelName(item.level)}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-xs font-black text-emerald-600">
                                                        {item.netWpm.toFixed(2)} WPM
                                                    </p>
                                                    <p
                                                        className={[
                                                            'mt-1 text-[11px] font-black',
                                                            index === 0
                                                                ? 'rounded bg-emerald-600 px-2 py-1 text-white'
                                                                : 'text-slate-800'
                                                        ].join(' ')}
                                                    >
                                                        {item.accuracy.toFixed(2)}%
                                                    </p>
                                                    {item.rank && (
                                                        <p className="mt-1 text-[10px] font-black text-slate-500">
                                                            Rank #{item.rank}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {loadingHistory && (
                                        <div className="space-y-2">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div
                                                    key={`history-skeleton-${index}`}
                                                    className="h-[74px] animate-pulse rounded-[9px] bg-slate-100"
                                                ></div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => loadHistory(historyPage + 1)}
                                    disabled={!historyHasMore || loadingHistory}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[9px] bg-indigo-50 px-4 py-3 text-xs font-black text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <BadgeCheck size={17} />
                                    {historyHasMore ? 'Load More History' : 'All History Loaded'}
                                </button>
                            </section>

                        </aside>
                        )}

                    </div>

                </section>

            </div>

            {result && (
                <ResultModal
                    result={result}
                    meta={resultMeta}
                    submitting={submittingResult}
                    onClose={() => setResult(null)}
                />
            )}

        </main>
    )
}

function ChoiceRow({
    icon,
    title,
    enabled,
    disabled = false,
    onChange
}: {
    icon: ReactNode
    title: string
    enabled: boolean
    disabled?: boolean
    onChange: (enabled: boolean) => void
}) {

    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="flex items-center gap-3 text-sm font-black">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    {icon}
                </span>
                {title}
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${title} ${enabled ? 'enabled' : 'disabled'}`}
                onClick={() => onChange(!enabled)}
                disabled={disabled}
                className={[
                    'relative flex h-8 w-16 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    enabled
                        ? 'bg-indigo-600'
                        : 'bg-slate-300'
                ].join(' ')}
            >
                <span
                    className={[
                        'flex h-6 w-6 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm transition-transform duration-200',
                        enabled
                            ? 'translate-x-8'
                            : 'translate-x-0'
                    ].join(' ')}
                >
                    {enabled && <Check size={14} strokeWidth={3} />}
                </span>
                <span
                    className="sr-only"
                >{enabled ? 'Enabled' : 'Disabled'}</span>
            </button>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
    detail,
    iconClass,
    valueClass = '',
    accent = '',
    meter
}: {
    icon: ReactNode
    label: string
    value: string
    detail: string
    iconClass: string
    valueClass?: string
    accent?: string
    meter?: number
}) {

    return (
        <div className={`rounded-2xl bg-white p-3 shadow-lg shadow-slate-200/70 ${accent}`}>
            <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 min-w-12 items-center justify-center rounded-full p-3 ${iconClass}`}>
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-500">{label}</p>
                    <p className={`mt-1 truncate text-lg font-black ${valueClass}`}>
                        {value}
                    </p>
                    <p className="mt-1 text-[11px] font-black text-slate-500">{detail}</p>
                </div>
            </div>

            {typeof meter === 'number' && (
                <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                    <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-[#6b2fe6] to-[#3921c8]"
                        style={{
                            width: `${Math.max(0, Math.min(100, meter * 100))}%`
                        }}
                    ></div>
                </div>
            )}
        </div>
    )
}

function ResultModal({
    result,
    meta,
    submitting,
    onClose
}: {
    result: Result
    meta: SubmitResponse | null
    submitting: boolean
    onClose: () => void
}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between bg-[#4E3C7D] px-5 py-4 text-white">
                    <div>
                        <h3 className="text-lg font-black">Your Detailed Typing Test Result</h3>
                        <p className="text-xs text-white/70">
                            {submitting
                                ? 'Saving result...'
                                : meta?.success
                                    ? `${meta.levelName || getLevelName(meta.level || 1)} • Rank #${meta.rank || '--'}`
                                    : 'Method 1 • Method 2 • 5% Mistakes Ignorable'}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    {meta?.success && (
                        <div className="grid gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm md:grid-cols-4">
                            <div>
                                <p className="text-xs font-black text-indigo-700">Result ID</p>
                                <p className="mt-1 truncate font-black">{meta.resultId || '--'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-indigo-700">Level</p>
                                <p className="mt-1 font-black">
                                    {meta.level || 1} {meta.levelName || getLevelName(meta.level || 1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-indigo-700">Rank</p>
                                <p className="mt-1 font-black">
                                    {meta.rank ? `#${meta.rank}` : '--'}
                                    {meta.totalUsers ? ` / ${meta.totalUsers}` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-indigo-700">Best</p>
                                <p className="mt-1 font-black">{meta.best ? 'New Best' : 'Saved'}</p>
                            </div>
                        </div>
                    )}

                    <ReportBlock
                        title="Method 1"
                        subtitle="Net Speed = Gross Speed - Error Rate"
                        color="red"
                        rows={[
                            ['Gross Speed', `${result.grossWpm.toFixed(2)} WPM`],
                            ['Accuracy', `${result.accuracy.toFixed(2)}%`],
                            ['Entries', `${result.wordEntries} Words`],
                            ['Total Errors', `${result.totalErrors}`],
                            ['Error Rate', `${result.errorRate.toFixed(2)} WPM`],
                            ['Backspace', `${result.backspaces}`],
                            ['Duration', `${result.elapsed} sec`],
                            ['KDPH', `${Math.round(result.net1 * 300)}`]
                        ]}
                        net={result.net1}
                    />

                    <ReportBlock
                        title="Method 2"
                        subtitle="(Words - Mistakes) / Time"
                        color="blue"
                        rows={[
                            ['Gross Speed', `${result.grossWpm.toFixed(2)} WPM`],
                            ['Accuracy', `${result.accuracy.toFixed(2)}%`],
                            ['Entries', `${result.wordEntries} Words`],
                            ['Full Mistakes', `${result.analysis.fullMistakes}`],
                            ['Half Mistakes', `${result.analysis.halfMistakes}`],
                            ['Total Mistakes', `${result.analysis.totalMistakes.toFixed(2)}`],
                            ['Penalty', `${result.analysis.totalMistakes.toFixed(2)}`],
                            ['Error %', `${result.errPct.toFixed(2)}%`]
                        ]}
                        net={result.net2}
                    />

                    <ReportBlock
                        title="5% Mistakes Ignorable"
                        subtitle="Net Mistakes = Total Mistakes - 5% of Typed Words"
                        color="emerald"
                        rows={[
                            ['Gross Speed', `${result.grossWpm.toFixed(2)} WPM`],
                            ['Accuracy', `${result.accuracy.toFixed(2)}%`],
                            ['Ignorable', `${result.ignorable.toFixed(2)}`],
                            ['Net Mistakes', `${result.netMistakes.toFixed(2)}`],
                            ['Penalty After', `${result.netMistakes.toFixed(2)}`],
                            ['Error %', `${result.errPct3.toFixed(2)}%`],
                            ['KDPH', `${Math.round(result.net3 * 300)}`]
                        ]}
                        net={result.net3}
                    />

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-700">
                            Typed Paragraph Preview
                        </p>

                        <div className="mt-3 max-h-32 overflow-y-auto text-sm leading-relaxed">
                            {result.preview.length > 0
                                ? result.preview.map((item, index) => (
                                    <span
                                        key={`${item.text}-${index}`}
                                        className={[
                                            'mr-1 inline-block rounded px-1',
                                            item.status === 'correct'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : item.status === 'half'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-red-100 text-red-700'
                                        ].join(' ')}
                                    >
                                        {item.text}
                                    </span>
                                ))
                                : <span className="text-slate-400">No typed content</span>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-slate-500 px-6 py-2.5 text-sm font-black text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ReportBlock({
    title,
    subtitle,
    color,
    rows,
    net
}: {
    title: string
    subtitle: string
    color: 'red' | 'blue' | 'emerald'
    rows: Array<[string, string]>
    net: number
}) {

    const styles = {
        red: {
            wrapper: 'from-red-50 to-rose-50 border-red-200',
            badge: 'bg-red-600',
            net: 'text-red-700'
        },
        blue: {
            wrapper: 'from-blue-50 to-sky-50 border-blue-200',
            badge: 'bg-blue-600',
            net: 'text-blue-700'
        },
        emerald: {
            wrapper: 'from-emerald-50 to-teal-50 border-emerald-200',
            badge: 'bg-emerald-600',
            net: 'text-emerald-700'
        }
    }

    return (
        <div className={`rounded-xl border bg-gradient-to-r p-4 ${styles[color].wrapper}`}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black text-white ${styles[color].badge}`}>
                    {title}
                </span>
                <span className="text-xs font-bold text-slate-600">{subtitle}</span>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                {rows.map(([label, value]) => (
                    <div key={label}>
                        <span className="block text-xs text-slate-500">{label}</span>
                        <div className="font-black text-slate-800">{value}</div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                <span className="text-sm font-black text-slate-800">Net Speed</span>
                <span className={`text-2xl font-black ${styles[color].net}`}>
                    {net.toFixed(2)} WPM
                </span>
            </div>
        </div>
    )
}

function transliterateWord(
    word: string
) {

    let out =
        word.toLowerCase()

    for (const [roman, hindi] of romanMap) {
        out =
            out
                .split(roman)
                .join(hindi)
    }

    return out
}

function transliterateText(
    text: string
) {

    return text
        .split(/(\s+)/)
        .map((part) =>
            /^\s+$/.test(part)
                ? part
                : transliterateWord(part)
        )
        .join('')
}

function normalizeHindiTypingInput(
    text: string
) {
    const normalizedText =
        normalizeHindiText(text)

    if (!normalizedText) {
        return normalizedText
    }

    const trailingWhitespace =
        normalizedText.match(/\s+$/)?.[0] || ''

    const body =
        trailingWhitespace
            ? normalizedText.slice(
                0,
                -trailingWhitespace.length
            )
            : normalizedText

    if (!body) {
        return normalizedText
    }

    const lastSpaceIndex =
        Math.max(
            body.lastIndexOf(' '),
            body.lastIndexOf('\n'),
            body.lastIndexOf('\t')
        )

    const committedText =
        lastSpaceIndex >= 0
            ? body.slice(0, lastSpaceIndex + 1)
            : trailingWhitespace
                ? body
                : ''

    const activeWord =
        lastSpaceIndex >= 0
            ? body.slice(lastSpaceIndex + 1)
            : trailingWhitespace
                ? ''
                : body

    return [
        transliterateText(committedText),
        trailingWhitespace
            ? transliterateWord(activeWord)
            : activeWord,
        trailingWhitespace
    ].join('')
}

function normalizeHindiInputByMode(
    text: string,
    mode: HindiInputMode
) {
    if (mode === 'unicode') {
        return normalizeHindiText(text)
    }

    if (mode === 'remington') {
        return normalizeHindiText(
            convertRemingtonKrutiDevToUnicode(text)
        )
    }

    return normalizeHindiTypingInput(text)
}

function convertRemingtonKrutiDevToUnicode(
    text: string
) {
    let converted =
        ''

    for (const char of text) {
        converted +=
            legacyRemingtonInputChars.has(char)
                ? krutiDevShortcutMap[char] ||
                remingtonKeyMap[char] ||
                char
                : char
    }

    return reorderLegacyHindiMatras(converted)
}

function reorderLegacyHindiMatras(
    text: string
) {
    return text
        .replace(/ि([क-हक़-य़][़]?्?[रयवल]?)/g, '$1ि')
        .replace(/र्([क-हक़-य़][़]?)/g, '$1्र')
}

function getHindiInputModeLabel(
    mode: HindiInputMode
) {
    if (mode === 'unicode') return 'Unicode'
    if (mode === 'remington') return 'Remington'
    return 'Google Indic'
}

function getHindiInputModeTitle(
    mode: HindiInputMode
) {
    if (mode === 'unicode') return 'Unicode Hindi'
    if (mode === 'remington') return 'Remington / KrutiDev / DevLys010'
    return 'Google Indic / Phonetic'
}

function getHindiInputPlaceholder(
    mode: HindiInputMode
) {
    if (mode === 'unicode') {
        return 'Unicode Hindi directly type karein...'
    }

    if (mode === 'remington') {
        return 'Remington/KrutiDev keys se type karein...'
    }

    return 'Google Indic: bharat type karein aur भारत suggestion accept karein...'
}

function getHindiInputTip(
    mode: HindiInputMode
) {
    if (mode === 'unicode') {
        return 'Unicode mode active. Direct Hindi text type/paste karein.'
    }

    if (mode === 'remington') {
        return 'Remington mode active. KrutiDev/DevLys key output Unicode result se compare hoga.'
    }

    return 'Google Indic mode active. Keyboard suggestion final Hindi text ko preserve karega.'
}

function normalizeTypingLanguage(
    language: unknown
): Language {
    const normalizedLanguage =
        String(language || '')
            .trim()
            .toLowerCase()

    return normalizedLanguage === 'english' ||
        normalizedLanguage === 'en'
        ? 'english'
        : 'hindi'
}

function normalizeHindiText(
    text: string
) {
    return text
        .normalize('NFC')
        .replace(/\u25CC/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
}

function formatTime(
    seconds: number
) {

    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0')

    const remainingSeconds =
        (seconds % 60)
            .toString()
            .padStart(2, '0')

    return `${minutes}:${remainingSeconds}`
}

function wordCount(
    text: string
) {

    return text.trim()
        ? text.trim().split(/\s+/).length
        : 0
}

function normalizeTypingTest(
    test: any
): TypingTestListItem {

    const levelName =
        test?.levelName ||
        test?.lev ||
        getLevelName(Number(test?.level || test?.l || 1))

    const level =
        Number(
            test?.level ||
            test?.l ||
            levels.indexOf(levelName) + 1 ||
            1
        )

    const rawLanguage =
        Array.isArray(test?.lan)
            ? test.lan[0]
            : test?.language ||
            test?.lan ||
            'hindi'

    const normalizedLanguage =
        String(rawLanguage).toLowerCase()

    const language: Language =
        normalizedLanguage === 'english' ||
        normalizedLanguage === 'en'
            ? 'english'
            : 'hindi'

    return {
        testId:
            test?.testId ||
            test?._id ||
            '',
        title:
            test?.title ||
            test?.n ||
            test?.name ||
            'Typing Test',
        language,
        level,
        levelName:
            levelName,
        duration:
            Number(test?.duration || test?.time || 1),
        words:
            Number(test?.words || test?.w || 0),
        totalAttempt:
            Number(test?.totalAttempt || test?.totalUsers || 0),
        totalUsers:
            Number(test?.totalUsers || test?.totalAttempt || 0),
        access:
            test?.access !== false,
        available:
            test?.available !== false &&
            test?.av !== false,
        levelUnlocked:
            test?.levelUnlocked !== false,
        history:
            (test?.history || []).map((item: any) => ({
                historyId:
                    item?.historyId ||
                    item?._id ||
                    '',
                status:
                    item?.status ||
                    item?.st ||
                    '',
                attemptNo:
                    Number(item?.attemptNo || item?.an || 0),
                score:
                    Number(item?.score || item?.sc || 0),
                accuracy:
                    Number(item?.accuracy || 0)
            })),
        buttonName:
            test?.buttonName ||
            test?.btnName
    }
}

function getLevelName(
    level: number
) {

    return levels[level - 1] || 'Easy'
}

function formatHistoryDate(
    attemptedAt: number
) {

    if (!attemptedAt) return '--'

    return new Intl.DateTimeFormat(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    ).format(new Date(attemptedAt))
}

function buildTypingResultPayload({
    test,
    result,
    typedText,
    duration,
    remaining,
    backspaces,
    startedAt,
    submittedAt
}: {
    test: TypingTestData
    result: Result
    typedText: string
    duration: number
    remaining: number
    backspaces: number
    startedAt: number
    submittedAt: number
}) {

    return {
        testId: test.testId,
        historyId: test.historyId,
        attemptNo: test.attemptNo,
        title: test.title,
        language: test.language,
        level: test.level,
        levelName: test.levelName || getLevelName(test.level),
        durationSec: duration * 60,
        elapsedSec: result.elapsed,
        remainingSec: remaining,
        startedAt,
        submittedAt,
        typedLength: result.charsTyped,
        wordEntries: result.wordEntries,
        backspaces,
        typedText
    }
}

function splitGraphemes(
    text: string
) {
    if (
        typeof Intl !== 'undefined' &&
        'Segmenter' in Intl
    ) {
        const segmenter =
            new Intl.Segmenter(
                'hi',
                {
                    granularity: 'grapheme'
                }
            )

        return Array.from(
            segmenter.segment(text),
            (part) => part.segment
        )
    }

    return Array.from(text)
}

function isWhitespaceGrapheme(
    value: string
) {
    return /^\s+$/.test(value)
}

function findCurrentWordStart(
    chars: string[],
    currentIndex: number
) {
    let index =
        Math.min(
            currentIndex,
            chars.length
        ) - 1

    while (
        index >= 0 &&
        !isWhitespaceGrapheme(chars[index])
    ) {
        index -= 1
    }

    return index + 1
}

function findCurrentWordEnd(
    chars: string[],
    currentIndex: number
) {
    let index =
        Math.max(
            0,
            Math.min(
                currentIndex,
                chars.length
            )
        )

    while (
        index < chars.length &&
        !isWhitespaceGrapheme(chars[index])
    ) {
        index += 1
    }

    return index
}

function countCommittedTypedWords(
    typedChars: string[]
) {
    const typedText =
        typedChars.join('')

    if (!typedText.trim()) {
        return 0
    }

    const committedText =
        /\s$/.test(typedText)
            ? typedText.trim()
            : typedText.slice(
                0,
                Math.max(
                    0,
                    typedText.search(/\S+$/)
                )
            ).trim()

    return committedText
        ? committedText.split(/\s+/).length
        : 0
}

function findExpectedBoundaryAfterWords(
    expectedChars: string[],
    wordCount: number
) {
    if (wordCount <= 0) {
        return 0
    }

    let wordsSeen =
        0

    let inWord =
        false

    for (let index = 0; index < expectedChars.length; index += 1) {
        const isSpace =
            isWhitespaceGrapheme(expectedChars[index])

        if (!isSpace && !inWord) {
            inWord =
                true
        }

        if (isSpace && inWord) {
            wordsSeen += 1
            inWord =
                false

            if (wordsSeen >= wordCount) {
                return index + 1
            }
        }
    }

    return inWord && wordsSeen + 1 >= wordCount
        ? expectedChars.length
        : expectedChars.length
}

function findHindiCommittedUntil(
    expectedChars: string[],
    typedChars: string[]
) {
    return findExpectedBoundaryAfterWords(
        expectedChars,
        countCommittedTypedWords(typedChars)
    )
}

function findHindiActiveWordStart(
    expectedChars: string[],
    typedChars: string[]
) {
    return findHindiCommittedUntil(
        expectedChars,
        typedChars
    )
}

function getCommittedTypedWords(
    typedChars: string[]
) {
    const typedText =
        typedChars.join('')

    if (!typedText.trim()) {
        return []
    }

    const committedText =
        /\s$/.test(typedText)
            ? typedText.trim()
            : typedText.slice(
                0,
                Math.max(
                    0,
                    typedText.search(/\S+$/)
                )
            ).trim()

    return committedText
        ? committedText.split(/\s+/)
        : []
}

function getExpectedWordIndexAt(
    expectedChars: string[],
    index: number
) {
    let wordIndex =
        -1

    let inWord =
        false

    for (let cursor = 0; cursor <= index && cursor < expectedChars.length; cursor += 1) {
        const isSpace =
            isWhitespaceGrapheme(expectedChars[cursor])

        if (!isSpace && !inWord) {
            wordIndex += 1
            inWord =
                true
        }

        if (isSpace) {
            inWord =
                false
        }
    }

    return wordIndex
}

function getWordRange(
    chars: string[],
    index: number
) {
    let start =
        Math.max(
            0,
            Math.min(
                index,
                chars.length
            )
        )

    while (
        start > 0 &&
        !isWhitespaceGrapheme(chars[start - 1])
    ) {
        start -= 1
    }

    let end =
        Math.max(
            0,
            Math.min(
                index,
                chars.length
            )
        )

    while (
        end < chars.length &&
        !isWhitespaceGrapheme(chars[end])
    ) {
        end += 1
    }

    return {
        start,
        end
    }
}

function getHindiCompletedWordStatus(
    expectedChars: string[],
    typedChars: string[],
    index: number
) {
    if (isWhitespaceGrapheme(expectedChars[index])) {
        return ''
    }

    const {
        start,
        end
    } =
        getWordRange(
            expectedChars,
            index
        )

    const expectedWord =
        expectedChars
            .slice(start, end)
            .join('')

    const typedWord =
        getCommittedTypedWords(typedChars)[
            getExpectedWordIndexAt(
                expectedChars,
                index
            )
        ] || ''

    if (!typedWord) {
        return ''
    }

    return expectedWord === typedWord
        ? 'text-emerald-700'
        : 'rounded bg-red-100 text-red-700'
}

function levenshtein(
    a: string,
    b: string
) {
    const aChars =
        splitGraphemes(a)

    const bChars =
        splitGraphemes(b)

    const matrix =
        Array.from(
            {
                length: aChars.length + 1
            },
            () => Array(bChars.length + 1).fill(0)
        )

    for (let i = 0; i <= aChars.length; i += 1) {
        matrix[i][0] = i
    }

    for (let j = 0; j <= bChars.length; j += 1) {
        matrix[0][j] = j
    }

    for (let i = 1; i <= aChars.length; i += 1) {
        for (let j = 1; j <= bChars.length; j += 1) {
            matrix[i][j] =
                Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] +
                    (aChars[i - 1] === bChars[j - 1] ? 0 : 1)
                )
        }
    }

    return matrix[aChars.length][bChars.length]
}

function analyzeText(
    expected: string,
    actual: string
) {

    const expectedWords =
        expected.trim().split(/\s+/).filter(Boolean)

    const actualWords =
        actual.trim().split(/\s+/).filter(Boolean)

    const expectedChars =
        splitGraphemes(expected)

    const actualChars =
        splitGraphemes(actual)

    let correctChars =
        0

    for (
        let index = 0;
        index < Math.min(expectedChars.length, actualChars.length);
        index += 1
    ) {
        if (expectedChars[index] === actualChars[index]) {
            correctChars += 1
        }
    }

    let fullSub =
        0

    let omission =
        0

    let addition =
        0

    let halfSpelling =
        0

    const preview: Array<{
        text: string
        status: 'correct' | 'half' | 'wrong'
    }> = []

    const maxWords =
        actualWords.length

    for (let index = 0; index < maxWords; index += 1) {
        const expectedWord =
            expectedWords[index] || ''

        const actualWord =
            actualWords[index] || ''

        if (!expectedWord && actualWord) {
            addition += 1
            preview.push({
                text: actualWord,
                status: 'wrong'
            })
            continue
        }

        if (expectedWord && !actualWord) {
            omission += 1
            preview.push({
                text: `(${expectedWord})`,
                status: 'wrong'
            })
            continue
        }

        if (expectedWord === actualWord) {
            preview.push({
                text: actualWord,
                status: 'correct'
            })
            continue
        }

        if (levenshtein(expectedWord, actualWord) <= 1) {
            halfSpelling += 1
            preview.push({
                text: actualWord,
                status: 'half'
            })
        } else {
            fullSub += 1
            preview.push({
                text: actualWord,
                status: 'wrong'
            })
        }
    }

    const fullMistakes =
        omission + addition + fullSub

    const halfMistakes =
        halfSpelling

    const totalMistakes =
        fullMistakes + halfMistakes / 2

    return {
        correctChars,
        fullMistakes,
        halfMistakes,
        totalMistakes,
        omission,
        addition,
        fullSub,
        halfSpelling,
        preview
    }
}

function computeLiveResult({
    expected,
    actual,
    durationSec,
    remaining,
    backspaces
}: {
    expected: string
    actual: string
    durationSec: number
    remaining: number
    backspaces: number
}) {

    const elapsed =
        Math.max(
            1,
            durationSec - remaining
        )

    const minutes =
        elapsed / 60

    let correctChars =
        0

    const expectedChars =
        splitGraphemes(expected)

    const actualChars =
        splitGraphemes(actual)

    for (
        let index = 0;
        index < Math.min(expectedChars.length, actualChars.length);
        index += 1
    ) {
        if (expectedChars[index] === actualChars[index]) {
            correctChars += 1
        }
    }

    const charsTyped =
        actualChars.length

    const grossWpm =
        charsTyped / 5 / minutes

    const totalErrors =
        Math.max(
            0,
            charsTyped - correctChars
        )

    const errorRate =
        totalErrors / 5 / minutes

    return {
        elapsed,
        minutes,
        wordEntries:
            wordCount(actual),
        charsTyped,
        grossWpm,
        accuracy:
            charsTyped
                ? (correctChars / charsTyped) * 100
                : 0,
        totalErrors,
        errorRate,
        net1:
            Math.max(
                0,
                grossWpm - errorRate
            ),
        backspaces
    }
}

function computeResult({
    expected,
    actual,
    durationSec,
    remaining,
    backspaces
}: {
    expected: string
    actual: string
    durationSec: number
    remaining: number
    backspaces: number
}) {

    const elapsed =
        Math.max(
            1,
            durationSec - remaining
        )

    const minutes =
        elapsed / 60

    const charsTyped =
        splitGraphemes(actual).length

    const wordEntries =
        wordCount(actual)

    const grossWpm =
        charsTyped / 5 / minutes

    const analysis =
        analyzeText(
            expected,
            actual
        )

    const accuracy =
        charsTyped
            ? (analysis.correctChars / charsTyped) * 100
            : 0

    const totalErrors =
        Math.max(
            0,
            charsTyped - analysis.correctChars
        )

    const errorRate =
        totalErrors / 5 / minutes

    const net1 =
        Math.max(
            0,
            grossWpm - errorRate
        )

    const net2 =
        Math.max(
            0,
            (wordEntries - analysis.totalMistakes) / minutes
        )

    const ignorable =
        Math.min(
            analysis.totalMistakes,
            wordEntries * 0.05
        )

    const netMistakes =
        Math.max(
            0,
            analysis.totalMistakes - ignorable
        )

    const net3 =
        Math.max(
            0,
            (wordEntries - netMistakes) / minutes
        )

    return {
        elapsed,
        minutes,
        wordEntries,
        charsTyped,
        grossWpm,
        analysis,
        accuracy,
        totalErrors,
        errorRate,
        net1,
        net2,
        ignorable,
        netMistakes,
        net3,
        errPct: wordEntries
            ? (analysis.totalMistakes / wordEntries) * 100
            : 0,
        errPct3: wordEntries
            ? (netMistakes / wordEntries) * 100
            : 0,
        backspaces,
        preview: analysis.preview
    }
}
