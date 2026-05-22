'use client'
import { useRouter } from "next/navigation"


interface TestCardProps {
    slug?: string
    board?: string
    liveName?: string
    name?: string
    totalTest?: string
    totalPrice?: string
    offerPrice?: string
    demoInfo?: string
    demoHead?: string,
    btnName?: string
    img?: string
    btnBgColor?: string
    btnTxtColor?: string
}

export default function TestCard({
    slug,
    board = "SSC",
    liveName = "Live",
    name = "SSC CGL Titan Test Series",
    totalTest = "140+ Mocks",
    totalPrice = "₹899",
    offerPrice = "₹299",
    demoInfo = "1 Free Demo Mock",
    demoHead = "1 Demo Free",
    btnName = "Start Free Trial",
    img = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",

    btnBgColor = "bg-violet-50",
    btnTxtColor = "text-violet-700"

}: TestCardProps) {
    const router = useRouter()

    return (
        <>

            <div
                className="
                    min-w-[240px]
                    max-w-[240px]
                    rounded-[28px]
                    overflow-hidden
                    border
                    border-gray-100
                    bg-white
                    shadow-md
                    snap-start
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-xl
                "
            >

                {/* IMAGE */}
                <div className="relative">

                    <img
                        src={img}
                        className="w-full h-[130px] object-cover"
                    />

                    <div
                        className="
                            absolute
                            top-2
                            left-2
                            bg-gradient-to-r
                            from-amber-400
                            to-orange-500
                            text-white
                            text-[10px]
                            font-bold
                            px-2
                            py-1
                            rounded-full
                            shadow-md
                            flex
                            items-center
                            gap-1
                        "
                    >
                        <i className="fas fa-gift text-[9px]"></i>

                        {demoHead}
                    </div>

                </div>

                {/* CONTENT */}
                <div className="p-4">


                    {/* TOP */}
                    <div className="flex items-center justify-between mb-2">

                        <p
                            className={`
                            text-[11px]
                            font-extrabold
                            uppercase
                            tracking-wide

                            ${btnTxtColor}
                        `}
                        >
                            {board}
                        </p>

                        <span
                            className={`
        text-[10px]
        px-2
        py-1
        rounded-full
        font-semibold
        transition

        ${btnBgColor.replace("hover:", "")}
        ${btnTxtColor}
    `}
                        >
                            {liveName}
                        </span>

                    </div>

                    {/* TITLE */}
                    <h3
                        className="
                            font-bold
                            text-[15px]
                            leading-5
                            mb-2
                            text-gray-800
                        "
                    >
                        {name}
                    </h3>

                    {/* PRICE */}
                    <div className="flex items-center justify-between mb-2">

                        <p className="text-xs text-gray-400">
                            <i className="far fa-file-alt"></i> {totalTest}
                        </p>

                        <div className="flex items-center gap-1">

                            <span className="text-gray-400 line-through text-[11px]">
                                {totalPrice}
                            </span>

                            <h4
                                className={`
        font-black
        text-lg

        ${btnTxtColor}
    `}
                            >
                                {offerPrice}
                            </h4>

                        </div>

                    </div>

                    {/* DEMO */}
                    <div className="flex items-center gap-1 mt-1 mb-3">

                        <i className="fas fa-flask text-amber-500 text-[10px]"></i>

                        <span className="text-[10px] font-medium text-amber-700">
                            {demoInfo}
                        </span>

                    </div>

                    {/* BUTTON */}
                    <button
                        className={`
                            w-full
                            h-10
                            rounded-xl
                            text-sm
                            font-bold
                            transition
                            flex
                            items-center
                            justify-center
                            gap-1
                            cursor-pointer

                            ${btnBgColor}
                            ${btnTxtColor}
                        `}
                        onClick={() =>
                            router.push(`/${slug}`)
                        }
                    >
                        <i className="fas fa-bolt"></i>

                        {btnName}
                    </button>

                </div>

            </div>

        </>
    )
}