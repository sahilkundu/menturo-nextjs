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

                    <div className="min-w-0 w-full space-y-2 sm:flex-1">
                        <div className="flex w-full flex-nowrap items-center gap-2">
                            <div className="h-4 min-w-0 flex-1 rounded-full bg-[#DAD5EA]" />
                            <div className="h-6 w-24 shrink-0 rounded-full bg-[#F7E6B8]" />
                        </div>

                        <div className="flex w-full flex-nowrap items-center gap-1.5 overflow-hidden">
                            <div className="h-7 w-20 shrink-0 rounded-full border border-[#E4DDF4] bg-white" />
                            <div className="h-7 w-20 shrink-0 rounded-full border border-[#E4DDF4] bg-white" />
                            <div className="h-7 w-16 shrink-0 rounded-full border border-[#E4DDF4] bg-white" />
                            <div className="h-7 w-14 shrink-0 rounded-full border border-[#E4DDF4] bg-white" />
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="h-[50px] rounded-2xl border border-[#E4D8FF] bg-[linear-gradient(135deg,#FFFBF0_0%,#FFF6D7_42%,#F8EEFF_100%)] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-[#DAC0F3]" />
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="h-2 w-20 rounded-full bg-[#D8C9EE]" />
                                        <div className="h-3 w-24 rounded-full bg-[#D1BDE8]" />
                                        <div className="h-2 w-16 rounded-full bg-[#E2D8F1]" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-[50px] rounded-2xl border border-[#D9E9FF] bg-[linear-gradient(135deg,#F4FAFF_0%,#EEF7FF_45%,#F7F2FF_100%)] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-[#BED5F3]" />
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="h-2 w-24 rounded-full bg-[#CFE0F4]" />
                                        <div className="h-3 w-14 rounded-full bg-[#BFD3EF]" />
                                        <div className="h-2 w-20 rounded-full bg-[#D9E5F5]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full max-w-[560px] flex-col gap-2 border-l-2 border-[#DDD6F1] pl-3 pt-0.5">
                            <div className="flex items-center gap-2">
                                <div className="h-3.5 w-3.5 rounded bg-[#D5CDEA]" />
                                <div className="h-3 w-24 rounded-full bg-[#DAD5EA]" />
                                <div className="h-3 w-20 rounded-full bg-[#D4E9DC]" />
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-[#E9E5F3]">
                                <div className="h-full w-1/3 rounded-full bg-[#B7DCC5]" />
                            </div>
                            <div className="h-2.5 w-40 rounded-full bg-[#E3DEEF]" />
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-[148px]">
                        <div className="h-10 w-full rounded-xl bg-[#D9D2EC]" />
                        <div className="h-8 w-full rounded-xl bg-[#ECE8F7]" />
                    </div>
                </div>
            ))}
        </>
    )
}
