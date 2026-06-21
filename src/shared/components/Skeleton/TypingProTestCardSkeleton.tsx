'use client'

type Props = { count?: number }

export default function TypingProTestCardSkeleton({ count = 1 }: Props) {
    return <>
        {Array.from({ length: count }).map((_, index) => <article key={index} aria-label="Loading typing test" className="min-h-[176px] animate-pulse rounded-[14px] border border-[#d8cff3] bg-[#fdfcff] p-3 sm:p-4">
            <div className="h-5 w-3/5 rounded bg-slate-200"/>
            <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-[13px] rounded bg-slate-100"/>
                <div className="h-[13px] rounded bg-slate-100"/>
                <div className="h-[13px] rounded bg-slate-100"/>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-100"/>
            <div className="mt-1 h-[13px] w-1/3 rounded bg-slate-100"/>
            <div className="mt-4 h-10 rounded-[11px] bg-[#4b397c]/25"/>
        </article>)}
    </>
}
