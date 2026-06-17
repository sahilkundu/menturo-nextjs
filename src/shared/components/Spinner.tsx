// components/Loader.tsx

type SpinnerProps = {
    size?: number
    className?: string
}

export default function Spinner({
    size = 20,
    className = ''
}: SpinnerProps) {

    return (

        <div
            className={`
                inline-block
                animate-spin
                rounded-full
                border-solid
                border-white
                border-t-[#4a3f77]
                m-px
                ${className}
            `}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderWidth: `${Math.max(2, size * 0.12)}px`
            }}
        />
    )
}