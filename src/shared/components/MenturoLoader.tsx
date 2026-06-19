type MenturoLoaderProps = {
    mode?: "page" | "overlay"
}

export default function MenturoLoader({
    mode = "page"
}: MenturoLoaderProps) {
    const isOverlay =
        mode === "overlay"

    return (
        <div
            className={`
                fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white
                ${isOverlay ? "animate-[menturoFadeIn_.16s_ease-out_forwards]" : ""}
            `}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="mb-7 flex gap-1.5 md:gap-2">
                {["M", "E", "N", "T", "U", "R", "O"].map(
                    (letter, index) => (
                        <div
                            key={letter}
                            className="
                                text-[40px]
                                md:text-[82px]
                                font-black
                                text-[#1cd1a1]
                                opacity-0
                                translate-y-[42px]
                                scale-75
                                drop-shadow-[0_0_10px_rgba(28,209,161,0.18)]
                                animate-[menturoShowLetter_.42s_forwards]
                            "
                            style={{
                                animationDelay: `${index * 0.08}s`,
                            }}
                        >
                            {letter}
                        </div>
                    )
                )}
            </div>

            <div
                className="
                    flex
                    flex-col
                    items-center
                    opacity-0
                    animate-[menturoShowLogo_.24s_forwards]
                    [animation-delay:.32s]
                "
            >
                <div
                    className="
                        relative
                        flex
                        h-[120px]
                        w-[120px]
                        md:h-[170px]
                        md:w-[170px]
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[28px]
                        md:rounded-[38px]
                        border-2
                        border-[rgba(28,209,161,0.15)]
                        bg-white
                        shadow-[0_20px_45px_rgba(28,209,161,0.2)]
                        animate-[menturoFloatLogo_2s_infinite_ease-in-out]
                    "
                >
                    <div
                        className="
                            absolute
                            h-[230px]
                            w-[230px]
                            rounded-full
                            bg-[radial-gradient(rgba(28,209,161,0.2),transparent_70%)]
                        "
                    />

                    <div
                        className="
                            absolute
                            left-[-120%]
                            top-[-40%]
                            z-[5]
                            h-[240%]
                            w-[70px]
                            rotate-[20deg]
                            bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent)]
                            animate-[menturoFlashMove_1.4s_infinite_linear]
                        "
                    />

                    <img
                        src="/M3.png"
                        alt="Menturo Logo"
                        className="
                            relative
                            z-[2]
                            w-[78px]
                            md:w-[115px]
                            drop-shadow-[0_0_10px_rgba(28,209,161,0.18)]
                        "
                    />
                </div>

                <div
                    className="
                        mt-5
                        h-[18px]
                        w-[100px]
                        rounded-full
                        bg-[rgba(28,209,161,0.12)]
                        blur-[5px]
                        animate-[menturoShadowAnim_2s_infinite_ease-in-out]
                    "
                />

                <div
                    className="
                        mt-5
                        text-[14px]
                        md:text-[19px]
                        font-extrabold
                        tracking-[3px]
                        text-[#1cd1a1]
                    "
                >
                    LOADING
                </div>

                <div className="mt-4 flex gap-2">
                    {[0, 1, 2].map((_, index) => (
                        <div
                            key={index}
                            className="
                                h-[10px]
                                w-[10px]
                                rounded-full
                                bg-[#1cd1a1]
                                animate-[menturoBounce_1.2s_infinite]
                            "
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes menturoFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes menturoShowLetter {
                    0% {
                        opacity: 0;
                        transform: translateY(42px) scale(.75);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes menturoShowLogo {
                    from {
                        opacity: 0;
                        transform: scale(.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes menturoFlashMove {
                    from { left: -120%; }
                    to { left: 180%; }
                }

                @keyframes menturoFloatLogo {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-14px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes menturoShadowAnim {
                    0% {
                        transform: scale(1);
                        opacity: .18;
                    }
                    50% {
                        transform: scale(.65);
                        opacity: .05;
                    }
                    100% {
                        transform: scale(1);
                        opacity: .18;
                    }
                }

                @keyframes menturoBounce {
                    0%,100% { transform: translateY(0); }
                    50% { transform: translateY(-9px); }
                }
            `}</style>
        </div>
    )
}
