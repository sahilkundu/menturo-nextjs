"use client"

import { BadgeCheck } from "lucide-react"

type AdminVerifiedBadgeProps = {
    show?: boolean
    className?: string
}

export default function AdminVerifiedBadge({
    show,
    className = "",
}: AdminVerifiedBadgeProps) {
    if (!show) {
        return null
    }

    return (
        <BadgeCheck
            aria-label="Verified admin"
            className={`relative -top-px inline-flex h-4 w-4 shrink-0 self-center align-middle fill-blue-500 text-white ${className}`}
            strokeWidth={3}
        />
    )
}
