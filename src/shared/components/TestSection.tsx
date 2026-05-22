'use client'

import { useRouter } from 'next/navigation'

interface TestItem {
    id: number
    title: string
    users: string
    questions: number
    marks: number
    duration: string
    languages: string[]
    locked?: boolean
    buttonText?: string
}

interface CategoryItem {
    id: number
    name: string
}

const categories: CategoryItem[] = [
    { id: 1, name: 'All' },
    { id: 2, name: 'General Intelligence and Reasoning' },
    { id: 3, name: 'General Awareness' },
    { id: 4, name: 'Quantitative Aptitude' },
]

const tests: TestItem[] = [
    {
        id: 1,
        title: 'General Intelligence and Reasoning Sectional Test - 1',
        users: '64.1k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 2,
        title: 'Science Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 3,
        title: 'Math Algebra Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 4,
        title: 'Reasoning Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 5,
        title: 'GK Mega Mock Test',
        users: '81.2k',
        questions: 50,
        marks: 100,
        duration: '45 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 6,
        title: 'Current Affairs Booster',
        users: '55.8k',
        questions: 30,
        marks: 60,
        duration: '20 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 1,
        title: 'General Intelligence and Reasoning Sectional Test - 1',
        users: '64.1k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 2,
        title: 'Science Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 3,
        title: 'Math Algebra Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 4,
        title: 'Reasoning Sectional Test - 2',
        users: '36.4k',
        questions: 25,
        marks: 50,
        duration: '15 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 5,
        title: 'GK Mega Mock Test',
        users: '81.2k',
        questions: 50,
        marks: 100,
        duration: '45 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },
    {
        id: 6,
        title: 'Current Affairs Booster',
        users: '55.8k',
        questions: 30,
        marks: 60,
        duration: '20 Mins',
        languages: ['English', 'Hindi'],
        locked: true,
        buttonText: 'Unlock Now',
    },


]

const includedFeatures = [
    'SSC CGL Tier 1 & 2 (Full length)',
    'SSC GD Constable Topic wise 95+ tests',
    'Railway Group D previous year papers set',
    'Banking Puzzle Booster & DI master',
    'Weekly All India Open Mock (every Sunday)',
    'Chapter-wise quizzes & revision tests',
]

export default function TestSection() {

    const router = useRouter()

    const handleTestClick = (test: TestItem) => {

        if (test.locked) {

            alert('Proceeding to unlock...')
            return
        }

        router.push(`/test/${test.id}`)
    }

    return (

        <div className="m-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* LEFT SECTION */}
                <div className="lg:col-span-3 p-3 sm:p-5 md:p-7 min-w-0">

                    <div className="flex items-center gap-2 mb-3 flex-wrap">

                        <span className="bg-rose-100 text-rose-700 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ Bestseller
                        </span>

                        <span className="text-yellow-500 text-[11px] sm:text-sm">
                            ★★★★★ (2.4k reviews)
                        </span>
                    </div>

                    <h2 className="text-[14px] sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight">
                        SSC GD Constable 2026 Platinum Pack
                    </h2>

                    <p className="text-gray-600 text-[13px] sm:text-base leading-relaxed mt-3 mb-4">
                        120+ full-length mock tests based on latest SSC GD pattern,
                        previous year paper replicas, chapter-wise quizzes,
                        GK special booster & All India Rank.
                    </p>

                    {/* MAIN BOX */}
                    <div className="bg-slate-50 max-w-4xl w-full rounded-2xl border border-gray-100 overflow-hidden">

                        {/* STICKY HEADER AREA */}
                        <div className="sticky top-0 z-20 bg-slate-50 border-b border-gray-200">

                            {/* TOP BUTTONS */}
                            <div className="p-3 sm:p-4 flex gap-2 sm:gap-3">

                                <button className="cursor-pointer bg-sky-500 text-white px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm">
                                    Mock Tests
                                </button>

                                <button className="cursor-pointer bg-white border border-gray-200 text-gray-600 px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-50 transition">
                                    PYPs
                                </button>
                            </div>

                            {/* CATEGORY */}
                            <div className="px-3 pb-3">

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

                                    <div className="p-3 bg-[#fafafa] border-b border-gray-100 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                                        {categories.map((category, index) => (
                                            <span
                                                key={category.id}
                                                className={`text-[11px] px-3 py-1.5 rounded font-medium whitespace-nowrap shrink-0 cursor-pointer ${index === 0
                                                    ? 'bg-slate-500 text-white'
                                                    : 'bg-white border text-gray-600'
                                                    }`}
                                            >
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ONLY TESTS SCROLL */}
                        <div className="max-h-[650px] overflow-y-auto p-3 sm:p-4 space-y-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-indigo-100 [&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                            {tests.map((test) => (

                                <div
                                    key={test.id}
                                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition hover:shadow-md"
                                >

                                    <div className="space-y-1.5 min-w-0 w-full sm:w-auto">

                                        <div className="flex items-center gap-2 flex-wrap">

                                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                                                {test.title}
                                            </h4>

                                            <span className="text-amber-500 text-[10px] font-bold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                                                ⚡ {test.users} Users
                                            </span>
                                        </div>

                                        <div className="flex gap-3 text-[11px] text-gray-400 font-medium flex-wrap">

                                            <span>
                                                📄 {test.questions} Questions
                                            </span>

                                            <span>
                                                📊 {test.marks} Marks
                                            </span>

                                            <span>
                                                ⏱️ {test.duration}
                                            </span>
                                        </div>

                                        <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                                            🌐 {test.languages.join(', ')}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleTestClick(test)}
                                        className="cursor-pointer w-full sm:w-auto shrink-0 bg-[#4A3F77] text-white font-medium px-4 py-2 rounded-xl text-[11px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(74,63,119,0.3)] hover:shadow-[0_6px_18px_rgba(74,63,119,0.4)] hover:-translate-y-0.5 transition-all active:scale-95"
                                    >

                                        <span className="bg-white/15 p-1 rounded-md text-[10px]">
                                            🔒
                                        </span>

                                        <span>
                                            {test.buttonText}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="lg:col-span-2 p-3 sm:p-5 md:p-7 mt-10">

                    <div className="bg-white rounded-2xl shadow-md border border-indigo-50 sticky top-6 overflow-hidden">

                        <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">

                            <h3 className="font-black text-gray-800 flex items-center gap-2">

                                <span className="text-indigo-600 text-xl">
                                    📋
                                </span>

                                What's Included in this Pack
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                                Updated every week · Access on any device
                            </p>
                        </div>

                        <div className="p-5 max-h-[550px] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-indigo-100 [&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                            <div className="mb-5">

                                <div className="flex items-center justify-between mb-2">

                                    <span className="font-bold text-indigo-800 text-sm">
                                        🔥 THIS WEEK (Free for all)
                                    </span>

                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                                        Live Now
                                    </span>
                                </div>

                                <div className="space-y-3">

                                    {[
                                        '120 Full Mock Tests (Tier-I style)',
                                        '35 Chapter-wise Topic Tests',
                                        'Weekly Sunday Grand Mock (FREE)',
                                        'Access on Desktop, Laptop, Tablet, Mobile',
                                        '15 Previous Year Solved Papers',
                                        'GK & Current Affairs booster',
                                    ].map((item, index) => (

                                        <div
                                            key={index}
                                            className="flex justify-between items-center border-b pb-2"
                                        >

                                            <div>

                                                <p className="font-medium text-sm">
                                                    ✓ {item}
                                                </p>

                                                <p className="text-[11px] text-gray-400">
                                                    Weekly Updated
                                                </p>
                                            </div>

                                            <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                                                FREE
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">

                                <div className="flex items-center gap-2">

                                    <span className="text-sm font-black">
                                        📌 All Practice Tests
                                    </span>

                                    <span className="bg-gray-200 text-[10px] px-2 rounded-full">
                                        450+
                                    </span>
                                </div>

                                <ul className="mt-3 space-y-2 text-sm text-gray-700">

                                    {includedFeatures.map((feature, index) => (

                                        <li
                                            key={index}
                                            className="flex gap-2 text-xs md:text-sm"
                                        >

                                            <span className="text-indigo-500">
                                                ✓
                                            </span>

                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border mt-3">

                                <p className="text-[12px] font-bold flex items-center gap-1">
                                    🖥️💻📱 Cross-Platform Access
                                </p>

                                <p className="text-[11px] text-gray-500 mt-1">
                                    Use your same account on Desktop, Laptop,
                                    Tablet, Mobile.
                                </p>

                                <div className="flex mt-3 gap-2 text-gray-600 text-[10px] font-medium flex-wrap">

                                    <span>✔ Windows</span>
                                    <span>✔ macOS</span>
                                    <span>✔ Android</span>
                                    <span>✔ iOS</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t">
                            🎓 Enroll any course & unlock full test library + weekly challenges
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}