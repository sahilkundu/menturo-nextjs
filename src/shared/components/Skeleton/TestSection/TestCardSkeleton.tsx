'use client'

type Props = {
    count?: number
}

export default function TestCardSkeleton({
    count = 1
}: Props) {

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (

                <div
                    key={index}
                    className="
                        m-1
                        rounded-2xl
                        border
                        border-[#E5DFF4]
                        bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFAFF_100%)]
                        p-3
                        sm:p-4
                        shadow-[0_10px_26px_rgba(74,63,119,0.06)]
                        animate-pulse
                        flex
                        flex-col
                        sm:flex-row
                        justify-between
                        items-start
                        sm:items-center
                        gap-3
                    "
                >

                    <div className="space-y-2 min-w-0 w-full sm:w-auto flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="h-4 w-44 max-w-[75%] rounded bg-[#DAD5EA]" />
                            <div className="h-5 w-20 rounded bg-[#FFF0BF]" />
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <div className="h-3 w-24 rounded bg-[#E6E1F1]" />
                            <div className="h-3 w-20 rounded bg-[#E6E1F1]" />
                            <div className="h-3 w-16 rounded bg-[#E6E1F1]" />
                        </div>

                        <div className="h-3 w-36 rounded bg-[#DDD7EF]" />
                    </div>

                    <div className="flex w-full sm:w-auto gap-2">
                        <div className="h-10 w-full sm:w-[132px] rounded-xl bg-[#D9D2EC]" />
                    </div>
                </div>
            ))}
        </>
    )
}
