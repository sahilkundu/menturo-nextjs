'use client'

interface TestCardSkeletonProps {
    count?: number
    responsive?: boolean
}

export default function TestCardSkeleton({
    count = 1,
    responsive = false
}: TestCardSkeletonProps) {

    return (
        <>
            {Array.from({
                length: count
            }).map((_, index) => (

                <div
                    key={index}
                    className={`
                        relative
                        ${responsive ? 'w-full' : 'w-[240px]'}
                        flex-shrink-0
                        rounded-[24px]
                        overflow-hidden
                        border
                        border-[#4A3F77]/12
                        bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFAFF_54%,#FFFFFF_100%)]
                        shadow-[0_18px_44px_rgba(74,63,119,0.10)]
                        animate-pulse
                    `}
                >

                    <div className="relative p-3 pb-0">
                        <div className="h-[144px] rounded-[20px] bg-[#E7E2F4]" />

                        <div className="absolute top-5 left-5 h-7 w-20 rounded-full bg-[#F5A524]/70" />
                    </div>

                    <div className="relative p-4 pt-3">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="h-6 w-11 rounded-full bg-[#F5F3FF] border border-[#4A3F77]/10" />
                            <div className="h-6 w-16 rounded-full bg-[#FFF7D6] border border-[#F59E0B]/20" />
                        </div>

                        <div className="mb-3 min-h-[40px] space-y-2">
                            <div className="h-4 w-[88%] rounded bg-[#DAD5EA]" />
                            <div className="h-4 w-[64%] rounded bg-[#E5E0F0]" />
                        </div>

                        <div className="mb-3 rounded-[18px] border border-[#E2DDF3] bg-white px-3 py-2.5 shadow-[0_8px_20px_rgba(74,63,119,0.05)]">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="h-4 w-20 rounded bg-[#E5E0F0]" />
                                <div className="h-6 w-16 rounded-full bg-[#DDF8EA]" />
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="space-y-2">
                                    <div className="h-3 w-12 rounded bg-[#E8E4F2]" />
                                    <div className="h-4 w-8 rounded bg-[#F3D2D2]" />
                                </div>

                                <div className="space-y-2">
                                    <div className="ml-auto h-3 w-10 rounded bg-[#E8E4F2]" />
                                    <div className="h-6 w-12 rounded bg-[#CDEEDD]" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 flex min-h-[34px] items-center gap-2 rounded-[18px] border border-[#E8DEF8] bg-[#F8F6FF] px-3 py-2">
                            <div className="h-4 w-4 rounded-full bg-[#DDD7EF]" />
                            <div className="h-3 w-32 rounded bg-[#DAD3EE]" />
                        </div>

                        <div className="h-11 w-full rounded-[16px] bg-[#D9D2EC]" />
                    </div>
                </div>
            ))}
        </>
    )
}
