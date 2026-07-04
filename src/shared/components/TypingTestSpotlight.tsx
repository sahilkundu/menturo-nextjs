'use client'

import { useRouter } from "next/navigation"
import { showRouteLoader } from "../utils/routeLoader"

export default function TypingTestSpotlight() {
    const router = useRouter()

    const handleOpen = () => {
        showRouteLoader()
        router.push('/typingPro')
    }

    return (
        <section className="mt-3">
            <button
                type="button"
                onClick={handleOpen}
                className="group grid w-full overflow-hidden rounded-2xl border border-[#C7F7D8] bg-[linear-gradient(135deg,#F8FFE8_0%,#DFF86A_45%,#BDF7E2_100%)] p-4 text-left shadow-[0_18px_42px_rgba(40,199,111,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(40,199,111,.24)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
            >
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#153B2E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                            Typing Test
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Live now
                        </span>
                    </div>
                    <h3 className="text-lg font-black text-[#153B2E] sm:text-xl">
                        Practice Hindi and English typing separately
                    </h3>
                    <p className="mt-1 max-w-2xl text-xs font-semibold leading-5 text-[#37544B] sm:text-sm">
                        Open the focused typing workspace for speed, accuracy, levels, and typing attempts.
                    </p>
                </div>

                <span className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-[#153B2E] shadow-sm transition group-hover:bg-[#153B2E] group-hover:text-white sm:mt-0">
                    Explore Typing ↗
                </span>
            </button>
        </section>
    )
}
