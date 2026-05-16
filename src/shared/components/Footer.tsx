'use client'



export default function Footer() {

    // const [open, setOpen] = useState(false)

    return (
        <>
            <footer className="mt-8 rounded-[8px] overflow-hidden relative" style={{ margin: "5px 12px" }}>

                {/* <!-- Main Footer - Purple Gradient Background --> */}
                <div
                    className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#3b1e6e] px-5 py-8 sm:px-6 md:px-8 lg:py-12">

                    {/* <!-- Decorative Blur Circles --> */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-[80px] opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-15"></div>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-10">
                    </div>

                    <div className="relative z-10">

                        {/* <!-- Top Section with Newsletter --> */}
                        <div
                            className="flex flex-col lg:flex-row justify-between items-center gap-6 pb-8 border-b border-purple-500/30">

                            {/* <!-- Left Side - Brand --> */}
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/30">
                                        🎓
                                    </div>
                                    <div>
                                        <span className="font-black text-2xl text-white tracking-tight">Exam<span
                                            className="text-purple-400">Mitra</span></span>
                                        <p className="text-xs text-purple-300/70">Empowering Dreams</p>
                                    </div>
                                </div>
                                <p className="text-sm text-purple-200/80 max-w-md mt-2">
                                    India's most trusted platform for competitive exam preparation. Join 2M+ successful
                                    students.
                                </p>
                            </div>

                            {/* <!-- Right Side - Newsletter Card --> */}
                            <div
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 w-full lg:w-auto shadow-xl">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-white font-bold text-sm">Subscribe to Newsletter</h4>
                                        <p className="text-xs text-purple-300">Get latest updates & offers</p>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <input type="email" placeholder="Your email address"
                                            className="flex-1 h-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 px-4 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                                        <button
                                            className="h-11 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition shadow-lg shadow-purple-500/30 whitespace-nowrap">
                                            Subscribe →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Links Grid --> */}
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 mt-10">

                            {/* <!-- Column 1 - Quick Links --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Company
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">About
                                        Us</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Careers</a>
                                    </li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Press</a>
                                    </li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Contact</a>
                                    </li>
                                </ul>
                            </div>

                            {/* <!-- Column 2 - Support --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Support
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Help
                                        Center</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Refund
                                        Policy</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Terms
                                        of Service</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Privacy
                                        Policy</a></li>
                                </ul>
                            </div>

                            {/* <!-- Column 3 - Exams --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Exams
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="TestMaster.html"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">SSC
                                        CGL</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">UPSC
                                        Prelims</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Railway
                                        NTPC</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Banking
                                        PO</a></li>
                                </ul>
                            </div>

                            {/* <!-- Column 4 - Resources --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Resources
                                </h3>
                                <ul className="space-y-2">
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Mock
                                        Tests</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Previous
                                        Papers</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Study
                                        Materials</a></li>
                                    <li><a href="#"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Video
                                        Lectures</a></li>
                                </ul>
                            </div>

                            {/* <!-- Column 5 - Contact & Social --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Connect
                                </h3>
                                <div className="flex gap-3 mb-4">
                                    <a href="#"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-purple-500 hover:scale-110 transition-all duration-300">
                                        <i className="fab fa-facebook-f text-sm"></i>
                                    </a>
                                    <a href="#"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-purple-500 hover:scale-110 transition-all duration-300">
                                        <i className="fab fa-twitter text-sm"></i>
                                    </a>
                                    <a href="#"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-purple-500 hover:scale-110 transition-all duration-300">
                                        <i className="fab fa-instagram text-sm"></i>
                                    </a>
                                    <a href="#"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-purple-500 hover:scale-110 transition-all duration-300">
                                        <i className="fab fa-youtube text-sm"></i>
                                    </a>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2 text-sm text-purple-200/70">
                                        <i className="fas fa-phone-alt text-purple-400 text-xs"></i>
                                        <span className="text-xs">+91 0168495093</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-purple-200/70">
                                        <i className="fas fa-envelope text-purple-400 text-xs"></i>
                                        <span className="text-xs">support@mentor.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-purple-200/70">
                                        <i className="fas fa-envelope text-purple-400 text-xs"></i>
                                        <span className="text-xs">Address Narwana</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Bottom Bar --> */}
                        <div className="mt-10 pt-6 border-t border-purple-500/20">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                <p className="text-xs text-purple-300/60">
                                    © 2025 Exam Mitra. All rights reserved. Made with ❤️ for students
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="text-xs text-purple-300/60 hover:text-purple-300 transition">Sitemap</a>
                                    <a href="#" className="text-xs text-purple-300/60 hover:text-purple-300 transition">Cookie
                                        Policy</a>
                                    <a href="#"
                                        className="text-xs text-purple-300/60 hover:text-purple-300 transition">Accessibility</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <!-- Glowing Top Border Animation --> */}
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent">
                </div>

            </footer>

        </>
    )
}