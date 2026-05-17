'use client'

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

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

export default function Input({
    type = "text",
    name,
    label,
    placeholder,
    value,
    onChange,
    icon: Icon,
    disabled = false,
    required = false,
    className = ""
}: InputProps) {

    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState(false)

    const isPassword = type === "password"

    const inputType =
        isPassword
            ? (showPassword ? "text" : "password")
            : type

    const active = focused || value

    return (
        <div className={`w-full m-1 ${className}`}>

            <div className="relative w-full">

                {/* FLOATING LABEL */}
                {placeholder && (
                    <span
                        className={`
                            absolute
                            left-4
                           
                            px-1
                            text-[13px]
                            pointer-events-none
                            z-10

                            transition-all
                            duration-300
                            ease-out

                            ${active
                                ? `
                                    top-0
                                    -translate-y-1/2
                                    scale-90
                                  `
                                : `
                                    top-1/2
                                    -translate-y-1/2
                                    scale-100
                                  `
                            }
                        `}
                        style={{
                            color: "var(--formLabelAndPlaceholder)"
                        }}
                    >
                        {placeholder}
                    </span>
                )}

                {/* LEFT ICON */}
                {Icon && (
                    <Icon
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            w-5
                            h-5
                            z-[2]

                            transition-all
                            duration-300
                        "
                        style={{
                            color: "var(--iconSecondary)"
                        }}
                    />
                )}

                {/* INPUT */}
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`
                        w-full
                        h-[35px]

                        bg-[#f8fafc]
                        border
                        border-[#e2e8f0]

                        rounded-2xl
                        outline-none

                        text-sm

                        transition-all
                        duration-300
                        ease-out

                        focus:border-[#6a11cb]
                        focus:bg-white
                        focus:shadow-[0_0_0_3px_rgba(106,17,203,0.08)]

                        ${Icon ? "pl-11" : "pl-4"}
                        ${isPassword ? "pr-11" : "pr-4"}
m-1
                        leading-[35px]
                    `}
                />

                {/* PASSWORD TOGGLE */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            z-[2]

                            transition-all
                            duration-300
                        "
                    >
                        {showPassword ? (
                            <EyeOff
                                className="w-5 h-5"
                                style={{
                                    color: "var(--iconSecondary)"
                                }}
                            />
                        ) : (
                            <Eye
                                className="w-5 h-5"
                                style={{
                                    color: "var(--iconSecondary)"
                                }}
                            />
                        )}
                    </button>
                )}

            </div>

        </div>
    )
}