'use client'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import LeftSidebar from "./LeftSidebar"

interface InputProps {
    type?: string
    name?: string
    label?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon?: React.ElementType
    disabled?: boolean
    required?: boolean
    className?: string
}

export default function HomeCenter() {


    return (
        <>
            {/* <!-- MAIN --> */}
            <div className="w-full min-h-screen p-3 lg:p-4">

                <div className="">

                    <div className="flex gap-4 items-start">



                        {/* <!-- CENTER --> */}
                        <div className="flex-1 min-w-0">

                            {/* <!-- HERO --> */}
                            <div className="relative overflow-hidden rounded-[12px]">

                                {/* <!-- BG --> */}
                                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1800&auto=format&fit=crop"
                                    className="absolute inset-0 w-full h-full object-cover" />

                                {/* <!-- OVERLAY --> */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#111827e8] to-[#6d28d9cc]"></div>

                                {/* <!-- BIG TEXT --> */}
                                <h1 className="absolute top-0 left-7 text-[70px] font-black text-white/10 hidden lg:block">
                                    EDUCATION
                                </h1>

                                {/* <!-- CONTENT --> */}
                                {/* <!-- ADD THIS JUST ABOVE --> */}
                                {/* <!-- <div className="relative z-10 p-5 lg:p-6"> --> */}

                                {/* <!-- 3D PARTICLES --> */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">

                                    <span className="particle particle1"></span>
                                    <span className="particle particle2"></span>
                                    <span className="particle particle3"></span>
                                    <span className="particle particle4"></span>
                                    <span className="particle particle5"></span>
                                    <span className="particle particle6"></span>

                                </div>


                                {/* <!-- YOUR SAME CONTENT --> */}
                                <div className="relative z-10 p-5 lg:p-6">

                                    {/* <!-- TOPBAR (MODIFIED: added mobile menu button + mobile profile trigger - original structure preserved) --> */}
                                    <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">

                                        {/* <!-- LEFT (ADDED mobile menu button) --> */}
                                        <div className="flex items-center gap-4">

                                            {/* <!-- MOBILE MENU BUTTON (ADDED) --> */}
                                            <div className="mobile-menu-btn" id="mobileMenuBtn">
                                                ☰
                                            </div>

                                            <div
                                                className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white text-xl">
                                                🎓
                                            </div>

                                            <div>

                                                <h2 className="text-white text-xl font-bold">
                                                    Mentor
                                                </h2>

                                                <p className="text-white/70 text-sm">
                                                    Education Dashboard
                                                </p>

                                            </div>

                                        </div>

                                        {/* <!-- RIGHT (ADDED mobile profile trigger) --> */}
                                        <div className="flex items-center gap-3 flex-wrap">

                                            {/* <!-- SEARCH --> */}
                                            <div className="relative">

                                                <input type="text" placeholder="Search courses..."
                                                    className="w-[170px] lg:w-[320px] h-11 rounded-full glass pl-11 pr-4 text-white placeholder:text-white/60 outline-none" />

                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                                    🔍
                                                </span>

                                            </div>

                                            {/* <!-- MODE --> */}


                                            <button className="w-10 h-10 rounded-full glass text-white">
                                                🔔
                                            </button>

                                            {/* <!-- DESKTOP PROFILE IMAGE (original - unchanged) --> */}
                                            <img src="https://i.pravatar.cc/100?img=12"
                                                className="w-10 h-10 rounded-full border-2 border-white hidden xl:block" />

                                            {/* <!-- MOBILE PROFILE TRIGGER (ADDED) --> */}
                                            <div className="mobile-profile-trigger">
                                                <img src="https://i.pravatar.cc/100?img=12"
                                                    className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                                                    id="mobileProfileBtn" />
                                            </div>

                                        </div>

                                    </div>

                                    {/* <!-- TEXT --> */}
                                    <div className="mt-8">

                                        <p id="greetingText" className="text-violet-200 font-semibold mb-2">
                                            Good Morning 👋
                                        </p>

                                        <h1 id="welcomeUser" className="text-white text-3xl lg:text-4xl font-black leading-tight">
                                            Welcome Back, Aman
                                        </h1>

                                        <p className="text-white/70 mt-4 leading-7 max-w-[650px]">
                                            Manage students, online courses, mentors, analytics and performance from one modern
                                            dashboard.
                                        </p>

                                    </div>

                                    {/* <!-- STATS --> */}
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">

                                        {/* <!-- CARD --> */}
                                        <div className="glass rounded-3xl p-4 text-white">

                                            <p className="text-xs text-white/70 mb-2">
                                                Students
                                            </p>

                                            <div className="flex items-center justify-between">

                                                <h2 className="text-2xl font-black">
                                                    2,635
                                                </h2>

                                                <button className="w-8 h-8 rounded-full bg-white text-black text-sm">
                                                    ↗
                                                </button>

                                            </div>

                                        </div>

                                        {/* <!-- CARD --> */}
                                        <div className="glass rounded-3xl p-4 text-white">

                                            <p className="text-xs text-white/70 mb-2">
                                                Teachers
                                            </p>

                                            <div className="flex items-center justify-between">

                                                <h2 className="text-2xl font-black">
                                                    29
                                                </h2>

                                                <button className="w-8 h-8 rounded-full bg-white text-black text-sm">
                                                    ↗
                                                </button>

                                            </div>

                                        </div>

                                        {/* <!-- CARD --> */}
                                        <div className="bg-[#ebf46d] rounded-3xl p-4">

                                            <p className="text-xs font-semibold mb-3">
                                                Add Members
                                            </p>

                                            <div className="flex gap-2 flex-wrap">

                                                <button className="bg-white px-3 py-2 rounded-xl text-xs font-medium">
                                                    + Student
                                                </button>

                                                <button className="bg-white px-3 py-2 rounded-xl text-xs font-medium">
                                                    + Courses
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* <!-- ADD THIS CSS --> */}


                            </div>

                            {/* <!-- COURSE SECTION --> */}
                            <div className="mt-5 bg-white dark-card rounded-[30px] p-5 main-shadow overflow-hidden">

                                {/* <!-- TOP --> */}
                                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-5">

                                    <div>

                                        <h2 className="text-2xl font-bold dark-text">
                                            Course Manager
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1 dark-sub">
                                            Manage all educational courses.
                                        </p>

                                    </div>

                                    <div className="flex gap-3 flex-wrap">

                                        <button className="h-10 px-4 rounded-xl border text-sm dark-input">
                                            Import
                                        </button>



                                        <button className="h-10 px-5 rounded-xl bg-violet-600 text-white text-sm">
                                            Categories
                                        </button>

                                    </div>

                                </div>

                                {/* <!-- FILTER --> */}
                                <div className="flex flex-col lg:flex-row gap-3 mb-5">

                                    <div className="relative flex-1">

                                        <input type="text" placeholder="Search course..."
                                            className="w-full h-11 rounded-xl border bg-gray-50 pl-11 pr-4 text-sm outline-none dark-input" />

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔍
                                        </span>

                                    </div>

                                    <select className="h-11 px-4 rounded-xl border text-sm dark-input">
                                        <option>All Courses</option>
                                    </select>

                                    <select className="h-11 px-4 rounded-xl border text-sm dark-input">
                                        <option>All Categories</option>
                                    </select>

                                </div>

                                {/* <!-- SLIDER TOP --> */}
                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="font-semibold dark-text">
                                        Popular Courses
                                    </h3>

                                    <div className="flex gap-2">

                                        <button id="prevBtn" className="w-9 h-9 rounded-xl border dark-input">
                                            ‹
                                        </button>

                                        <button id="nextBtn" className="w-9 h-9 rounded-xl border dark-input">
                                            ›
                                        </button>

                                    </div>

                                </div>

                                {/* <!-- SLIDER --> */}
                                {/* <!-- SECTION --> */}
                                <div className="mt-5 bg-white dark-card rounded-[32px] p-5 main-shadow overflow-hidden">

                                    {/* <!-- TOP --> */}
                                    <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-6">

                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2
                                                    className="text-2xl font-black dark-text bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 bg-clip-text text-transparent">
                                                    Popular Govt Exam Test Series
                                                </h2>
                                                <span
                                                    className="text-[11px] font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <i className="fas fa-gift text-[10px]"></i> Buy 1 Get 1 Demo Free
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 dark-sub flex items-center gap-1">
                                                <i className="fas fa-trophy text-amber-500 text-[12px]"></i> SSC, HSSC, HPSC, UPSC,
                                                Railway & State Exams
                                            </p>
                                        </div>

                                        {/* <!-- BUTTONS --> */}

                                    </div>

                                    {/* <!-- SLIDER --> */}
                                    <div id="slider"
                                        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">

                                        {/* <!-- CARD 1 - SSC --> */}
                                        <div
                                            className="min-w-[240px] max-w-[240px] rounded-[28px] overflow-hidden border border-gray-100 bg-white card-shadow snap-start transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
                                                    className="w-full h-[130px] object-cover" />
                                                <div
                                                    className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <i className="fas fa-gift text-[9px]"></i> 1 Demo Free
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p
                                                        className="text-[11px] font-extrabold uppercase tracking-wide text-violet-600">
                                                        SSC</p>
                                                    <span
                                                        className="text-[10px] bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-semibold">Live</span>
                                                </div>
                                                <h3 className="font-bold text-[15px] leading-5 mb-2 text-gray-800">SSC CGL Titan
                                                    Test Series</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-400"><i className="far fa-file-alt"></i> 140+ Mocks
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400 line-through text-[11px]">₹899</span>
                                                        <h4 className="font-black text-lg text-violet-700">₹299</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 mb-3">
                                                    <i className="fas fa-flask text-amber-500 text-[10px]"></i>
                                                    <span className="text-[10px] font-medium text-amber-700">1 Free Demo Mock</span>
                                                </div>
                                                <button
                                                    className="w-full h-10 rounded-xl bg-violet-50 text-violet-700 text-sm font-bold transition hover:bg-violet-100 flex items-center justify-center gap-1"><i
                                                        className="fas fa-bolt"></i> Start Free Trial</button>
                                            </div>
                                        </div>

                                        {/* <!-- CARD 2 - HSSC --> */}
                                        <div
                                            className="min-w-[240px] max-w-[240px] rounded-[28px] overflow-hidden border border-gray-100 bg-white card-shadow snap-start transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop"
                                                    className="w-full h-[130px] object-cover" />
                                                <div
                                                    className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <i className="fas fa-gift text-[9px]"></i> 1 Demo Free
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p
                                                        className="text-[11px] font-extrabold uppercase tracking-wide text-green-600">
                                                        HSSC</p>
                                                    <span
                                                        className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Trending</span>
                                                </div>
                                                <h3 className="font-bold text-[15px] leading-5 mb-2 text-gray-800">Haryana CET Maha
                                                    Pack</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-400"><i className="far fa-file-alt"></i> 105
                                                        Practice Sets</p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400 line-through text-[11px]">₹599</span>
                                                        <h4 className="font-black text-lg text-green-700">₹199</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 mb-3">
                                                    <i className="fas fa-flask text-amber-500 text-[10px]"></i>
                                                    <span className="text-[10px] font-medium text-amber-700">1 Free Demo Mock</span>
                                                </div>
                                                <button
                                                    className="w-full h-10 rounded-xl bg-green-50 text-green-700 text-sm font-bold transition hover:bg-green-100 flex items-center justify-center gap-1"><i
                                                        className="fas fa-bolt"></i> Start Free Trial</button>
                                            </div>
                                        </div>

                                        {/* <!-- CARD 3 - HPSC --> */}
                                        <div
                                            className="min-w-[240px] max-w-[240px] rounded-[28px] overflow-hidden border border-gray-100 bg-white card-shadow snap-start transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                                                    className="w-full h-[130px] object-cover" />
                                                <div
                                                    className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <i className="fas fa-gift text-[9px]"></i> 1 Demo Free
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-red-600">
                                                        HPSC</p>
                                                    <span
                                                        className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">New</span>
                                                </div>
                                                <h3 className="font-bold text-[15px] leading-5 mb-2 text-gray-800">HPSC Judicial
                                                    Complete</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-400"><i className="far fa-file-alt"></i> 72 Full
                                                        Tests</p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400 line-through text-[11px]">₹1299</span>
                                                        <h4 className="font-black text-lg text-red-700">₹499</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 mb-3">
                                                    <i className="fas fa-flask text-amber-500 text-[10px]"></i>
                                                    <span className="text-[10px] font-medium text-amber-700">1 Free Demo Mock</span>
                                                </div>
                                                <button
                                                    className="w-full h-10 rounded-xl bg-red-50 text-red-700 text-sm font-bold transition hover:bg-red-100 flex items-center justify-center gap-1"><i
                                                        className="fas fa-bolt"></i> Start Free Trial</button>
                                            </div>
                                        </div>

                                        {/* <!-- CARD 4 - UPSC --> */}
                                        <div
                                            className="min-w-[240px] max-w-[240px] rounded-[28px] overflow-hidden border border-gray-100 bg-white card-shadow snap-start transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1200&auto=format&fit=crop"
                                                    className="w-full h-[130px] object-cover" />
                                                <div
                                                    className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <i className="fas fa-gift text-[9px]"></i> 1 Demo Free
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600">
                                                        UPSC</p>
                                                    <span
                                                        className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">Premium</span>
                                                </div>
                                                <h3 className="font-bold text-[15px] leading-5 mb-2 text-gray-800">UPSC Prelims Edge
                                                    2025</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-400"><i className="far fa-file-alt"></i> 180+ Tests
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400 line-through text-[11px]">₹2499</span>
                                                        <h4 className="font-black text-lg text-blue-700">₹899</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 mb-3">
                                                    <i className="fas fa-flask text-amber-500 text-[10px]"></i>
                                                    <span className="text-[10px] font-medium text-amber-700">1 Free Demo Mock</span>
                                                </div>
                                                <button
                                                    className="w-full h-10 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold transition hover:bg-blue-100 flex items-center justify-center gap-1"><i
                                                        className="fas fa-bolt"></i> Start Free Trial</button>
                                            </div>
                                        </div>

                                        {/* <!-- CARD 5 - Railway --> */}
                                        <div
                                            className="min-w-[240px] max-w-[240px] rounded-[28px] overflow-hidden border border-gray-100 bg-white card-shadow snap-start transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative">
                                                <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"
                                                    className="w-full h-[130px] object-cover" />
                                                <div
                                                    className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <i className="fas fa-gift text-[9px]"></i> 1 Demo Free
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p
                                                        className="text-[11px] font-extrabold uppercase tracking-wide text-orange-600">
                                                        Railway</p>
                                                    <span
                                                        className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">Hot</span>
                                                </div>
                                                <h3 className="font-bold text-[15px] leading-5 mb-2 text-gray-800">Railway Group D
                                                    Pro</h3>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-400"><i className="far fa-file-alt"></i> 110 Mocks
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-400 line-through text-[11px]">₹699</span>
                                                        <h4 className="font-black text-lg text-orange-700">₹249</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 mb-3">
                                                    <i className="fas fa-flask text-amber-500 text-[10px]"></i>
                                                    <span className="text-[10px] font-medium text-amber-700">1 Free Demo Mock</span>
                                                </div>
                                                <button
                                                    className="w-full h-10 rounded-xl bg-orange-50 text-orange-700 text-sm font-bold transition hover:bg-orange-100 flex items-center justify-center gap-1"><i
                                                        className="fas fa-bolt"></i> Start Free Trial</button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* <!-- STATE SECTION --> */}
                                    <div className="mt-10">

                                        {/* <!-- TOP --> */}
                                        <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-5">

                                            <div>
                                                <h2 className="text-2xl font-black dark-text flex items-center gap-2">
                                                    <i className="fas fa-map-marked-alt text-indigo-500 text-2xl"></i>
                                                    State Wise Exams
                                                </h2>
                                                <p className="text-sm text-gray-500 mt-1 dark-sub flex items-center gap-1">
                                                    <i className="fas fa-arrow-right text-xs"></i> Select your state & grab <span
                                                        className="font-bold text-amber-600">🔥 Buy 1 Get 1 Demo Free</span>
                                                </p>
                                            </div>

                                            {/* <!-- SELECT --> */}
                                            <select id="stateSelect"
                                                className="h-12 px-5 rounded-2xl border-2 border-gray-200 bg-white outline-none font-medium text-gray-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition">
                                                <option value="haryana">🇮🇳 Haryana (HSSC / CET)</option>
                                                <option value="up">🇮🇳 Uttar Pradesh (UPPSC / UPPCL)</option>
                                                <option value="rajasthan">🇮🇳 Rajasthan (RPSC / REET)</option>
                                                <option value="punjab">🇮🇳 Punjab (PPSC / PSSSB)</option>
                                            </select>

                                        </div>

                                        {/* <!-- GRID - State Data will be injected here --> */}
                                        <div id="stateData"
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 transition-all duration-300">

                                        </div>

                                    </div>

                                </div>


                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </>
    )
}