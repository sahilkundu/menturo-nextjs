'use client'
import Header from "./Header"
import TestCard from "./TestCard"
import StateCard from "./StateCard"
import Footer from "./Footer"



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
                                <Header />
                            </div>

                            {/* <!-- COURSE SECTION --> */}
                            <div className="mt-5 bg-white dark-card rounded-[30px] p-5 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden">

                                {/* <!-- TOP --> */}
                                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-5">

                                    <div>

                                        <h2 className="text-2xl font-bold text-dark">
                                            Course Manager
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1 text-slate-500">
                                            Manage all educational courses.
                                        </p>

                                    </div>

                                    <div className="flex gap-3 flex-wrap">

                                        <button className="h-10 px-4 rounded-xl border text-sm border-gray-200">
                                            Import
                                        </button>



                                        <button className="h-10 px-5 rounded-xl bg-violet-600 text-white text-sm border-gray-200">
                                            Categories
                                        </button>

                                    </div>

                                </div>

                                {/* <!-- FILTER --> */}
                                <div className="flex flex-col lg:flex-row gap-3 mb-5">

                                    <div className="relative flex-1">

                                        <input type="text" placeholder="Search course..."
                                            className="w-full h-11 rounded-xl border bg-gray-50 pl-11 pr-4 text-sm outline-none border-gray-200" />

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔍
                                        </span>

                                    </div>

                                    <select className="h-11 px-4 rounded-xl border text-sm ![background:#e5e5e5] ![border-color:#d4d4d4] !text-black">
                                        <option>All Courses</option>
                                    </select>

                                    <select className="h-11 px-4 rounded-xl border text-sm ![background:#e5e5e5] ![border-color:#d4d4d4] !text-black">
                                        <option>All Categories</option>
                                    </select>

                                </div>

                                {/* <!-- SLIDER TOP --> */}
                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="font-semibold dark-text">
                                        Popular Courses
                                    </h3>

                                    <div className="flex gap-2">

                                        <button id="prevBtn" className="w-9 h-9 rounded-xl border border-gray-200">
                                            ‹
                                        </button>

                                        <button id="nextBtn" className="w-9 h-9 rounded-xl border border-gray-200">
                                            ›
                                        </button>

                                    </div>

                                </div>

                                {/* <!-- SLIDER --> */}
                                {/* <!-- SECTION --> */}
                                <div className="mt-5 bg-white dark-card rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,.05)] overflow-hidden">

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
                                        <TestCard
                                            board="SSC"
                                            liveName="Live"
                                            name="SSC CGL Titan Test Series"
                                            totalTest="140+ Mocks"
                                            totalPrice="₹899"
                                            offerPrice="₹299"
                                            demoInfo="1 Free Demo Mock"
                                            demoHead="1 Demo Free"
                                            btnName="Start Free Trial"
                                            img="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
                                            btnBgColor="bg-violet-50 hover:bg-violet-100"
                                            btnTxtColor="text-violet-700"
                                        />
                                        <TestCard
                                            board="HSSC"
                                            liveName="Trending"
                                            name="Haryana CET Maha Pack"
                                            totalTest="105 Practice Sets"
                                            totalPrice="₹599"
                                            offerPrice="₹199"
                                            demoInfo="1 Free Demo Mock"
                                            demoHead="1 Demo Free"
                                            btnName="Enroll Now"
                                            img="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop"
                                            btnBgColor="bg-green-50 hover:bg-green-100"
                                            btnTxtColor="text-green-700"
                                        />



                                    </div>
                                    <StateCard
                                        states={[
                                            {
                                                stateName: "🇮🇳 Haryana (HSSC / CET)",
                                                value: "haryana",

                                                exams: [

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-green-100",
                                                        statusText: "text-green-700",

                                                        title: "HSSC CET Group C",

                                                        posts: "32,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-blue-100",
                                                        statusText: "text-blue-700",

                                                        title: "Haryana Police",

                                                        posts: "6,000",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    },

                                                    {
                                                        status: "Active",
                                                        statusBg: "bg-red-100",
                                                        statusText: "text-red-600",

                                                        title: "HPSC Assistant Professor",

                                                        posts: "2,400",

                                                        btnText: "Apply Now",

                                                        btnBg: "bg-gradient-to-r from-violet-600 to-purple-500",
                                                        btnHover: "hover:opacity-90",

                                                        dotColor: "bg-green-400"
                                                    }

                                                ]
                                            }
                                        ]}
                                    />


                                </div>


                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </>
    )
}