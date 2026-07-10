'use client'

type Props = {
    adUrl: string
    children: React.ReactNode
    className?: string
    href: string
}

export default function AdDownloadLink({
    adUrl,
    children,
    className,
    href,
}: Props) {
    return (
        <a
            className={className}
            href={href}
            onClick={(event) => {
                event.preventDefault()
                window.open(adUrl, '_blank', 'noopener,noreferrer')
                window.location.href = href
            }}
        >
            {children}
        </a>
    )
}
