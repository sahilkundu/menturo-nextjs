'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

import Input from "../../../shared/components/Input"
import { useRouter } from 'next/navigation'

import {
    Chrome,
    MapPin
} from 'lucide-react'

import { useRegistrationStore } from '../../../shared/store/createAccountStore'
import LoginExtraFeatures from '../../../shared/components/LoginExtraFeatures'
import { useUserStore } from '../../../shared/store/user'
import { REGISTER } from '../../../../api'

// =========================
// VALIDATIONS
// =========================

const validateUsername = (username: string) => {

    if (!username || username.length < 6) {

        return {
            valid: false,
            message: "Username must be at least 6 characters long"
        }
    }

    if (!/^[a-z0-9_]+$/.test(username)) {

        return {
            valid: false,
            message:
                "Username must contain only lowercase letters, numbers and underscores"
        }
    }

    return {
        valid: true,
        message: ""
    }
}

const validateEmail = (email: string) => {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !emailRegex.test(email)) {

        return {
            valid: false,
            message: "Please enter a valid email address"
        }
    }

    return {
        valid: true,
        message: ""
    }
}

const validateMobile = (mobile: string) => {

    if (!mobile || !/^\d{10}$/.test(mobile)) {

        return {
            valid: false,
            message:
                "Mobile number must be exactly 10 digits"
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
        mobile === sequential
            .split('')
            .reverse()
            .join('')
    ) {

        return {
            valid: false,
            message:
                "Sequential numbers are not allowed"
        }
    }

    return {
        valid: true,
        message: ""
    }
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

    return {
        valid: true,
        message: ""
    }
}

// =========================
// API SIGNUP
// =========================

// async function apiSignup(userData: any) {

//     const response = await fetch(
//         // 'https://menturo-c-plus.onrender.com/signup',
//         'http://localhost:8080/signup',
//         {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//                 'Content-Type': 'application/json',
//             },

//             body: JSON.stringify({
//                 username: userData.username,
//                 email: userData.email,
//                 mobile: userData.mobile,
//                 state: userData.state,
//                 password: userData.password,
//             }),
//         }
//     )

//     const data = await response.json()

//     if (!response.ok) {

//         // if (data.message?.includes('username')) {

//         //     return {
//         //         success: false,
//         //         message: "Username already taken"
//         //     }
//         // }

//         // if (data.message?.includes('email')) {

//         //     return {
//         //         success: data.success,
//         //         message: "Email already registered"
//         //     }
//         // }

//         // if (data.message?.includes('mobile')) {

//         //     return {
//         //         success: false,
//         //         message: "Mobile number already exists"
//         //     }
//         // }

//         return {
//             success: data.success,
//             message:
//                 data.message || "Registration failed"
//         }
//     }

//     return {
//         success: data.success,
//         message: data.message
//     }
// }

// =========================
// COMPONENT
// =========================

export default function Register() {

    const {
        regForm,
        isLoading,

        setRegField,
        setLoading,
        resetRegForm

    } = useRegistrationStore()
    const router = useRouter()

    const {
        authenticated,
        loading,
        fetchUser,
        setUser
    } = useUserStore()

    // =========================
    // Auto Auth Check
    // =========================
    // =========================
    // Signup API
    // =========================

    async function apiSignup(
        userData: any
    ) {

        const response = await fetch(
            REGISTER,
            {
                method: 'POST',

                credentials: 'include',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    mobile: userData.mobile,
                    state: userData.state,
                    password: userData.password,
                }),
            }
        )

        const data =
            await response.json()

        // =========================
        // Error
        // =========================

        if (!response.ok) {

            return {
                success: data.success,
                message:
                    data.message ||
                    "Registration failed"
            }
        }

        // =========================
        // Fetch User From Cookie
        // =========================

        // useUserStore.setState({
        //     user: data.user,
        //     authenticated: true,
        //     loading: false,
        // })
        useUserStore
            .getState()
            .setUser(data.user)
        // wait 2 sec
        setTimeout(() => {

            router.replace("/")

        }, 2000)

        // =========================
        // Redirect Home
        // =========================

        router.replace("/")

        return {
            success: true,
            message: data.message
        }
    }
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
    // PARTICLES
    // =========================

    useEffect(() => {

        if (typeof window !== 'undefined') {

            const script =
                document.createElement('script')

            script.src =
                'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'

            script.onload = () => {

                if (window.particlesJS) {

                    window.particlesJS(
                        "particles-js",
                        {
                            particles: {
                                number: {
                                    value: 70
                                },

                                color: {
                                    value: "#ffffff"
                                },

                                opacity: {
                                    value: 0.18
                                },

                                size: {
                                    value: 3
                                },

                                line_linked: {
                                    enable: true,
                                    distance: 140,
                                    color: "#ffffff",
                                    opacity: 0.15,
                                    width: 1
                                },

                                move: {
                                    enable: true,
                                    speed: 2
                                }
                            }
                        }
                    )
                }
            }

            document.head.appendChild(script)
        }

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
                confirmButtonColor: '#2563eb'
            })

        } else {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#ef4444'
            })
        }
    }

    // =========================
    // GOOGLE AUTH
    // =========================

    const handleGoogleAuth = () => {

        Swal.fire({
            title: `Google Sign Up`,
            text: "Redirecting...",
            timer: 1500,
            showConfirmButton: false
        })
    }

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

            showPopupMessage(
                usernameValidation.message
            )

            return
        }

        const emailValidation =
            validateEmail(regForm.email)

        if (!emailValidation.valid) {

            showPopupMessage(
                emailValidation.message
            )

            return
        }

        const mobileValidation =
            validateMobile(regForm.mobile)

        if (!mobileValidation.valid) {

            showPopupMessage(
                mobileValidation.message
            )

            return
        }

        const passwordValidation =
            validatePassword(regForm.password)

        if (!passwordValidation.valid) {

            showPopupMessage(
                passwordValidation.message
            )

            return
        }

        if (
            regForm.password !==
            regForm.confirmPassword
        ) {

            showPopupMessage(
                "Passwords do not match"
            )

            return
        }

        if (!regForm.state) {

            showPopupMessage(
                "Please select state"
            )

            return
        }

        setLoading(true)

        try {

            const response =
                await apiSignup({
                    username: regForm.username,
                    email: regForm.email,
                    mobile: regForm.mobile,
                    state: regForm.state,
                    password: regForm.password
                })

            if (response.success) {

                showPopupMessage(
                    response.message,
                    true
                )

                resetRegForm()

            } else {

                showPopupMessage(
                    response.message
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

        <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative">

            {/* PARTICLES */}

            <div
                id="particles-js"
                className="fixed inset-0 z-0"
            />

            {/* WRAPPER */}

            <div
                className="
                relative
                z-10
                w-full
                min-h-screen

                flex
                justify-center
                items-center

                px-4
                sm:px-6
                lg:px-8
                py-8
                sm:py-10
            "
            >

                {/* CARD */}

                <div
                    className="
                    w-full
                    max-w-[1000px]
                    
                    bg-white

                    shadow-[0_25px_70px_rgba(0,0,0,0.40)]

                    flex
                    flex-col
                    md:flex-row

                    rounded-none
                    sm:rounded-2xl
                    lg:rounded-[28px]

                    overflow-hidden
                    
                    max-h-[90vh]
                    md:max-h-[85vh]
                    overflow-y-auto
                "
                >

                    {/* LEFT SIDE */}

                    <div
                        className="
                        hidden
                        md:flex

                        md:w-1/2

                        md:min-h-full
                        md:sticky
                        md:top-0

                        bg-gradient-to-br
                        from-[#6a11cb]
                        via-[#5b2be0]
                        to-[#3f51f5]

                        relative

                        items-center
                        justify-center

                        px-10
                        py-12
                    "
                    >

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />

                        <div className="relative z-10 text-center">

                            <h2 className="text-white text-[32px] font-bold mb-4">
                                Ready to Achieve?
                            </h2>

                            <p className="text-white/90 text-[15px] leading-7 max-w-[320px] mx-auto mb-8">
                                Login to continue your success journey
                                with HSSC, HPSC, SSC & top exams.
                            </p>

                            <Link href="/login">

                                <button
                                    className="
                                    border
                                    border-white

                                    text-white

                                    rounded-full

                                    px-8
                                    py-2.5

                                    text-sm
                                    font-semibold

                                    transition-all
                                    duration-300

                                    hover:bg-white
                                    hover:text-[#5b2be0]
                                "
                                >
                                    Sign In
                                </button>

                            </Link>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div
                        className="
                        w-full
                        md:w-1/2

                        bg-[#f7f7f7]
                    "
                    >

                        <div
                            className="
                            w-full

                            flex
                            items-center
                            justify-center

                            px-5
                            sm:px-8

                            py-8
                            sm:py-10
                        "
                        >

                            <form
                                onSubmit={handleRegister}
                                className="w-full max-w-[390px]"
                            >

                                {/* TITLE */}

                                <h1 className="text-[34px] font-bold text-center text-[#424750] mb-8">
                                    Create Account
                                </h1>

                                {/* FORM */}

                                <div className="space-y-3">

                                    {/* ROW 1 */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <Input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={regForm.username}
                                            onChange={(e) =>
                                                setRegField(
                                                    'username',
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={regForm.email}
                                            onChange={(e) =>
                                                setRegField(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    {/* ROW 2 */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <Input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Mobile Number"
                                            value={regForm.mobile}
                                            onChange={(e) =>
                                                setRegField(
                                                    'mobile',
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <select
                                            value={regForm.state}
                                            onChange={(e) =>
                                                setRegField(
                                                    'state',
                                                    e.target.value
                                                )
                                            }
                                            className="
                                            w-full
                                            h-[44px]

                                            bg-[#f8fafc]

                                            border
                                            border-[#dbe2ea]

                                            rounded-2xl

                                            px-4

                                            text-sm
                                            text-[#444]

                                            outline-none

                                            transition-all
                                            duration-300

                                            focus:border-[#6a11cb]
                                            focus:bg-white
                                            focus:shadow-[0_0_0_3px_rgba(106,17,203,0.08)]
                                        "
                                        >

                                            {states.map((state) => (

                                                <option
                                                    key={state.value}
                                                    value={state.value}
                                                >
                                                    {state.label}
                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                    {/* PASSWORD */}

                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={regForm.password}
                                        onChange={(e) =>
                                            setRegField(
                                                'password',
                                                e.target.value
                                            )
                                        }
                                    />

                                    {/* CONFIRM PASSWORD */}

                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={regForm.confirmPassword}
                                        onChange={(e) =>
                                            setRegField(
                                                'confirmPassword',
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* BUTTON */}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                    mt-7
                                    w-full
                                    h-[46px]

                                    rounded-full

                                    bg-gradient-to-r
                                    from-[#6a11cb]
                                    to-[#2575fc]

                                    text-white
                                    text-[14px]
                                    font-semibold

                                    shadow-lg

                                    hover:scale-[1.01]

                                    transition-all
                                    duration-300
                                "
                                >

                                    {isLoading
                                        ? "Creating Account..."
                                        : "SIGN UP 🚀"}

                                </button>

                                {/* LOGIN */}

                                <div className="flex items-center justify-center gap-2 mt-4">

                                    <p className="text-[13px] text-[#666]">
                                        Already have an account?
                                    </p>

                                    <Link href="/login">

                                        <button
                                            type="button"
                                            className="text-[13px] font-semibold text-[#6a11cb]"
                                        >
                                            Sign In
                                        </button>

                                    </Link>

                                </div>

                                {/* EXTRA FEATURES */}

                                <div className="mt-5">

                                    <LoginExtraFeatures />

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}