'use client'

import { usePathname } from 'next/navigation'
import { useLayoutStore } from '../store/uiResStore'
import { useUserStore } from '../store/user'

export const WHATSAPP_GROUP_URL =
    'https://chat.whatsapp.com/H43IzIObQgNCkTGhoxzsOp?s=cl&p=i&mlu=0&ilr=0'

const WhatsAppIcon = ({
    className = '',
}: {
    className?: string
}) => (
    <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={className}
        fill="currentColor"
    >
        <path d="M16.02 3.2A12.65 12.65 0 0 0 5.12 22.25L3.6 28.8l6.7-1.58A12.64 12.64 0 1 0 16.02 3.2Zm0 2.31a10.33 10.33 0 0 1 8.79 15.74 10.32 10.32 0 0 1-13.73 3.7l-.49-.25-3.97.94.9-3.88-.28-.5A10.33 10.33 0 0 1 16.02 5.51Zm-4.5 5.52c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86 0 1.68 1.23 3.31 1.4 3.54.17.23 2.38 3.81 5.86 5.19 2.9 1.14 3.49.91 4.12.86.63-.06 2.03-.83 2.32-1.63.29-.8.29-1.49.2-1.63-.08-.14-.31-.23-.66-.4-.34-.17-2.03-1-2.35-1.11-.31-.12-.54-.17-.77.17-.23.34-.89 1.11-1.09 1.34-.2.23-.4.26-.74.09-.34-.17-1.45-.53-2.76-1.7-1.02-.91-1.71-2.03-1.91-2.37-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.54-.28-.67-.56-.58-.77-.59h-.65Z" />
    </svg>
)

const shouldShowFloatingButton = (
    pathname: string
) =>
    pathname === '/' ||
    pathname === '/typingPro' ||
    pathname.startsWith('/series/')

export default function WhatsAppJoinButton() {
    const pathname =
        usePathname()
    const authenticated =
        useUserStore(
            (state) => state.authenticated
        )
    const leftMobile =
        useLayoutStore(
            (state) => state.leftMobile
        )
    const rightMobile =
        useLayoutStore(
            (state) => state.rightMobile
        )
    const rightSidebarOpen =
        useLayoutStore(
            (state) => state.rightSidebarOpen
        )
    const liveBubbleOpen =
        useLayoutStore(
            (state) => state.liveBubbleOpen
        )
    const liveBubbleVisible =
        pathname === '/' &&
        authenticated &&
        leftMobile &&
        rightMobile &&
        !rightSidebarOpen &&
        !liveBubbleOpen
    const bottomOffsetClass =
        pathname === '/'
            ? 'bottom-[calc(env(safe-area-inset-bottom)+30px)]'
            : 'bottom-[calc(env(safe-area-inset-bottom)+104px)]'

    if (
        liveBubbleOpen ||
        !shouldShowFloatingButton(pathname)
    ) {
        return null
    }

    return (
        <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Menturo WhatsApp group"
            title="Join WhatsApp group"
            className={[
                'fixed z-[1199] grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 hover:bg-[#1EBE5D] sm:h-14 sm:w-14',
                bottomOffsetClass,
                liveBubbleVisible
                    ? 'right-[102px]'
                    : 'right-5',
            ].join(' ')}
        >
            <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </a>
    )
}

export {
    WhatsAppIcon,
}
