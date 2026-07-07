'use client'

import Image from "next/image"
import Link from "next/link"
import {
    WHATSAPP_GROUP_URL,
    WhatsAppIcon
} from "./WhatsAppJoinButton"


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
                                        className="
        w-15
        h-12
        rounded-2xl
        overflow-hidden
        shadow-lg
        shadow-purple-500/30
        shrink-0
        flex
        items-center
        justify-center
        p-1
    "
                                    >
                                        <Image
                                            src="https://cdn.menturo.in/img/M3.png"
                                            alt="logo"
                                            width={48}
                                            height={48}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-black text-2xl text-white tracking-tight">Menturo</span>
                                        <p className="text-xs text-purple-300/70">Empowering Dreams</p>
                                    </div>
                                </div>
                                <p className="text-sm text-purple-200/80 max-w-md mt-2">
                                    India's most trusted platform for competitive exam preparation.
                                </p>
                            </div>

                            {/* <!-- Right Side - Newsletter Card --> */}

                        </div>

                        {/* <!-- Links Grid --> */}
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3 mt-10">

                            {/* <!-- Column 1 - Quick Links --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Company
                                </h3>
                                <ul className="space-y-2">
                                    <li><Link href="/about"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">About
                                        Us</Link></li>
                                    <li><Link href="/"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Test Series</Link>
                                    </li>
                                    <li><Link href="/contact"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Contact</Link>
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
                                    <li>
                                        <Link
                                            href="/cancellation-and-refund"
                                            className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block"
                                        >
                                            Refund Policy
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/terms-and-conditions"
                                            className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block"
                                        >
                                            Terms of Service
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/privacy-policy"
                                            className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* <!-- Column 3 - Resources --> */}
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-400 rounded-full"></span>
                                    Resources
                                </h3>
                                <ul className="space-y-2">
                                    <li><Link href="/typingPro"
                                        className="text-sm text-purple-200/70 hover:text-white hover:translate-x-1 transition-all inline-block">Typing
                                        Practice</Link></li>
                                    <li>
                                        <a
                                            href={WHATSAPP_GROUP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-purple-200/70 transition-all hover:translate-x-1 hover:text-white"
                                        >
                                            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                                            WhatsApp Group
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* <!-- Column 5 - Contact & Social --> */}
                            {/* <div className="text-left">
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
                                        <span className="text-xs">support@menturo.in</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-purple-200/70">
                                        <i className="fas fa-envelope text-purple-400 text-xs"></i>
                                        <span className="text-xs">Address Narwana</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* <!-- Bottom Bar --> */}
                        <div className="mt-10 pt-6 border-t border-purple-500/20">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                <p className="text-xs text-purple-300/60">
                                    © 2026 Menturo. All rights reserved. Made with ❤️ for students
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href="/sitemap.xml" className="text-xs text-purple-300/60 hover:text-purple-300 transition">Sitemap</Link>
                                    <a
                                        href={WHATSAPP_GROUP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-purple-300/60 transition hover:text-purple-300"
                                    >
                                        <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                                        WhatsApp
                                    </a>
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
