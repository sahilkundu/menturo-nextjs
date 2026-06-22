'use client'

type Props = { count?: number }

export default function TypingProTestCardSkeleton({ count = 1 }: Props) {
    return <>
        {Array.from({ length: count }).map((_, index) => <article key={index} aria-label="Loading typing test" className="animate-pulse rounded-[18px] border border-[#e2dcf3] bg-[linear-gradient(135deg,#FFFFFF_0%,#FCFBFF_100%)] px-3.5 py-3 shadow-[0_6px_18px_rgba(67,48,117,.07)] sm:px-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="h-4 w-2/5 rounded bg-[#e8e4f2]"/>
                    <div className="mt-2 flex gap-2">
                        <div className="h-5 w-16 rounded-full bg-[#f0edf7]"/>
                        <div className="h-5 w-14 rounded-full bg-[#f0edf7]"/>
                        <div className="h-5 w-20 rounded-full bg-[#f0edf7]"/>
                    </div>
                </div>
                <div className="h-5 w-12 rounded-full bg-[#f0edf7]"/>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#eeebf6]"/>
            <div className="mt-2 flex items-center justify-between"><div className="h-3 w-28 rounded bg-[#f0edf7]"/><div className="h-8 w-24 rounded-xl bg-[#e1daef]"/></div>
        </article>)}
    </>
}
