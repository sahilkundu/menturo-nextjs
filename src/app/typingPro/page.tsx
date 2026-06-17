'use client'

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import type {
    KeyboardEvent,
    ReactNode
} from 'react'

import {
    BadgeCheck,
    BarChart3,
    CalendarDays,
    ChevronDown,
    Check,
    ClipboardList,
    Clock3,
    Expand,
    Gauge,
    Hash,
    Info,
    Keyboard,
    Lightbulb,
    Lock,
    Moon,
    Play,
    RotateCcw,
    Rocket,
    Send,
    Settings,
    Sparkles,
    Sun,
    Target,
    Trophy,
    User,
    X
} from 'lucide-react'

type Language = 'hindi' | 'english'

type Result = ReturnType<typeof computeResult>

const passages = {
    hindi: 'विज्ञान और तकनीक ने मानव जीवन को बहुत सरल और सुविधाजनक बना दिया है। कंप्यूटर एक ऐसी मशीन है जो अनेक कार्य बहुत ही तेजी और शुद्धता के साथ करती है। आज लगभग हर क्षेत्र में कंप्यूटर का उपयोग हो रहा है। शिक्षा, व्यापार, बैंक, रेलवे, अस्पताल, उद्योग, सरकारी कार्यालय आदि सभी जगहों पर कंप्यूटर का महत्व बढ़ता जा रहा है। यदि हमें भविष्य में सफल होना है तो कंप्यूटर का ज्ञान होना अत्यंत आवश्यक है। टाइपिंग सीखना भी बहुत जरूरी है क्योंकि कंप्यूटर पर कार्य करने के लिए टाइपिंग का ज्ञान अनिवार्य है।',
    english: 'Typing speed matters when accuracy, rhythm, focus, and clean finger movement all work together during a timed exam. Practice daily with short word groups, keep your eyes on the screen, avoid random backspace habits, and try to maintain a steady pace from start to finish.'
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

const historyItems = [
    ['1 Minute Test', '25 Apr, 2025 • 10:45 AM', '52 WPM', 'Best'],
    ['1 Minute Test', '24 Apr, 2025 • 09:12 AM', '41 WPM', '92.10%'],
    ['2 Minute Test', '23 Apr, 2025 • 04:30 PM', '63 WPM', '95.20%'],
    ['1 Minute Test', '22 Apr, 2025 • 11:05 AM', '38 WPM', '90.12%'],
    ['1 Minute Test', '21 Apr, 2025 • 08:50 PM', '45 WPM', '93.15%']
]

const levels = [
    'Easy',
    'Medium',
    'Hard',
    'Expert',
    'Master'
]

export default function TypingProPage() {

    const typingRef =
        useRef<HTMLTextAreaElement>(null)

    const paragraphRef =
        useRef<HTMLDivElement>(null)

    const testShellRef =
        useRef<HTMLDivElement>(null)

    const timerRef =
        useRef<ReturnType<typeof setInterval> | null>(null)

    const [name, setName] =
        useState('Aman Kumar')

    const [language, setLanguage] =
        useState<Language>('hindi')

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

    const [backspaces, setBackspaces] =
        useState(0)

    const [result, setResult] =
        useState<Result | null>(null)

    const [isFullscreen, setIsFullscreen] =
        useState(false)

    const activeText =
        passages[language]

    const expectedChars =
        useMemo(
            () => [...activeText],
            [activeText]
        )

    const liveResult =
        useMemo(
            () =>
                computeResult({
                    expected: activeText,
                    actual: typed,
                    durationSec: duration * 60,
                    remaining,
                    backspaces
                }),
            [
                activeText,
                typed,
                duration,
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

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

    }, [
        duration,
        language
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

        current?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest'
        })

    }, [
        typed,
        highlightEnabled,
        autoScrollEnabled
    ])

    useEffect(() => {

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
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

                        finishTest()
                        return 0
                    }

                    return current - 1
                })
            }, 1000)
    }

    const requestTypingFullscreen = async () => {

        if (document.fullscreenElement) return

        try {
            await testShellRef.current?.requestFullscreen()
        } catch {
            setIsFullscreen(false)
        }
    }

    const handleStartTest = async () => {

        resetTest()

        requestAnimationFrame(() => {
            typingRef.current?.focus()
        })

        await requestTypingFullscreen()
    }

    const handleTypingClick = async () => {

        typingRef.current?.focus()
        await requestTypingFullscreen()
    }

    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {

        if (event.key === 'Backspace') {
            if (!backspaceEnabled) {
                event.preventDefault()
                return
            }

            setBackspaces((current) => current + 1)
        }

        if (!started && event.key.length === 1) {
            startTimer()
        }
    }

    const handleInput = (
        value: string
    ) => {

        const nextValue =
            language === 'hindi'
                ? transliterateText(value)
                : value

        if (!started && nextValue.length > 0) {
            startTimer()
        }

        setTyped(nextValue)

        if ([...nextValue].length >= expectedChars.length) {
            finishTest(nextValue)
        }
    }

    const finishTest = (
        finalText = typed
    ) => {

        if (ended) return

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        setEnded(true)
        setStarted(false)

        setResult(
            computeResult({
                expected: activeText,
                actual: finalText,
                durationSec: duration * 60,
                remaining,
                backspaces
            })
        )
    }

    const resetTest = () => {

        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        setRemaining(duration * 60)
        setTyped('')
        setStarted(false)
        setEnded(false)
        setBackspaces(0)
        setResult(null)
    }

    return (
        <main className="min-h-screen bg-[#f7f8fc] text-[#080d31]">

            <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-5 py-2 shadow-[0_8px_26px_rgba(15,23,42,0.06)] backdrop-blur xl:px-8">

                <div className="flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#6d2dea] to-[#2f18bb] text-white shadow-lg shadow-violet-200">
                            <Keyboard size={18} />
                        </div>

                        <div>
                            <h1 className="text-xl font-black tracking-normal text-[#080d31] md:text-[18px]">
                                Hindi English Typing Test Pro
                            </h1>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                3 Report Methods • Exam-style
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-700 shadow-sm">
                                <Sun size={17} />
                            </button>
                            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700">
                                <Moon size={17} />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                            <button
                                onClick={() => setLanguage('hindi')}
                                className={[
                                    'rounded-full px-5 py-2 text-xs font-black transition',
                                    language === 'hindi'
                                        ? 'bg-gradient-to-r from-[#722ee8] to-[#3a20c7] text-white shadow-md shadow-violet-200'
                                        : 'text-slate-800'
                                ].join(' ')}
                            >
                                हिंदी
                            </button>

                            <button
                                onClick={() => setLanguage('english')}
                                className={[
                                    'rounded-full px-5 py-2 text-xs font-black transition',
                                    language === 'english'
                                        ? 'bg-gradient-to-r from-[#722ee8] to-[#3a20c7] text-white shadow-md shadow-violet-200'
                                        : 'text-slate-800'
                                ].join(' ')}
                            >
                                English
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pl-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1190] text-xl font-black text-white">
                                {name.trim().charAt(0) || 'A'}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-black">{name || 'Guest'}</p>
                                    <ChevronDown size={15} />
                                </div>

                                <p className="text-xs font-bold text-emerald-600">
                                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </header>

            <div className="grid gap-6 px-5 py-5 xl:grid-cols-[360px_minmax(0,1fr)] xl:px-8">

                <aside className="space-y-4">

                    <section className="overflow-hidden rounded-[10px] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]">

                        <div className="flex items-center gap-4 bg-gradient-to-r from-[#642be4] to-[#3519bd] p-5 text-white">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white/15">
                                <Settings size={23} />
                            </div>

                            <div>
                                <h2 className="text-lg font-black">Test Settings</h2>
                                <p className="text-xs text-white/85">Customize your typing test</p>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">

                            <label className="block">
                                <span className="text-xs font-black">Enter Your Name</span>
                                <span className="mt-2 flex items-center rounded-[9px] border border-slate-200 bg-white px-3">
                                    <input
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="min-w-0 flex-1 py-2.5 text-sm font-bold outline-none"
                                    />
                                    <User size={17} className="text-slate-500" />
                                </span>
                            </label>

                            <label className="block">
                                <span className="text-xs font-black">Select Test Time</span>
                                <span className="mt-2 flex items-center gap-3 rounded-[9px] border border-slate-200 bg-white px-3 py-2.5">
                                    <Clock3 size={18} className="text-indigo-700" />
                                    <select
                                        value={duration}
                                        onChange={(event) => setDuration(Number(event.target.value))}
                                        className="min-w-0 flex-1 bg-transparent text-sm font-black outline-none"
                                    >
                                        {Array.from({ length: 10 }, (_, index) => index + 1).map((minute) => (
                                            <option key={minute} value={minute}>
                                                {minute} {minute === 1 ? 'Minute' : 'Minutes'}
                                            </option>
                                        ))}
                                    </select>
                                </span>
                            </label>
                            <div className="space-y-3 border-t border-slate-100 pt-3">

                                <ChoiceRow
                                    icon={<Keyboard size={16} />}
                                    title="Backspace"
                                    enabled={backspaceEnabled}
                                    onChange={setBackspaceEnabled}
                                />

                                <ChoiceRow
                                    icon={<Sparkles size={16} />}
                                    title="Highlight & Auto Scroll"
                                    enabled={highlightEnabled && autoScrollEnabled}
                                    onChange={(enabled) => {
                                        setHighlightEnabled(enabled)
                                        setAutoScrollEnabled(enabled)
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleStartTest}
                                    className="flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#5a2ee6] to-[#391dc8] px-3 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition active:scale-[0.98]"
                                >
                                    <Play size={18} />
                                    Start Test
                                </button>
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
                            <div className="absolute left-[9%] top-[23px] h-2 w-[31%] rounded-full bg-gradient-to-r from-[#5125dd] via-[#1585f2] to-[#ffbd2f]"></div>

                            <div className="relative grid grid-cols-5 gap-1">
                                {levels.map((level, index) => {

                                    const levelStyles = [
                                        'border-[#4421d3] bg-gradient-to-br from-[#702ee8] to-[#3518c4] text-white shadow-violet-200',
                                        'border-[#1392f4] bg-gradient-to-br from-[#45c3ff] to-[#0779e8] text-white shadow-sky-200',
                                        'border-[#f5b73a] bg-gradient-to-br from-[#ffc94b] to-[#f59d1e] text-white shadow-amber-200',
                                        'border-slate-300 bg-slate-100 text-slate-700 shadow-slate-200',
                                        'border-slate-300 bg-slate-100 text-slate-700 shadow-slate-200'
                                    ]

                                    return (
                                        <div key={level} className="text-center">
                                            <div className="relative mx-auto h-12 w-12">
                                                <div
                                                    className={[
                                                        'flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-black shadow-lg',
                                                        levelStyles[index]
                                                    ].join(' ')}
                                                >
                                                    {index + 1}
                                                </div>

                                                {index < 2 && (
                                                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </span>
                                                )}

                                                {index > 1 && index < 4 && (
                                                    <span
                                                        className={[
                                                            'absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm',
                                                            index === 2
                                                                ? 'bg-amber-100 text-amber-600'
                                                                : 'bg-slate-100 text-slate-500'
                                                        ].join(' ')}
                                                    >
                                                        <Lock size={9} strokeWidth={3} />
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-[11px] font-medium text-slate-600">{level}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 rounded-[9px] bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 shadow-inner shadow-slate-100">
                            <Lock size={15} className="text-amber-500" />
                            Complete previous level to unlock next
                        </div>
                    </section>

                </aside>

                <section
                    ref={testShellRef}
                    className="min-w-0 space-y-4 bg-[#f7f8fc] fullscreen:overflow-auto fullscreen:p-5"
                >

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            icon={<User size={26} />}
                            label="USER NAME"
                            value={name || 'Guest'}
                            detail="ID: #TK2025-0456"
                            iconClass="bg-violet-100 text-violet-700"
                        />

                        <StatCard
                            icon={<Clock3 size={26} />}
                            label="TIME LEFT"
                            value={formatTime(remaining)}
                            detail={started ? 'Running' : ended ? 'Finished' : 'Ready'}
                            iconClass="bg-blue-50 text-blue-600"
                            meter={remaining / (duration * 60)}
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
                            label="TODAY'S BEST"
                            value="52 WPM"
                            detail="Accuracy: 96.45%"
                            iconClass="bg-amber-50 text-amber-600"
                        />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">

                        <section className="rounded-[10px] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-lg font-black">
                                    {language === 'hindi'
                                        ? 'Hindi Typing Test (KrutiDev/DevLys 010)'
                                        : 'English Typing Test'}
                                </h2>

                                <p className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                                    <Keyboard size={17} />
                                    Exam-like result layout
                                </p>
                            </div>

                            <div
                                ref={paragraphRef}
                                className="mt-5 h-[265px] overflow-y-auto rounded-[10px] border border-slate-200 bg-[#fbfbff] p-5 text-[20px] leading-[2] text-slate-900"
                            >
                                {expectedChars.map((char, index) => {

                                    const current =
                                        index === [...typed].length

                                    const typedChar =
                                        [...typed][index]

                                    const isTyped =
                                        index < [...typed].length

                                    const statusClass =
                                        isTyped
                                            ? typedChar === char
                                                ? 'text-emerald-700'
                                                : 'rounded bg-red-100 text-red-700'
                                            : highlightEnabled && current
                                                ? 'rounded bg-yellow-100 border-b-2 border-yellow-500'
                                                : ''

                                    return (
                                        <span
                                            key={`${char}-${index}`}
                                            data-current={current}
                                            className={`whitespace-pre-wrap transition ${statusClass}`}
                                        >
                                            {char}
                                        </span>
                                    )
                                })}
                            </div>

                            <div
                                onClick={handleTypingClick}
                                className="mt-5 rounded-[10px] border-2 border-sky-500 bg-white p-5 shadow-inner"
                            >
                                <textarea
                                    ref={typingRef}
                                    value={typed}
                                    onChange={(event) => handleInput(event.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={ended}
                                    spellCheck={false}
                                    className="h-48 w-full resize-none text-[16px] font-medium outline-none placeholder:text-slate-400 disabled:bg-white disabled:text-slate-500"
                                    placeholder={
                                        language === 'hindi'
                                            ? 'Hindi mode: Roman type karein, output Hindi me aayega...'
                                            : 'Start typing here...'
                                    }
                                />

                                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                                    <span>{wordCount(typed)} Words • {typed.length} Characters</span>
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
                                    {language === 'hindi'
                                        ? 'Tip: Focus on accuracy, speed will automatically improve.'
                                        : 'English mode active. Normal English typing chalegi.'}
                                </div>

                                <button
                                    onClick={requestTypingFullscreen}
                                    className="flex items-center justify-center gap-2 rounded-[9px] border border-slate-200 bg-white px-4 py-3 text-xs font-black shadow-sm"
                                >
                                    <Expand size={17} className="text-indigo-700" />
                                    Full Screen
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap justify-end gap-3">
                                <button
                                    onClick={() => finishTest()}
                                    className="flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100"
                                >
                                    <Send size={18} />
                                    Submit Test
                                </button>

                                <button
                                    onClick={resetTest}
                                    className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-7 py-3 text-sm font-black text-indigo-700 shadow-sm"
                                >
                                    <RotateCcw size={18} />
                                    Retake Test
                                </button>
                            </div>

                        </section>

                        <aside className="space-y-4">

                            <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-sm font-black">
                                        <Clock3 size={17} className="text-slate-600" />
                                        Your Test History
                                    </h2>

                                    <button className="flex items-center gap-1 text-xs font-black text-indigo-700">
                                        View All
                                        <ChevronDown size={13} className="-rotate-90" />
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {historyItems.map(([title, date, speed, accuracy], index) => (
                                        <div
                                            key={`${title}-${date}`}
                                            className={[
                                                'rounded-[9px] border p-3',
                                                index === 0
                                                    ? 'border-emerald-100 bg-emerald-50'
                                                    : 'border-slate-100 bg-white'
                                            ].join(' ')}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-black">{title}</p>
                                                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                                        <CalendarDays size={12} />
                                                        {date}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs font-black text-emerald-600">{speed}</p>
                                                    <p
                                                        className={[
                                                            'mt-1 text-[11px] font-black',
                                                            index === 0
                                                                ? 'rounded bg-emerald-600 px-2 py-1 text-white'
                                                                : 'text-slate-800'
                                                        ].join(' ')}
                                                    >
                                                        {accuracy}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-[9px] bg-indigo-50 px-4 py-3 text-xs font-black text-indigo-700">
                                    <BadgeCheck size={17} />
                                    View All History
                                </button>
                            </section>

                            <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
                                <h2 className="flex items-center gap-2 text-sm font-black">
                                    <Lock size={17} className="text-slate-700" />
                                    Level Unlock System
                                </h2>

                                <p className="mt-2 text-xs font-medium text-slate-500">
                                    Complete previous level with 90%+ accuracy
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    {levels.map((level, index) => (
                                        <div
                                            key={`right-${level}`}
                                            className={[
                                                'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black',
                                                index < 2
                                                    ? 'border-transparent bg-emerald-500 text-white'
                                                    : index === 2
                                                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                                                        : 'border-slate-300 bg-white text-slate-700'
                                            ].join(' ')}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center gap-3 rounded-[10px] bg-violet-100 p-3 text-violet-900">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-[9px] bg-white/70">
                                        <Lock size={24} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black">Next Level Unlock</p>
                                        <p className="mt-1 text-xs font-bold">
                                            Score 90%+ accuracy to unlock Level 3
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </aside>

                    </div>

                </section>

            </div>

            {result && (
                <ResultModal
                    result={result}
                    onClose={() => setResult(null)}
                    onRetake={resetTest}
                />
            )}

        </main>
    )
}

function ChoiceRow({
    icon,
    title,
    enabled,
    onChange
}: {
    icon: ReactNode
    title: string
    enabled: boolean
    onChange: (enabled: boolean) => void
}) {

    return (
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
            <span className="flex items-center gap-3 text-sm font-black">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    {icon}
                </span>
                {title}
            </span>

            <button
                type="button"
                onClick={() => onChange(true)}
                className="flex items-center gap-2 text-sm font-bold"
            >
                <span
                    className={[
                        'flex h-5 w-5 items-center justify-center rounded border',
                        enabled
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                    ].join(' ')}
                >
                    {enabled ? '✓' : ''}
                </span>
                Enable
            </button>

            <button
                type="button"
                onClick={() => onChange(false)}
                className="flex items-center gap-2 text-sm font-bold"
            >
                <span
                    className={[
                        'flex h-5 w-5 items-center justify-center rounded border',
                        !enabled
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                    ].join(' ')}
                >
                    {!enabled ? '✓' : ''}
                </span>
                Disable
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
    onClose,
    onRetake
}: {
    result: Result
    onClose: () => void
    onRetake: () => void
}) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between bg-[#4E3C7D] px-5 py-4 text-white">
                    <div>
                        <h3 className="text-lg font-black">Your Detailed Typing Test Result</h3>
                        <p className="text-xs text-white/70">Method 1 • Method 2 • 5% Mistakes Ignorable</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 p-5">
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
                        subtitle="(Words - Mistakes x 10) / Time"
                        color="blue"
                        rows={[
                            ['Gross Speed', `${result.grossWpm.toFixed(2)} WPM`],
                            ['Accuracy', `${result.accuracy.toFixed(2)}%`],
                            ['Entries', `${result.wordEntries} Words`],
                            ['Full Mistakes', `${result.analysis.fullMistakes}`],
                            ['Half Mistakes', `${result.analysis.halfMistakes}`],
                            ['Total Mistakes', `${result.analysis.totalMistakes.toFixed(2)}`],
                            ['Penalty', `${(result.analysis.totalMistakes * 10).toFixed(2)}`],
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
                            ['Penalty After', `${(result.netMistakes * 10).toFixed(2)}`],
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

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-slate-500 px-6 py-2.5 text-sm font-black text-white"
                        >
                            Close
                        </button>

                        <button
                            onClick={onRetake}
                            className="rounded-xl bg-[#4E3C7D] px-6 py-2.5 text-sm font-black text-white"
                        >
                            Retake Test
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

function levenshtein(
    a: string,
    b: string
) {

    const matrix =
        Array.from(
            {
                length: a.length + 1
            },
            () => Array(b.length + 1).fill(0)
        )

    for (let i = 0; i <= a.length; i += 1) {
        matrix[i][0] = i
    }

    for (let j = 0; j <= b.length; j += 1) {
        matrix[0][j] = j
    }

    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            matrix[i][j] =
                Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] +
                    (a[i - 1] === b[j - 1] ? 0 : 1)
                )
        }
    }

    return matrix[a.length][b.length]
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
        [...expected]

    const actualChars =
        [...actual]

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
        Math.max(
            expectedWords.length,
            actualWords.length
        )

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
        [...actual].length

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
            (wordEntries - analysis.totalMistakes * 10) / minutes
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
            (wordEntries - netMistakes * 10) / minutes
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
