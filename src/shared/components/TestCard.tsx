'use client'
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import Spinner from "./Spinner"

interface TestCardProps {
    accees?: any
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
    access,
    slug,
    board,
    liveName,
    name,
    totalTest,
    totalPrice,
    offerPrice,
    demoInfo,
    demoHead,
    btnName,
    img,
    btnBgColor = "bg-violet-50",
    btnTxtColor = "text-violet-700"

}: TestCardProps) {
    const router = useRouter()
    console.log(access)
    const isFreeAccess = access?.isFree
    const demoTests = access?.demoTest?.length
    const isPaid = access?.isPaid
    const isExpired = access?.isExpired
    const [loading, setLoading] =
        useState(false)
    const formatTimestamp = (
        timestamp: number
    ) => {
        if (!timestamp) return null
        return new Intl.DateTimeFormat(
            navigator.language,
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        ).format(new Date(timestamp));
    };
    const date =
        formatTimestamp(
            access?.validity?.to
        );
    if (isPaid) {

        // =========================================
        // PAID + EXPIRED
        // =========================================

        if (isExpired) {

            if (isFreeAccess) {
                demoInfo =
                    `Series expired on ${date} but special free access for you`;

                btnName =
                    `Attempt Tests`;
            }
            else {
                demoInfo =
                    `Series expired on ${date}`;
            }
        }

        // =========================================
        // PAID + NOT EXPIRED
        // =========================================

        else {

            demoInfo =
                `Series valid till ${date}`;

            btnName =
                `Attempt Tests`;
        }
    }

    else {

        // =========================================
        // NOT PAID + EXPIRED
        // =========================================

        if (isExpired) {

            if (isFreeAccess) {

                demoInfo =
                    `Series expired on ${date} but special free access for you`;

                btnName =
                    `Attempt Tests`;
            }
            else {

                demoInfo =
                    `Series expired on ${date}`;
            }
        }

        // =========================================
        // NOT PAID + NOT EXPIRED
        // =========================================

        else {

            // ONLY CHECK FREE ACCESS HERE

            if (isFreeAccess) {

                demoInfo =
                    `Special free access for you`;

                btnName =
                    `Attempt Tests`;
            }

            // ALL FALSE
            // DO NOTHING
        }
    }

    return (
        <>

            <div
                className="
                    min-w-[240px]
                    max-w-[240px]
                    flex-shrink-0
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

                    {/* <img
                        src={img}
                        className="w-full h-[130px] object-cover"
                    /> */}
                    <Image
                        src={img}
                        alt={name}
                        width={240}
                        height={130}
                        loading="lazy"
                        className="
        w-full
        h-[130px]
        object-contain
        bg-white
    "
                    />

                    <div
                        className={`
        absolute
        top-2
        left-2
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

        ${(
                                (isPaid && !isExpired) ||
                                (isPaid && isExpired && isFreeAccess) ||
                                (!isPaid && isFreeAccess)
                            )
                                ? "bg-gradient-to-r from-green-500 to-emerald-600"

                                : (
                                    isExpired
                                        ? "bg-gradient-to-r from-red-500 to-rose-600"
                                        : "bg-gradient-to-r from-amber-400 to-orange-500"
                                )
                            }
    `}
                    >
                        <i className="fas fa-gift text-[9px]"></i>

                        {
                            (
                                (isPaid && !isExpired) ||
                                (isPaid && isExpired && isFreeAccess) ||
                                (!isPaid && isFreeAccess)
                            )
                                ? "Full Access"

                                : (
                                    isExpired
                                        ? "Expired"
                                        : demoHead
                                )
                        }
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

                        {/* <span
                            className={`
        text-[10px]
        px-2
        py-1
        rounded-full
        font-semibold
        transition

        ${(
                                    (isPaid && !isExpired) ||
                                    (isPaid && isExpired && isFreeAccess) ||
                                    (!isPaid && isFreeAccess)
                                )
                                    ? "bg-green-500 text-white"

                                    : (
                                        isExpired
                                            ? "bg-red-500 text-white"
                                            : `${btnBgColor.replace("hover:", "")} ${btnTxtColor}`
                                    )
                                }
    `}
                        >
                            {
                                (
                                    (isPaid && !isExpired) ||
                                    (isPaid && isExpired && isFreeAccess) ||
                                    (!isPaid && isFreeAccess)
                                )
                                    ? "Full Access"

                                    : (
                                        isExpired
                                            ? "Expired"
                                            : liveName
                                    )
                            }
                        </span> */}

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

                    {/* <div className="flex items-center justify-between mb-2">

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

                    </div> */}
                    {/* PRICE */}
                    {
                        (
                            !isPaid && !isFreeAccess
                        ) ||
                            (
                                isPaid &&
                                isExpired &&
                                !isFreeAccess
                            )
                            ? (
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
                            )
                            : null
                    }

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
                        onClick={() => {

                            setLoading(true)

                            router.push(`/series/${slug}`)
                        }}
                    >
                        <i className="fas fa-bolt"></i>

                        {
                            loading
                                ? (
                                    <Spinner
                                        size={16}
                                    />
                                )
                                : (
                                    <>
                                        <i className="fas fa-bolt"></i>

                                        {btnName}
                                    </>
                                )
                        }
                    </button>

                </div>

            </div >

        </>
    )
}