'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    Fingerprint,
} from 'lucide-react'

import { useUserStore } from '../../../shared/store/user'
import { REGISTER, RESEND_REGISTER_OTP, VERIFY_REGISTER_OTP } from '../../../../api'
import LoginExtraFeatures from '../../../shared/components/LoginExtraFeatures'
import Spinner from '../../../shared/components/Spinner'

export default function Register() {
    const router = useRouter()
    const [emailOtpRequired, setEmailOtpRequired] = useState(false);
    const [mobileOtpRequired, setMobileOtpRequired] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const otpRequired =
        emailOtpRequired ||
        mobileOtpRequired;

    const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
    const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""]);

    const [emailTimer, setEmailTimer] = useState(60);
    const [mobileTimer, setMobileTimer] = useState(60);
    const [otpLength, setOtpLength] = useState(6);
    const [otpLoading, setOtpLoading] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [recipientMobile, setRecipientMobile] = useState("");
    const [showPassword, setShowPassword] =
        useState(false)
    const [stateOpen, setStateOpen] =
        useState(false)
    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false)

    const [loading, setLoading] =
        useState(false)

    const [message, setMessage] =
        useState('')

    const [error, setError] =
        useState('')

    const [form, setForm] = useState({
        username: '',
        email: '',
        mobile: '',
        state: '',
        password: '',
        confirmPassword: '',
    })

    const states = [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Andaman and Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi',
        'Jammu and Kashmir',
        'Ladakh',
        'Lakshadweep',
        'Puducherry',
    ]

    const validateUsername = (
        username: string
    ) => {
        if (!username || username.length < 6) {
            return {
                valid: false,
                message:
                    'Username must be at least 6 characters long',
            }
        }

        if (
            !/^[a-z0-9_]+$/.test(username)
        ) {
            return {
                valid: false,
                message:
                    'Username must contain only lowercase letters, numbers and underscores',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }
    const validateEmail = (email: string) => {

        const emailRegex =
            /^[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/

        if (!email || !emailRegex.test(email)) {
            return {
                valid: false,
                message: 'Please enter a valid email address',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    const validateMobile = (
        mobile: string
    ) => {
        if (
            !mobile ||
            !/^\d{10}$/.test(mobile)
        ) {
            return {
                valid: false,
                message:
                    'Mobile number must be exactly 10 digits',
            }
        }

        if (
            /^(\d)\1{9}$/.test(mobile)
        ) {
            return {
                valid: false,
                message:
                    'Repeated digits are not allowed',
            }
        }

        const sequential =
            '1234567890'

        if (
            mobile === sequential ||
            mobile ===
            sequential
                .split('')
                .reverse()
                .join('')
        ) {
            return {
                valid: false,
                message:
                    'Sequential numbers are not allowed',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    const validatePassword = (
        password: string
    ) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

        if (
            !password ||
            !passwordRegex.test(password)
        ) {
            return {
                valid: false,
                message:
                    'Password must contain uppercase, lowercase, digit and special character',
            }
        }

        return {
            valid: true,
            message: '',
        }
    }

    async function apiSignup(
        userData: typeof form
    ) {
        if (!acceptedTerms) {
            setError(
                "You must accept the Terms & Conditions, Privacy Policy and Cancellation & Refund Policy."
            );
            return;
        }
        const response = await fetch(
            REGISTER,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':
                        'application/json',
                },
                body: JSON.stringify({
                    username:
                        userData.username,
                    email: userData.email,
                    mobile:
                        userData.mobile,
                    state: userData.state,
                    password:
                        userData.password,
                    acceptedTerms: true
                }),
            }
        )

        const data =
            await response.json()

        if (!response.ok) {
            return {
                success:
                    data.success,
                message:
                    data.message ||
                    'Registration failed',
            }
        }
        if (
            data?.emailOtpRequired ||
            data?.mobileOtpRequired
        ) {
            setEmailOtpRequired(
                !!data?.emailOtpRequired
            );

            setMobileOtpRequired(
                !!data?.mobileOtpRequired
            );

            setOtpLength(
                data?.len || 6
            );

            if (data?.emailOtpRequired) {
                setEmailOtp(
                    Array(data?.len || 6).fill("")
                );

                setRecipientEmail(
                    data?.recipientEmail || ""
                );
            }

            if (data?.mobileOtpRequired) {
                setMobileOtp(
                    Array(data?.len || 6).fill("")
                );

                setRecipientMobile(
                    data?.recipientMobile || ""
                );
            }

            return;
        }
        useUserStore
            .getState()
            .setUser(data.user)

        setTimeout(() => {
            router.replace(
                decodeURIComponent(
                    data.redirect || '/'
                )
            )
        }, 2000)

        return {
            success: true,
            message: data.message,
        }
    }
    async function verifyOTP(
    ) {
        setError("");
        setMessage("");
        if (
            emailOtpRequired &&
            emailOtp.some(v => v === "")
        ) {
            setError("Please enter email OTP");
            return;
        }

        if (
            mobileOtpRequired &&
            mobileOtp.some(v => v === "")
        ) {
            setError("Please enter mobile OTP");
            return;
        }
        try {
            setOtpLoading(true);
            const response = await fetch(
                VERIFY_REGISTER_OTP,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        emailOtp:
                            emailOtp.join(""),
                        mobileOtp:
                            mobileOtp.join("")
                    }),
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                setError(
                    data.message ||
                    "OTP verification failed"
                );
                return {
                    success:
                        data.success,
                    message:
                        data.message ||
                        'Registration failed',
                }
            }
            setMessage(
                data.message ||
                "Verification successful"
            );
            // if (response?.data?.otpRequired) {
            //     setOtpRequired(true);

            //     setOtpLength(response?.data?.len || 6);

            //     setRecipientEmail(
            //         response?.data?.recipientEmail || ""
            //     );

            //     setRecipientMobile(
            //         response?.data?.recipientMobile || ""
            //     );

            //     return;
            // }
            useUserStore
                .getState()
                .setUser(data.user)

            setTimeout(() => {
                router.replace(
                    decodeURIComponent(
                        data.redirect || '/'
                    )
                )
            }, 2000)

            return {
                success: true,
                message: data.message,
            }
        } finally {
            setOtpLoading(false);
        }
    }
    const handleChange = (
        e: React.ChangeEvent<
            | HTMLInputElement
            | HTMLSelectElement
        >
    ) => {
        let value = e.target.value

        if (
            e.target.name === 'mobile'
        ) {
            value = value.replace(
                /\D/g,
                ''
            )
        }

        setForm((prev) => ({
            ...prev,
            [e.target.name]: value,
        }))
    }
    const handleEmailOtpChange = (
        index: number,
        value: string
    ) => {

        if (!/^\d?$/.test(value)) return;

        const updated = [...emailOtp];

        updated[index] = value;

        setEmailOtp(updated);

        if (
            value &&
            index < otpLength - 1
        ) {
            const next =
                document.getElementById(
                    `email-otp-${index + 1}`
                );

            (next as HTMLInputElement)?.focus();
        }

        if (
            value &&
            index === otpLength - 1 &&
            mobileOtpRequired
        ) {
            const mobileInput =
                document.getElementById(
                    "mobile-otp-0"
                ) as HTMLInputElement;

            mobileInput?.focus();
            mobileInput?.select();
        }
    };

    const handleMobileOtpChange = (
        index: number,
        value: string
    ) => {

        if (!/^\d?$/.test(value)) return;

        const updated = [...mobileOtp];

        updated[index] = value;

        setMobileOtp(updated);

        if (
            value &&
            index < otpLength - 1
        ) {
            const next =
                document.getElementById(
                    `mobile-otp-${index + 1}`
                );

            (next as HTMLInputElement)?.focus();
        }
    };
    useEffect(() => {

        if (!otpRequired) return;

        const timer =
            setInterval(() => {

                setEmailTimer((prev) =>
                    prev > 0 ? prev - 1 : 0
                );

                setMobileTimer((prev) =>
                    prev > 0 ? prev - 1 : 0
                );

            }, 1000);

        return () =>
            clearInterval(timer);

    }, [otpRequired]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault()

        setError('')
        setMessage('')
        if (!acceptedTerms) {
            setError(
                "You must accept the Terms & Conditions, Privacy Policy and Cancellation & Refund Policy."
            );
            return;
        }
        const usernameValidation =
            validateUsername(
                form.username
            )

        if (
            !usernameValidation.valid
        ) {
            setError(
                usernameValidation.message
            )
            return
        }

        const mobileValidation =
            validateMobile(
                form.mobile
            )
        const emailValidation = validateEmail(form.email)

        if (
            !mobileValidation.valid
        ) {
            setError(
                mobileValidation.message
            )
            return
        }
        if (
            !emailValidation.valid
        ) {
            setError(
                emailValidation.message
            )
            return
        }

        const passwordValidation =
            validatePassword(
                form.password
            )

        if (
            !passwordValidation.valid
        ) {
            setError(
                passwordValidation.message
            )
            return
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                'Passwords do not match'
            )
            return
        }

        if (!form.state) {
            setError(
                'Please select a state'
            )
            return
        }

        try {
            setLoading(true)

            const result =
                await apiSignup(form)

            if (!result?.success) {
                setError(
                    result?.message
                )
                return
            }

            setMessage(
                result?.message ||
                'Registration successful'
            )
        } catch (err) {
            console.error(err)

            setError(
                'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }
    const {
        fetchUser,
    } = useUserStore()
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

    async function resendEmailOtp() {
        try {
            setError("");
            setMessage("");


            const response = await fetch(
                RESEND_REGISTER_OTP,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "resendEmailOtp",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to resend email OTP");
                return;
            }
            setEmailTimer(60);
            setMessage(data.message || "Email OTP sent");
        }
        catch {
            setError("Failed to resend email OTP");
        }
    }

    async function resendMobileOtp() {
        try {
            setError("");
            setMessage("");
            const response = await fetch(
                RESEND_REGISTER_OTP,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "resendMobileOtp",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to resend mobile OTP");
                return;
            }
            setMobileTimer(60);
            setMessage(data.message || "Mobile OTP sent");
        }
        catch {
            setError("Failed to resend mobile OTP");
        }
    }
    const handleOtpBackspace = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        prefix: string,
        otpArray: string[]
    ) => {

        if (
            e.key === "Backspace" &&
            !otpArray[index] &&
            index > 0
        ) {

            const prev =
                document.getElementById(
                    `${prefix}-${index - 1}`
                );

            (prev as HTMLInputElement)?.focus();
        }
    };
    useEffect(() => {
        if (!otpRequired) return;

        setTimeout(() => {

            if (emailOtpRequired) {

                document
                    .getElementById("email-otp-0")
                    ?.focus();

            } else if (mobileOtpRequired) {

                document
                    .getElementById("mobile-otp-0")
                    ?.focus();
            }

        }, 0);

    }, [
        otpRequired,
        recipientEmail,
        recipientMobile
    ]);
    return (
        <div className="h-screen bg-[#4A3F77] overflow-y-auto">
            <div className="min-h-full w-full px-4 py-6 flex items-start justify-center">
                <div className="relative w-full max-w-md mx-auto my-auto">
                    {/* Subtle background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent rounded-3xl -z-10" />

                    {/* Card container */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-6 md:p-8">
                        <div className="space-y-5">
                            <div className="text-center mb-2">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Create Account
                                </h1>
                                <p className="text-gray-500 text-sm mt-2 ">
                                    Join us today
                                </p>
                            </div>
                            {!otpRequired &&
                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    {/* Username Field */}


                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email Address for otp"
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    {/* Mobile Field */}
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            placeholder="Mobile Number"
                                            maxLength={10}
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>

                                    {/* State Dropdown */}
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                        <button
                                            type="button"
                                            onClick={() => setStateOpen(!stateOpen)}
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 text-left text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        >
                                            <span className={!form.state ? "text-gray-400" : "text-gray-800"}>
                                                {form.state || 'Select State'}
                                            </span>
                                        </button>
                                        {stateOpen && (
                                            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl bg-white border border-gray-200 shadow-lg max-h-40 overflow-y-auto">
                                                {states.map((state) => (
                                                    <button
                                                        key={state}
                                                        type="button"
                                                        onClick={() => {
                                                            setForm((prev) => ({ ...prev, state }));
                                                            setStateOpen(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-gray-700 text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                                    >
                                                        {state}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-10 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            className="h-12 w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-10 text-gray-800 placeholder:text-gray-400 text-[16px] outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {/* Error & Success Messages */}
                                    {error && (
                                        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                                            <p className="text-red-600 text-xs">{error}</p>
                                        </div>
                                    )}

                                    {message && (
                                        <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                                            <p className="text-green-600 text-xs">{message}</p>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 mt-2">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(e) =>
                                                setAcceptedTerms(e.target.checked)
                                            }
                                            className="mt-1 h-4 w-4 cursor-pointer"
                                        />

                                        <label
                                            htmlFor="terms"
                                            className="text-sm text-gray-600"
                                        >
                                            I agree to the{" "}
                                            <a
                                                href="/terms-and-conditions"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 font-medium hover:underline"
                                            >
                                                Terms & Conditions
                                            </a>
                                            {", "}
                                            <a
                                                href="/privacy-policy"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 font-medium hover:underline"
                                            >
                                                Privacy Policy
                                            </a>
                                            {" and "}
                                            <a
                                                href="/cancellation-and-refund"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 font-medium hover:underline"
                                            >
                                                Cancellation & Refund Policy
                                            </a>
                                        </label>
                                    </div>
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="cursor-pointer h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>}
                            {otpRequired && (
                                <div className="space-y-5">

                                    <div className="text-center">
                                        <div className="flex justify-center">

                                            <div className="
    w-16
    h-16
    rounded-full
    bg-purple-100
    flex
    items-center
    justify-center
">

                                                <Mail
                                                    className="
        text-purple-600
    "
                                                    size={28}
                                                />

                                            </div>

                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Verify OTP
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Enter the verification code sent to you. Please check your{" "}
                                            <span className="text-red-500 font-medium">
                                                Inbox or Spam folder
                                            </span>.
                                        </p>
                                    </div>

                                    {emailOtpRequired && recipientEmail && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Email Verification
                                            </label>

                                            <p className="text-xs text-gray-500">
                                                OTP sent to {recipientEmail}
                                            </p>

                                            <div className="flex justify-center gap-2">

                                                {
                                                    Array.from({
                                                        length: otpLength
                                                    }).map((_, index) => (

                                                        <input
                                                            key={index}
                                                            id={`email-otp-${index}`}
                                                            maxLength={1}
                                                            value={emailOtp[index] || ""}
                                                            onChange={(e) =>
                                                                handleEmailOtpChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            onKeyDown={(e) =>
                                                                handleOtpBackspace(
                                                                    e,
                                                                    index,
                                                                    "email-otp",
                                                                    emailOtp
                                                                )
                                                            }
                                                            className="w-12 h-12 rounded-xl border border-gray-300 text-center text-lg font-bold focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                                                    ))
                                                }


                                            </div>
                                            <div className="text-center">

                                                {
                                                    emailTimer > 0 ?

                                                        <p className="text-sm text-gray-500">
                                                            Resend Email OTP in {emailTimer}s
                                                        </p>

                                                        :

                                                        <button
                                                            type="button"
                                                            onClick={resendEmailOtp}
                                                            className="
        text-purple-600
        font-semibold
        hover:text-purple-700
    "
                                                        >
                                                            Resend Email OTP
                                                        </button>
                                                }

                                            </div>
                                        </div>
                                    )}

                                    {mobileOtpRequired && recipientMobile && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Mobile Verification
                                            </label>

                                            <p className="text-xs text-gray-500">
                                                OTP sent to {recipientMobile}
                                            </p>

                                            <div className="flex justify-center gap-2">

                                                {
                                                    Array.from({
                                                        length: otpLength
                                                    }).map((_, index) => (

                                                        <input
                                                            key={index}
                                                            id={`mobile-otp-${index}`}
                                                            maxLength={1}
                                                            value={mobileOtp[index] || ""}
                                                            onChange={(e) =>
                                                                handleMobileOtpChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            onKeyDown={(e) =>
                                                                handleOtpBackspace(
                                                                    e,
                                                                    index,
                                                                    "mobile-otp",
                                                                    mobileOtp
                                                                )
                                                            }
                                                            className="w-12 h-12 rounded-xl border border-gray-300 text-center text-lg font-bold focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                                                    ))
                                                }

                                            </div>
                                            <div className="text-center">

                                                {
                                                    mobileTimer > 0 ?

                                                        <p className="text-sm text-gray-500">
                                                            Resend Mobile OTP in {mobileTimer}s
                                                        </p>

                                                        :

                                                        <button
                                                            type="button"
                                                            onClick={resendMobileOtp}
                                                            className="
        text-purple-600
        font-semibold
        hover:text-purple-700
    "
                                                        >
                                                            Resend Mobile OTP
                                                        </button>
                                                }

                                            </div>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                                            <p className="text-red-600 text-xs">{error}</p>
                                        </div>
                                    )}

                                    {message && (
                                        <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                                            <p className="text-green-600 text-xs">{message}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-3">

                                        <button
                                            type="button"
                                            disabled={otpLoading}
                                            onClick={verifyOTP}
                                            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:opacity-90 disabled:opacity-60"
                                        >
                                            {otpLoading ? <Spinner size={16} /> : "Verify OTP"}
                                        </button>

                                    </div>

                                    <p className="text-center text-xs text-gray-500">
                                        Didn't receive the code? Click resend.
                                    </p>

                                </div>
                            )}

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs text-gray-400 font-medium">OR</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* Sign In Link */}
                            <p className="text-center text-sm text-gray-500">
                                Already have an account?{' '}
                                <button
                                    onClick={() => router.push('/login')}
                                    type="button"
                                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}