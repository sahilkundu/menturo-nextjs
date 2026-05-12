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

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm mb-2"
                    style={{ color: "var(--formLabelAndPlaceholder)" }}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Left Icon */}
                {Icon && (
                    <Icon
                        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--iconSecondary)" }}
                    />
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`input-theme ${Icon ? "!pl-10" : ""} ${isPassword ? "!pr-10" : ""
                        } ${className}`}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" style={{ color: "var(--iconSecondary)" }} />
                        ) : (
                            <Eye className="w-5 h-5" style={{ color: "var(--iconSecondary)" }} />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}