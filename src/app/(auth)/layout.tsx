import type { ReactNode } from 'react'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <div className="relative min-h-[100dvh] overflow-hidden bg-[#101b1d]">
        <aside className="absolute inset-y-0 left-0 hidden w-[62%] lg:block">
            <Image src="https://cdn.menturo.in/img/loginBg.png" alt="Menturo learning" fill loading="eager" quality={65} sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover object-center" />
        </aside>
        <div className="relative z-10 min-h-[100dvh] lg:ml-auto lg:w-[38%]">
            {children}
        </div>
    </div>
}
