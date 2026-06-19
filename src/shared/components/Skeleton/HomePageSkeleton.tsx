'use client'

import FooterSkeleton from "./FooterSkeleton"
import HomeCenterSkeleton from "./HomeCenterSkeleton"
import LeftSidebarSkeleton from "./LeftSidebarSkeleton"
import LiveBubbleSkeleton from "./LiveBubbleSkeleton"
import RightSidebarSkeleton from "./RightSidebarSkeleton"

type HomePageSkeletonProps = {
    authenticated?: boolean
}

export default function HomePageSkeleton({
    authenticated = false
}: HomePageSkeletonProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex w-full items-start">
                {authenticated && (
                    <div className="hidden min-[1281px]:block w-[250px] shrink-0 sticky top-0 h-screen overflow-hidden">
                        <LeftSidebarSkeleton />
                    </div>
                )}

                <div className="flex-1 min-w-0 w-[300px]">
                    <HomeCenterSkeleton />
                </div>

                {authenticated && (
                    <div className="hidden min-[901px]:block w-[250px] shrink-0 sticky top-0 h-screen overflow-hidden">
                        <RightSidebarSkeleton />
                    </div>
                )}
            </div>

            <FooterSkeleton />

            {authenticated && (
                <div className="fixed bottom-5 right-5 z-[1200] min-[901px]:hidden">
                    <LiveBubbleSkeleton />
                </div>
            )}
        </div>
    )
}
