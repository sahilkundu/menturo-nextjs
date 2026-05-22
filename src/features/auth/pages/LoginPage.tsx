'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"
import Input from "../../../shared/components/Input"
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react'

import { useRegistrationStore } from '../../../shared/store/createAccountStore'
import LoginExtraFeatures from '../../../shared/components/LoginExtraFeatures'
import { useUserStore } from '../../../shared/store/user'
import { LOGIN } from '../../../../api'

// =========================
// VALIDATIONS
// =========================

const validateUsername = (username: string) => {
    if (!username || username.length < 6) {
        return { valid: false, message: "Username must be at least 6 characters long" }
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
        return {
            valid: false,
            message: "Username must contain only lowercase letters, numbers and underscores"
        }
    }

    return { valid: true, message: "" }
}

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !emailRegex.test(email)) {
        return {
            valid: false,
            message: "Please enter a valid email address"
        }
    }

    return { valid: true, message: "" }
}

const validateMobile = (mobile: string) => {

    if (!mobile || !/^\d{10}$/.test(mobile)) {
        return {
            valid: false,
            message: "Mobile number must be exactly 10 digits"
        }
    }

    if (/^(\d)\1{9}$/.test(mobile)) {
        return {
            valid: false,
            message: "Repeated digits are not allowed"
        }
    }

    const sequential = "1234567890"

    if (
        mobile === sequential ||
        mobile === sequential.split('').reverse().join('')
    ) {
        return {
            valid: false,
            message: "Sequential numbers are not allowed"
        }
    }

    return { valid: true, message: "" }
}

const validatePassword = (password: string) => {

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

    if (!password || !passwordRegex.test(password)) {
        return {
            valid: false,
            message:
                "Password must contain uppercase, lowercase, digit and special character"
        }
    }

    return { valid: true, message: "" }
}

// =========================
// API SIGNUP
// =========================






// =========================
// LOGIN MOCK
// =========================



// =========================
// COMPONENT
// =========================

export default function Login() {

    // const [isRightPanelActive, setIsRightPanelActive] = useState(false)

    const {
        regForm,
        loginForm,
        isLoading,

        setRegField,
        setLoginField,

        setLoading,

        resetRegForm,
        resetLoginForm
    } = useRegistrationStore()

    // =========================
    // PARTICLES
    // =========================

    useEffect(() => {

        if (typeof window !== 'undefined') {

            const script = document.createElement('script')

            script.src =
                'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'

            script.onload = () => {

                if (window.particlesJS) {

                    window.particlesJS("particles-js", {
                        particles: {
                            number: { value: 70 },
                            color: { value: "#ffffff" },
                            opacity: { value: 0.25 },
                            size: { value: 3 },

                            line_linked: {
                                enable: true,
                                distance: 150,
                                color: "#ffffff",
                                opacity: 0.2,
                                width: 1
                            },

                            move: {
                                enable: true,
                                speed: 2
                            }
                        }
                    })
                }
            }

            document.head.appendChild(script)
        }

    }, [])
    const router = useRouter()

    const {
        fetchUser,
        authenticated,
        loading,
    } = useUserStore()

    async function apiLogin(
        mobile: string,
        password: string
    ) {

        // =========================
        // MOBILE VALIDATION
        // =========================

        if (
            !mobile ||
            !/^\d{10}$/.test(mobile)
        ) {
            return {
                success: false,
                message:
                    "Mobile number must be exactly 10 digits"
            }
        }

        // =========================
        // PASSWORD VALIDATION
        // =========================

        if (!password || password.length < 6) {

            return {
                success: false,
                message:
                    "Password must be at least 6 characters"
            }
        }

        // =========================
        // API CALL
        // =========================

        try {

            const response = await fetch(
                LOGIN,
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        mobile,
                        password,
                    }),
                }
            )

            const data =
                await response.json()

            // =========================
            // SUCCESS
            // =========================

            if (
                response.ok &&
                data.success
            ) {

                useUserStore
                    .getState()
                    .setUser(data.user)

                setTimeout(() => {

                    router.replace(
                        decodeURIComponent(
                            data.redirect || "/"
                        )
                    )

                }, 2000)
            }

            return data

        } catch {

            return {
                success: false,
                message: "Network error"
            }
        }
    }
    // =========================
    // Check Auth
    // =========================

    useEffect(() => {

        const checkAuth = async () => {

            await fetchUser()

            const {
                authenticated
            } = useUserStore.getState()

            if (authenticated) {

                router.replace("/")
            }
        }

        checkAuth()

    }, [])

    // =========================
    // ALERT
    // =========================

    const showPopupMessage = (
        message: string,
        isSuccess: boolean = false
    ) => {

        if (isSuccess) {

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: message,
                confirmButtonColor: '#2575fc'
            })

        } else {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#d33'
            })
        }
    }

    // =========================
    // GOOGLE AUTH
    // =========================


    // =========================
    // REGISTER
    // =========================

    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        const usernameValidation =
            validateUsername(regForm.username)

        if (!usernameValidation.valid) {
            showPopupMessage(usernameValidation.message)
            return
        }

        const emailValidation =
            validateEmail(regForm.email)

        if (!emailValidation.valid) {
            showPopupMessage(emailValidation.message)
            return
        }

        const mobileValidation =
            validateMobile(regForm.mobile)

        if (!mobileValidation.valid) {
            showPopupMessage(mobileValidation.message)
            return
        }

        const passwordValidation =
            validatePassword(regForm.password)

        if (!passwordValidation.valid) {
            showPopupMessage(passwordValidation.message)
            return
        }

        if (regForm.password !== regForm.confirmPassword) {
            showPopupMessage("Passwords do not match")
            return
        }

        if (!regForm.state) {
            showPopupMessage("Please select state")
            return
        }

        setLoading(true)

        try {

            const response = await apiSignup({
                username: regForm.username,
                email: regForm.email,
                mobile: regForm.mobile,
                state: regForm.state,
                password: regForm.password
            })

            if (response.success) {

                showPopupMessage(response.message, true)

                resetRegForm()

                // setIsRightPanelActive(false)

            } else {

                showPopupMessage(response.message)
            }

        } catch {

            showPopupMessage("Network error")

        } finally {

            setLoading(false)
        }
    }

    // =========================
    // LOGIN
    // =========================


    const handleLogin = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        setLoading(true)

        try {

            const response =
                await apiLogin(
                    loginForm.mobile,
                    loginForm.password
                )

            if (response.success) {

                // fetch latest user data
                // await fetchUser()

                // reset form
                // resetLoginForm()

                // success popup
                showPopupMessage(
                    "Login successful!",
                    true
                )

                // redirect
                // router.push("/")

            } else {

                showPopupMessage(
                    response.message ||
                    "Login failed"
                )
            }

        } catch {

            showPopupMessage(
                "Network error"
            )

        } finally {

            setLoading(false)
        }
    }

    // =========================
    // STATES
    // =========================

    const states = [
        { value: "", label: "Select State" },
        { value: "haryana", label: "Haryana" },
        { value: "delhi", label: "Delhi" },
        { value: "up", label: "Uttar Pradesh" },
        { value: "bihar", label: "Bihar" },
        { value: "rajasthan", label: "Rajasthan" }
    ]

    return (

        <div className="min-h-screen flex items-center justify-center p-5 relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-x-hidden">

            {/* PARTICLES */}

            <div
                id="particles-js"
                className="fixed w-full h-full top-0 left-0 z-0"
            />

            {/* CONTAINER */}

            <div
                className={`relative bg-white rounded-[30px] shadow-2xl w-[965px] max-w-[95%] min-h-[554px] overflow-hidden z-10 transition-all duration-500 ease-in-out`}
            >

                {/* SIGN IN */}

                <div className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out w-full md:w-1/2 z-[2]
                
                        opacity-100 translate-x-0
                    }`}>

                    <form
                        onSubmit={handleLogin}
                        className="bg-white flex items-center justify-center flex-col px-6 sm:px-10 h-full text-center"
                    >

                        <h1 className="font-bold mb-2 text-[#494d55] text-3xl">
                            Welcome Back
                        </h1>



                        <Input
                            type="tel"
                            name="Mobile"
                            placeholder="Mobile Number"
                            value={loginForm.mobile}
                            onChange={(e) =>
                                setLoginField('mobile', e.target.value)
                            }
                        // icon={Mail}
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginForm.password}
                            onChange={(e) =>
                                setLoginField('password', e.target.value)
                            }
                        // icon={Lock}
                        />



                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-full border-none bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-semibold py-3 px-9 uppercase mt-2 w-full"
                        >

                            {isLoading
                                ? "Signing in..."
                                : "Sign In ✨"}

                        </button>

                        <div className="flex items-center justify-center gap-2 mt-2">


                            <p className="text-[13px] text-[#666]">
                                Don't have an account?
                            </p>
                            <Link href="/register">

                                <button
                                    type="button"
                                    className="lg:hidden text-[13px] font-semibold text-[#6a11cb] cursor-pointer"
                                >
                                    Create Account
                                </button>

                            </Link>

                        </div>
                        <Link href="/forgot-password">

                            <button
                                type="button"
                                className="text-[13px] font-semibold text-[#6a11cb] cursor-pointer"
                            >
                                Forgot Password?
                            </button>

                        </Link>

                        <LoginExtraFeatures />
                    </form>

                </div>

                {/* SIGN UP */}



                {/* OVERLAY */}

                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-[100] hidden md:block
                }`}>

                    <div className={`bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white relative -left-full h-full w-[200%] transition-transform duration-500 ease-in-out 
                    translate-x-0}`}>

                        {/* LEFT PANEL */}

                        <div className={`absolute left-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out 
                        -translate-x-[20%]
                            } rounded-r-[150px]`}>

                            <h2 className="font-bold mb-2.5 text-white text-3xl">
                                Ready to Achieve?
                            </h2>

                            <p className="text-white/90 text-sm mb-4">
                                Login to continue your success journey.
                            </p>

                            {/* <button
                                onClick={() =>
                                    setIsRightPanelActive(false)
                                }
                                className="bg-transparent border-2 border-white rounded-full px-8 py-2.5 text-white font-semibold"
                            >
                                Sign In
                            </button> */}

                        </div>

                        {/* RIGHT PANEL */}

                        <div className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out 
                        translate-x-0
                            } rounded-l-[150px]`}>

                            <div className="relative w-[260px] h-[260px] flex justify-center items-center mb-5">

                                <div className="text-[85px] animate-[walking_1.6s_infinite] z-10 drop-shadow-lg">
                                    🧑‍🎓📚
                                </div>

                                {[
                                    'HSSC',
                                    'HPSC',
                                    'SSC',
                                    'UPSC',
                                    'BPSC',
                                    'RPSC',
                                    'MPPSC',
                                    'UKPSC'
                                ].map((exam, idx) => (

                                    <div
                                        key={idx}
                                        className="absolute w-[70px] h-[70px] bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-extrabold shadow-xl border-2 border-white/90 animate-[orbit_12s_linear_infinite]"
                                        style={{
                                            background: [
                                                'linear-gradient(135deg, #FF6B35, #FFA447)',
                                                'linear-gradient(135deg, #1E90FF, #00B4DB)',
                                                'linear-gradient(135deg, #3CCF4E, #0F9D58)',
                                                'linear-gradient(135deg, #FF4D6D, #C9184A)',
                                                'linear-gradient(135deg, #9C27B0, #E040FB)',
                                                'linear-gradient(135deg, #F4A300, #FF6F00)',
                                                'linear-gradient(135deg, #00ACC1, #26C6DA)',
                                                'linear-gradient(135deg, #8D6E63, #D7CCC8)'
                                            ][idx],

                                            animationDelay: `${idx * -1.5}s`
                                        }}
                                    >

                                        {exam}

                                    </div>
                                ))}

                            </div>

                            <h1 className="font-bold mb-2 text-white text-3xl">
                                Hello, Aspirant!
                            </h1>

                            <p className="text-white/90 text-sm mb-4">
                                Join India's finest exam preparation community
                            </p>
                            <Link href="/register">
                                <button
                                    className="bg-transparent border-2 border-white rounded-full px-8 py-2.5 text-white font-semibold"
                                >
                                    Sign Up
                                </button>
                            </Link>
                        </div>

                    </div>

                </div>

            </div>

            <style jsx global>{`

                @keyframes walking {

                    0%, 100% {
                        transform: translateY(0) rotate(-2deg);
                    }

                    50% {
                        transform: translateY(-12px) rotate(3deg);
                    }
                }

                @keyframes orbit {

                    0% {
                        transform: rotate(0deg)
                        translateX(130px)
                        rotate(0deg);

                        opacity: 1;
                    }

                    50% {
                        opacity: 0.5;
                    }

                    100% {
                        transform: rotate(360deg)
                        translateX(130px)
                        rotate(-360deg);

                        opacity: 1;
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(#6a11cb, #2575fc);
                    border-radius: 10px;
                }

            `}</style>

        </div>
    )
}