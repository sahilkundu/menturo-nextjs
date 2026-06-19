'use client'

export default function LiveBubbleSkeleton() {
    return (
        <div className="relative h-[74px] w-[74px] animate-pulse">
            <div className="absolute left-2 top-2 h-[58px] w-[58px] rounded-full bg-violet-200 shadow-[0_8px_20px_rgba(109,40,217,0.16)]" />
            <div className="absolute left-[2px] top-[2px] h-7 w-7 rounded-full bg-red-200 border-[3px] border-white" />
            <div className="absolute bottom-[4px] right-0 h-5 w-12 rounded-full bg-red-200" />
        </div>
    )
}
