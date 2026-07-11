"use client"

import { ReactNode, Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react"

import { ThemeProvider } from "./ThemeProvider"

import { useWSStore } from "../../shared/utils/wsStore"

import { useUserStore } from "../../shared/store/user"
import { useTestSeriesStore } from "../../shared/store/testSeriesStore"
import { useRouter, usePathname } from "next/navigation"
import RouteTransitionProvider from "./RouteTransitionProvider"
import { hideRouteLoader, showRouteLoader } from "../../shared/utils/routeLoader"
import { installEncryptedFetch } from "../../shared/utils/encryptedTransport"
import { rememberRedirectAfterLogin } from "../../shared/utils/loginRedirect"
import {
    ACCOUNT_VERIFICATION_CHANGE,
    ACCOUNT_VERIFICATION_REQUEST,
    ACCOUNT_VERIFICATION_STATUS,
    ACCOUNT_VERIFICATION_VERIFY,
    AUTH
} from "../../../api"
import VisitorTracker from "../../shared/components/VisitorTracker"
import { showPopupMessage } from "../../shared/utils/popup"

interface Props {
    children: ReactNode
}

export default function AppProviders({
    children
}: Props) {
    useLayoutEffect(() => installEncryptedFetch(), [])

    const router = useRouter()
    const pathname = usePathname()

    // =====================================
    // USER
    // =====================================

    const user =
        useUserStore(
            (state) => state.user
        )
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const access =
        useUserStore(
            (state) => state.access
        )
    const loading =
        useUserStore(
            (state) => state.loading
        )
    const authChecked =
        useUserStore(
            (state) => state.authChecked
        )
    const fetchUser =
        useUserStore(
            (state) => state.fetchUser
        )
    const setSecurityBlockedUntil =
        useUserStore(
            (state) => state.setSecurityBlockedUntil
        )
    const needVerify =
        useUserStore(
            (state) => state.needVerify
        )
    const setNeedVerify =
        useUserStore(
            (state) => state.setNeedVerify
        )
    const refreshSeriesAccess =
        useTestSeriesStore(
            (state) => state.refreshSeriesAccess
        )
    const wsSessionId =
        useWSStore(
            (state) => state.sessionId
        )


    useEffect(() => {
        if (
            !authChecked &&
            !loading
        ) {
            void fetchUser()
        }
    }, [
        authChecked,
        loading,
        fetchUser
    ])
    useEffect(() => {
        refreshSeriesAccess(access)
    }, [access, refreshSeriesAccess])
    useEffect(() => {

        const originalFetch =
            window.fetch

        window.fetch = async (
            input: RequestInfo | URL,
            init?: RequestInit
        ) => {

            const response =
                await originalFetch(
                    input,
                    {
                        credentials: "include",
                        ...init
                    }
                )

            try {

                const cloned =
                    response.clone()

                const data =
                    await cloned.json()

                // =====================================
                // GLOBAL REDIRECT
                // =====================================

                const requestUrl =
                    typeof input === "string"
                        ? input
                        : input instanceof URL
                            ? input.toString()
                            : input.url

                if (
                    data &&
                    typeof data === "object" &&
                    "code" in data &&
                    data.code === "ACCOUNT_SECURITY_BLOCKED"
                ) {
                    const blockedUntil =
                        typeof data.blockedUntil === "number"
                            ? data.blockedUntil
                            : Number(data.blockedUntil || 0)

                    setSecurityBlockedUntil(
                        blockedUntil
                    )

                    showPopupMessage(
                        typeof data.message === "string"
                            ? data.message
                            : "Account actions are temporarily blocked.",
                        false
                    )
                }

                if (
                    data &&
                    typeof data === "object" &&
                    "code" in data &&
                    data.code === "ACCOUNT_VERIFICATION_REQUIRED"
                ) {
                    const nextNeedVerify =
                        typeof data.needVerify === "object" &&
                            data.needVerify
                            ? data.needVerify
                            : { required: true }

                    setNeedVerify(
                        nextNeedVerify
                    )

                    showPopupMessage(
                        typeof data.message === "string"
                            ? data.message
                            : "Verify your account to continue.",
                        false
                    )
                }

                if (
                    data &&
                    typeof data === "object" &&
                    "redirect" in data &&
                    typeof data.redirect === "string"
                ) {
                    if (requestUrl === AUTH) {
                        return response
                    }

                    // Ignore redirects on test detail pages
                    if (
                        pathname.startsWith("/series/")
                    ) {
                        return response
                    }

                    showRouteLoader()
                    if (data.redirect === "/login") {
                        await rememberRedirectAfterLogin()
                    }

                    router.push(
                        data.redirect
                    )
                }

            } catch (_) { }

            return response
        }

        return () => {

            window.fetch =
                originalFetch
        }

    }, [router, pathname, setSecurityBlockedUntil, setNeedVerify])

    // =====================================
    // CONNECT WS
    // =====================================

    useEffect(() => {
        if (!authChecked) {
            return
        }

        const wsUserId =
            authenticated && user?.id
                ? user.id
                : `guest-${wsSessionId}`

        useWSStore
            .getState()
            .connect(wsUserId)

    }, [
        authChecked,
        authenticated,
        user?.id,
        wsSessionId
    ])

    useEffect(() => {
        const ws =
            useWSStore
                .getState()

        ws.routeChange(pathname)
        ws.send({
            event: "site-stats"
        })
    }, [pathname])

    return (

        <ThemeProvider>
            <Suspense fallback={null}>
                <RouteTransitionProvider>
                    <VisitorTracker />
                    {authenticated && (
                        <AccountVerificationGate
                            needVerify={needVerify}
                            refreshUser={fetchUser}
                            setNeedVerify={setNeedVerify}
                            router={router}
                        />
                    )}
                    {/* {pathname !== "/test" &&
                        <div className="w-full min-w-[320px] backdrop-blur-md bg-red-500/80 border border-white/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] px-2 sm:px-2 py-0 sm:py-0 text-center">
                            <span className="text-white font-semibold text-[14px] sm:text-[16px] drop-shadow-lg block whitespace-nowrap sm:whitespace-normal">
                                Website under maintenance
                            </span>
                        </div>
                    } */}
                    {children}
                </RouteTransitionProvider>
            </Suspense>

        </ThemeProvider>
    )
}

function AccountVerificationGate({
    needVerify,
    refreshUser,
    setNeedVerify,
    router,
}: {
    needVerify: any
    refreshUser: () => Promise<boolean>
    setNeedVerify: (value: any) => void
    router: ReturnType<typeof useRouter>
}) {
    const requiresEmail =
        needVerify?.email === true
    const requiresMobile =
        needVerify?.mobile === true
    const open =
        needVerify?.required === true &&
        (requiresEmail || requiresMobile)
    const requestKey =
        useMemo(
            () =>
                `${requiresEmail ? "e" : ""}:${requiresMobile ? "m" : ""}:${needVerify?.hasEmail === false ? "no-email" : needVerify?.emailMasked || ""}:${needVerify?.hasMobile === false ? "no-mobile" : needVerify?.mobileMasked || ""}`,
            [
                requiresEmail,
                requiresMobile,
                needVerify?.hasEmail,
                needVerify?.hasMobile,
                needVerify?.emailMasked,
                needVerify?.mobileMasked,
            ]
        )
    const [requestedKey, setRequestedKey] =
        useState("")
    const [emailOtp, setEmailOtp] =
        useState("")
    const [mobileOtp, setMobileOtp] =
        useState("")
    const [emailChange, setEmailChange] =
        useState("")
    const [mobileChange, setMobileChange] =
        useState("")
    const [showEmailChange, setShowEmailChange] =
        useState(false)
    const [showMobileChange, setShowMobileChange] =
        useState(false)
    const [emailRecipient, setEmailRecipient] =
        useState("")
    const [mobileRecipient, setMobileRecipient] =
        useState("")
    const [busy, setBusy] =
        useState("")
    const [message, setMessage] =
        useState("")
    const [emailMessage, setEmailMessage] =
        useState("")
    const [mobileMessage, setMobileMessage] =
        useState("")
    const emailDisplay =
        emailRecipient ||
        needVerify?.emailMasked ||
        ""
    const mobileDisplay =
        mobileRecipient ||
        needVerify?.mobileMasked ||
        ""
    const missingEmail =
        requiresEmail &&
        needVerify?.hasEmail === false &&
        !emailRecipient
    const missingMobile =
        requiresMobile &&
        needVerify?.hasMobile === false &&
        !mobileRecipient
    const missingContact =
        missingEmail ||
        missingMobile

    const readSentResult = (data: any, type: "email" | "mobile") => {
        const result =
            data?.sent?.[type]

        if (result === true) {
            return {
                ok: true,
                recipient: "",
                reused: false,
            }
        }

        if (typeof result === "string") {
            return {
                ok: result === "true" || result === "sent" || result === "reused",
                recipient: "",
                reused: result === "reused",
            }
        }

        return {
            ok: result?.success === true ||
                result?.sent === true ||
                result?.reused === true,
            recipient: result?.recipient || "",
            reused: result?.reused === true,
        }
    }

    const clearChannelMessages = () => {
        setEmailMessage("")
        setMobileMessage("")
    }

    const setChannelMessage = (type: "email" | "mobile", nextMessage: string) => {
        if (type === "email") {
            setEmailMessage(nextMessage)
        } else {
            setMobileMessage(nextMessage)
        }
    }

    const getChannelReadyMessage = (
        type: "email" | "mobile",
        reused: boolean,
        mode: "auto" | "resend"
    ) => {
        if (reused) {
            return type === "email"
                ? "Email OTP already sent. Please check your inbox or spam folder."
                : "Mobile OTP already sent. Please check your SMS messages."
        }

        if (mode === "resend") {
            return type === "email"
                ? "New email OTP sent. Please check your inbox or spam folder."
                : "New mobile OTP sent. Please check your SMS messages."
        }

        return ""
    }

    const applyVerificationResponse = (
        data: any,
        mode: "auto" | "resend" = "auto",
        channel?: "email" | "mobile"
    ) => {
        const emailSent =
            readSentResult(data, "email")
        const mobileSent =
            readSentResult(data, "mobile")

        if (data?.needVerify) {
            setNeedVerify(data.needVerify)
            setEmailRecipient(
                emailSent.recipient ||
                data.needVerify.emailMasked ||
                emailRecipient
            )
            setMobileRecipient(
                mobileSent.recipient ||
                data.needVerify.mobileMasked ||
                mobileRecipient
            )
        }

        const anyOtpReady =
            emailSent.ok ||
            mobileSent.ok ||
            data?.success === true
        const hasVisibleRecipient =
            Boolean(
                emailSent.recipient ||
                mobileSent.recipient ||
                data?.needVerify?.emailMasked ||
                data?.needVerify?.mobileMasked ||
                emailDisplay ||
                mobileDisplay
            )

        clearChannelMessages()

        if (emailSent.ok && (!channel || channel === "email")) {
            setEmailMessage(getChannelReadyMessage("email", emailSent.reused, mode))
        }

        if (mobileSent.ok && (!channel || channel === "mobile")) {
            setMobileMessage(getChannelReadyMessage("mobile", mobileSent.reused, mode))
        }

        if (data?.message === "OTP already sent" || emailSent.reused || mobileSent.reused) {
            setMessage("")
            return
        }

        if (anyOtpReady) {
            setMessage("")
            return
        }

        if (
            hasVisibleRecipient &&
            typeof data?.message === "string" &&
            data.message.toLowerCase().includes("unable to send otp")
        ) {
            setMessage("")
            return
        }

        setMessage(data?.message || "Unable to send OTP.")
    }

    useEffect(() => {
        if (!open) {
            setRequestedKey("")
            setEmailOtp("")
            setMobileOtp("")
            setMessage("")
            clearChannelMessages()
            setShowEmailChange(false)
            setShowMobileChange(false)
            setEmailRecipient("")
            setMobileRecipient("")
            return
        }

        if (requestedKey === requestKey) {
            return
        }

        setRequestedKey(requestKey)

        if (missingEmail) {
            setShowEmailChange(true)
            setShowMobileChange(false)
            setMessage("")
            clearChannelMessages()
            return
        }

        if (missingMobile) {
            setShowEmailChange(false)
            setShowMobileChange(true)
            setMessage("")
            clearChannelMessages()
            return
        }

        setBusy("request")
        fetch(
            ACCOUNT_VERIFICATION_REQUEST,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "{}",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                applyVerificationResponse(data)
            })
            .catch(() => {
                clearChannelMessages()
                setMessage("Unable to send OTP.")
            })
            .finally(() => setBusy(""))
    }, [
        open,
        requestKey,
        requestedKey,
        missingEmail,
        missingMobile,
        setNeedVerify,
    ])

    useEffect(() => {
        if (!open) {
            return
        }

        fetch(
            ACCOUNT_VERIFICATION_STATUS,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "{}",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data?.needVerify) {
                    setNeedVerify(data.needVerify)
                    setEmailRecipient(data.needVerify.emailMasked || emailRecipient)
                    setMobileRecipient(data.needVerify.mobileMasked || mobileRecipient)
                }
            })
            .catch(() => { })
    }, [open, setNeedVerify])

    if (!open) {
        return null
    }

    const cleanOtp = (value: string) =>
        value
            .replace(/\D/g, "")
            .slice(0, 6)
    const emailOtpValue =
        cleanOtp(emailOtp)
    const mobileOtpValue =
        cleanOtp(mobileOtp)

    const submitOtp = async () => {
        setBusy("verify")
        setMessage("")
        clearChannelMessages()
        try {
            const res =
                await fetch(
                    ACCOUNT_VERIFICATION_VERIFY,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            emailOtp: emailOtpValue,
                            mobileOtp: mobileOtpValue,
                        }),
                    }
                )
            const data =
                await res.json()

            if (!data.success) {
                setMessage(data.message || "Invalid OTP")
                if (data.needVerify) {
                    setNeedVerify(data.needVerify)
                }
                return
            }

            setNeedVerify(data.needVerify || { required: false })
            await refreshUser()
            hideRouteLoader()
            router.refresh()
            window.setTimeout(() => {
                window.location.reload()
            }, 350)
        } catch {
            setMessage("Verification failed.")
        } finally {
            setBusy("")
        }
    }

    const changeTarget = async (type: "email" | "mobile") => {
        const value =
            type === "email"
                ? emailChange.trim()
                : mobileChange.trim()

        if (!value) {
            clearChannelMessages()
            setMessage(type === "email" ? "Enter new email." : "Enter new mobile.")
            return
        }

        setBusy(type)
        setMessage("")
        clearChannelMessages()
        try {
            const res =
                await fetch(
                    ACCOUNT_VERIFICATION_CHANGE,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            [type]: value,
                        }),
                    }
                )
            const data =
                await res.json()

            if (data.success) {
                setChannelMessage(
                    type,
                    data.message === "OTP already sent"
                        ? `${type === "email" ? "Email" : "Mobile"} OTP already sent. ${type === "email" ? "Please check your inbox or spam folder." : "Please check your SMS messages."}`
                        : `OTP sent to new ${type}.`
                )
                setMessage("")
            } else {
                setMessage(data.message || `Unable to change ${type}.`)
            }
            if (data.needVerify) {
                setNeedVerify(data.needVerify)
                setEmailRecipient(data.needVerify.emailMasked || emailRecipient)
                setMobileRecipient(data.needVerify.mobileMasked || mobileRecipient)
            }
            if (data.success) {
                setRequestedKey("")
                if (type === "email") {
                    setEmailRecipient(data.recipient || emailChange.trim())
                    setEmailOtp("")
                    setShowEmailChange(false)
                } else {
                    setMobileRecipient(data.recipient || mobileChange.trim())
                    setMobileOtp("")
                    setShowMobileChange(false)
                }
            }
        } catch {
            clearChannelMessages()
            setMessage(`Unable to change ${type}.`)
        } finally {
            setBusy("")
        }
    }

    const resendOtp = async (type: "email" | "mobile") => {
        if (type === "email" && showEmailChange && emailChange.trim()) {
            await changeTarget("email")
            return
        }

        if (type === "mobile" && showMobileChange && mobileChange.trim()) {
            await changeTarget("mobile")
            return
        }

        setBusy(`resend-${type}`)
        setMessage("")
        clearChannelMessages()
        try {
            const res =
                await fetch(
                    ACCOUNT_VERIFICATION_REQUEST,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            resend: true,
                            action: "resend",
                            channel: type,
                        }),
                    }
                )
            const data =
                await res.json()

            applyVerificationResponse(data, "resend", type)
        } catch {
            clearChannelMessages()
            setMessage("Unable to resend OTP.")
        } finally {
            setBusy("")
        }
    }

    const verifyDisabled =
        busy === "verify" ||
        showEmailChange ||
        showMobileChange ||
        missingContact ||
        (requiresEmail && emailOtpValue.length !== 6) ||
        (requiresMobile && mobileOtpValue.length !== 6)

    const renderOtpBoxes = (
        type: "email" | "mobile",
        value: string,
        setValue: (next: string) => void
    ) => (
        <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={(value.padEnd(6, " ")[index] || "").trim()}
                    onChange={(event) => {
                        const digits =
                            event.target.value.replace(/\D/g, "").slice(0, 6 - index)
                        const next =
                            value
                                .padEnd(6, " ")
                                .slice(0, 6)
                                .split("")
                        if (digits.length > 1) {
                            digits.split("").forEach((digit, offset) => {
                                next[index + offset] = digit
                            })
                        } else {
                            next[index] = digits || " "
                        }
                        setValue(next.join(""))
                        setMessage("")
                        if (type === "email") {
                            setEmailMessage("")
                        } else {
                            setMobileMessage("")
                        }
                        if (digits && event.target.nextElementSibling) {
                            (event.target.nextElementSibling as HTMLInputElement).focus()
                        }
                    }}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Backspace" &&
                            !value.padEnd(6, " ")[index].trim() &&
                            event.currentTarget.previousElementSibling
                        ) {
                            (event.currentTarget.previousElementSibling as HTMLInputElement).focus()
                        }
                    }}
                    onPaste={(event) => {
                        const digits =
                            event.clipboardData
                                .getData("text")
                                .replace(/\D/g, "")
                                .slice(0, 6)

                        if (!digits) {
                            return
                        }

                        event.preventDefault()
                        setValue(digits.padEnd(6, " "))
                        setMessage("")
                        if (type === "email") {
                            setEmailMessage("")
                        } else {
                            setMobileMessage("")
                        }
                    }}
                    className="h-11 w-11 rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:h-12 sm:w-12"
                />
            ))}
        </div>
    )
    const visibleMessage =
        message.toLowerCase().includes("unable to send otp") &&
            !missingContact &&
            (Boolean(emailDisplay) || Boolean(mobileDisplay))
            ? ""
            : message
    const visibleMessageIsError =
        /(invalid|failed|unable|enter|limit|too many|expired|incorrect)/i.test(visibleMessage)
    const visibleMessageIsSuccess =
        /(sent|verified|already)/i.test(visibleMessage) &&
        !visibleMessageIsError
    const channelMessageClassName = (nextMessage: string) => {
        const isError =
            /(invalid|failed|unable|enter|limit|too many|expired|incorrect)/i.test(nextMessage)

        return `mt-3 rounded-lg px-3 py-2 text-center text-sm font-semibold ${isError
            ? "bg-red-50 text-red-600"
            : "bg-emerald-50 text-emerald-600"}`
    }

    return (
        <div className="fixed inset-0 z-[2147483647] grid place-items-center bg-slate-950/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white px-6 py-5 shadow-2xl">
                <div className="min-h-7">
                    {((showEmailChange && !missingEmail) || (showMobileChange && !missingMobile)) && (
                        <button
                            type="button"
                            onClick={() => {
                                setShowEmailChange(false)
                                setShowMobileChange(false)
                                setMessage("")
                                clearChannelMessages()
                            }}
                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                            {"<"} Back
                        </button>
                    )}
                </div>

                {showEmailChange || showMobileChange ? (
                    <>
                        <div className="mt-2 text-center">
                            <h3 className="text-xl font-bold text-slate-950">
                                {showEmailChange
                                    ? missingEmail ? "Add your email" : "Change your email"
                                    : missingMobile ? "Add your mobile" : "Change your mobile"}
                            </h3>
                            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                                {showEmailChange
                                    ? "Enter the email address where you want to receive the verification code."
                                    : "Enter the mobile number where you want to receive the verification code."}
                            </p>
                        </div>

                        <div className="mt-6">
                            <input
                                value={showEmailChange ? emailChange : mobileChange}
                                onChange={(event) => {
                                    if (showEmailChange) {
                                        setEmailChange(event.target.value)
                                    } else {
                                        setMobileChange(event.target.value.replace(/\D/g, "").slice(0, 10))
                                    }
                                }}
                                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder={showEmailChange ? "name@example.com" : "10 digit mobile"}
                            />

                            <button
                                type="button"
                                disabled={busy === "email" || busy === "mobile"}
                                onClick={() => void changeTarget(showEmailChange ? "email" : "mobile")}
                                className="mt-4 h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {busy === "email" || busy === "mobile" ? (
                                    <span className="mx-auto block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                ) : "Continue"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mt-2 text-center">
                            <h3 className="text-xl font-bold text-slate-950">
                                {requiresEmail && !requiresMobile
                                    ? "Verify your email"
                                    : requiresMobile && !requiresEmail
                                        ? "Verify your mobile"
                                        : "Verify your account"}
                            </h3>
                            {(requiresEmail !== requiresMobile) && (
                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                                    {requiresEmail
                                        ? (
                                            <>
                                                The verification code has been sent to your email{" "}
                                                <span className="font-semibold text-slate-700 break-all">{emailDisplay}</span>
                                            </>
                                        )
                                        : (
                                            <>
                                                The verification code has been sent to your mobile{" "}
                                                <span className="font-semibold text-slate-700 break-all">{mobileDisplay}</span>
                                            </>
                                        )}
                                </p>
                            )}
                        </div>

                        <div className="mt-5 grid gap-4">
                            {requiresEmail && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-4">
                                    <p className="text-center text-xs font-bold uppercase tracking-wide text-blue-700">
                                        Email verification
                                    </p>
                                    <p className="mt-2 text-center text-sm text-slate-600">
                                        Sent to{" "}
                                        <span className="font-semibold text-slate-800 break-all">{emailDisplay}</span>
                                    </p>
                                    {renderOtpBoxes("email", emailOtp, setEmailOtp)}
                                    <p className="mt-3 text-center text-sm text-slate-500">
                                        Please check your <span className="font-semibold text-red-600">Spam</span> or <span className="font-semibold text-red-600">Junk</span> folder.
                                    </p>
                                    {emailMessage && (
                                        <p className={channelMessageClassName(emailMessage)}>
                                            {emailMessage}
                                        </p>
                                    )}
                                    <div className="mt-4 text-center text-sm text-slate-500">
                                        Not received yet?{" "}
                                        <button
                                            type="button"
                                            disabled={busy === "resend-email" || busy === "request"}
                                            onClick={() => void resendOtp("email")}
                                            className="font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {busy === "resend-email" || busy === "request" ? "Sending..." : "Resend verification code"}
                                        </button>
                                    </div>
                                    <div className="mt-2 text-center text-sm text-slate-500">
                                        Not your email?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMessage("")
                                                clearChannelMessages()
                                                setShowMobileChange(false)
                                                setShowEmailChange(true)
                                            }}
                                            className="font-semibold text-blue-600 transition hover:text-blue-700"
                                        >
                                            Change email
                                        </button>
                                    </div>
                                </div>
                            )}

                            {requiresMobile && (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-4">
                                    <p className="text-center text-xs font-bold uppercase tracking-wide text-emerald-700">
                                        Mobile verification
                                    </p>
                                    <p className="mt-2 text-center text-sm text-slate-600">
                                        Sent to{" "}
                                        <span className="font-semibold text-slate-800 break-all">{mobileDisplay}</span>
                                    </p>
                                    {renderOtpBoxes("mobile", mobileOtp, setMobileOtp)}
                                    <p className="mt-3 text-center text-sm text-slate-500">
                                        Please check your SMS messages for the verification code.
                                    </p>
                                    {mobileMessage && (
                                        <p className={channelMessageClassName(mobileMessage)}>
                                            {mobileMessage}
                                        </p>
                                    )}
                                    <div className="mt-4 text-center text-sm text-slate-500">
                                        Not received yet?{" "}
                                        <button
                                            type="button"
                                            disabled={busy === "resend-mobile" || busy === "request"}
                                            onClick={() => void resendOtp("mobile")}
                                            className="font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {busy === "resend-mobile" || busy === "request" ? "Sending..." : "Resend verification code"}
                                        </button>
                                    </div>
                                    <div className="mt-2 text-center text-sm text-slate-500">
                                        Not your mobile?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMessage("")
                                                clearChannelMessages()
                                                setShowEmailChange(false)
                                                setShowMobileChange(true)
                                            }}
                                            className="font-semibold text-blue-600 transition hover:text-blue-700"
                                        >
                                            Change mobile
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            disabled={verifyDisabled}
                            onClick={() => void submitOtp()}
                            className="mt-5 h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {busy === "verify" ? (
                                <span className="mx-auto block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            ) : "Continue"}
                        </button>
                    </>
                )}

                {visibleMessage && (
                    <p className={`mt-4 rounded-lg px-3 py-2 text-center text-sm font-semibold ${visibleMessageIsError
                        ? "bg-red-50 text-red-600"
                        : visibleMessageIsSuccess
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-50 text-slate-600"
                        }`}>
                        {visibleMessage}
                    </p>
                )}
            </div>
        </div>
    )
}
