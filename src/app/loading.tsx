export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white">

            {/* TEXT LOADER */}
            <div
                className="
                    mb-8
                    flex
                    gap-2
                    animate-[hideText_.6s_forwards]
                    [animation-delay:1.2s]
                "
            >
                {["M", "E", "N", "T", "U", "R", "O"].map(
                    (letter, index) => (
                        <div
                            key={index}
                            className="
                                text-[40px]
                                md:text-[82px]
                                font-black
                                text-[#1cd1a1]
                                opacity-0
                                translate-y-[70px]
                                scale-50
                                drop-shadow-[0_0_10px_rgba(28,209,161,0.18)]
                                animate-[showLetter_.5s_forwards]
                            "
                            style={{
                                animationDelay: `${0.1 + index * 0.2}s`,
                            }}
                        >
                            {letter}
                        </div>
                    )
                )}
            </div>

            {/* LOGO WRAPPER */}
            <div
                className="
                    absolute
                    flex
                    flex-col
                    items-center
                    opacity-0
                    animate-[showLogo_.6s_forwards]
                    [animation-delay:2.7s]
                "
            >

                {/* LOGO BOX */}
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
                        animate-[floatLogo_2s_infinite_ease-in-out]
                    "
                >

                    {/* GLOW */}
                    <div
                        className="
                            absolute
                            h-[230px]
                            w-[230px]
                            rounded-full
                            bg-[radial-gradient(rgba(28,209,161,0.2),transparent_70%)]
                        "
                    />

                    {/* FLASH */}
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
                            animate-[flashMove_1.4s_infinite_linear]
                        "
                    />

                    {/* LOGO */}
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

                {/* SHADOW */}
                <div
                    className="
                        mt-5
                        h-[18px]
                        w-[100px]
                        rounded-full
                        bg-[rgba(28,209,161,0.12)]
                        blur-[5px]
                        animate-[shadowAnim_2s_infinite_ease-in-out]
                    "
                />

                {/* LOADING TEXT */}
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

                {/* DOTS */}
                <div className="mt-4 flex gap-2">
                    {[0, 1, 2].map((_, index) => (
                        <div
                            key={index}
                            className="
                                h-[10px]
                                w-[10px]
                                rounded-full
                                bg-[#1cd1a1]
                                animate-[bounce_1.2s_infinite]
                            "
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* GREEN EXPAND */}
            <div
                className="
                    absolute
                    bottom-[-380px]
                    h-[280px]
                    w-[280px]
                    scale-0
                    rounded-full
                    bg-[#1cd1a1]
                    animate-[expandScreen_2s_forwards]
                    [animation-delay:5s]
                "
            />

            {/* FINAL SCREEN */}
            <div
                className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    bg-[#1cd1a1]
                    opacity-0
                    animate-[showFinal_1s_forwards]
                    [animation-delay:6s]
                "
            >
                <img
                    src="/M3.png"
                    alt="Menturo Logo"
                    className="mb-6 w-[90px] md:w-[130px]"
                />

                <h1
                    className="
                        text-[46px]
                        md:text-[80px]
                        font-black
                        tracking-[6px]
                        text-white
                    "
                >
                    MENTURO
                </h1>

                <p
                    className="
                        mt-3
                        px-5
                        text-center
                        text-[14px]
                        md:text-[20px]
                        tracking-[2px]
                        md:tracking-[4px]
                        text-white
                    "
                >
                    LEARN • PRACTICE • SUCCESS
                </p>
            </div>

            {/* TAILWIND CUSTOM ANIMATIONS */}
            <style>{`
                @keyframes showLetter {
                    0% {
                        opacity: 0;
                        transform: translateY(70px) scale(.5);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes hideText {
                    to {
                        opacity: 0;
                        transform: scale(1.3);
                    }
                }

                @keyframes showLogo {
                    from {
                        opacity: 0;
                        transform: scale(.4);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes flashMove {
                    from {
                        left: -120%;
                    }
                    to {
                        left: 180%;
                    }
                }

                @keyframes floatLogo {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-14px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }

                @keyframes shadowAnim {
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

                @keyframes bounce {
                    0%,100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-9px);
                    }
                }

                @keyframes expandScreen {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(3);
                    }
                    100% {
                        transform: scale(12);
                    }
                }

                @keyframes showFinal {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}