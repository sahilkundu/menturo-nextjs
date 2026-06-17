'use client'
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import Spinner from "./Spinner"
import { useTestSeriesStore } from "../store/testSeriesStore"

interface TestCardProps {
    accees?: any
    access?: any
    av?: boolean
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
    av,
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
    const isAvailable =
        av !== false
    let actionBtnName =
        btnName

    if (
        isAvailable &&
        !actionBtnName
    ) {
        actionBtnName =
            liveName === "Demo"
                ? "Start Demo"
                : "Buy Now"
    }

    const isFreeAccess = access?.isFree
    const {
        clearTests
    } = useTestSeriesStore()
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
    if (isAvailable && isPaid) {

        // =========================================
        // PAID + EXPIRED
        // =========================================

        if (isExpired) {

            if (isFreeAccess) {
                demoInfo =
                    `Series expired on ${date} but special free access for you`;

                actionBtnName =
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

            actionBtnName =
                `Attempt Tests`;
        }
    }

    else if (isAvailable) {

        // =========================================
        // NOT PAID + EXPIRED
        // =========================================

        if (isExpired) {

            if (isFreeAccess) {

                demoInfo =
                    `Series expired on ${date} but special free access for you`;

                actionBtnName =
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

                actionBtnName =
                    `Attempt Tests`;
            }

            // ALL FALSE
            // DO NOTHING
        }
    }

    return (
        <>

            <div
                className={`
                    group
                    relative
                    flex-shrink-0
                    rounded-[24px]
                    overflow-hidden
                    border
                    bg-white
                    snap-start
                    transition-all
                    duration-500
                    ease-out
                    before:absolute
                    before:inset-x-4
                    before:-top-16
                    before:h-32
                    before:rounded-full
                    before:bg-[#4A3F77]/18
                    before:blur-3xl
                    before:transition-opacity
                    after:absolute
                    after:inset-0
                    after:pointer-events-none
                    after:rounded-[24px]
                    after:ring-1
                    after:ring-inset
                    ${isAvailable
                        ? `
                            border-[#4A3F77]/18
                            shadow-[0_18px_48px_rgba(74,63,119,0.16)]
                            hover:-translate-y-2
                            hover:border-[#4A3F77]/35
                            hover:shadow-[0_30px_72px_rgba(74,63,119,0.26)]
                            after:ring-white/80
                            before:opacity-100
                        `
                        : `
                            border-[#4A3F77]/12
                            shadow-[0_16px_42px_rgba(74,63,119,0.12)]
                            after:ring-white/80
                            before:opacity-70
                        `
                    }
                `}
            >

                {/* IMAGE */}
                <div className="relative p-3 pb-0">


                    <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#4A3F77_0%,#7C6BC6_42%,#FFB84D_100%)] p-[1px] shadow-[0_10px_22px_rgba(74,63,119,0.16),inset_0_1px_0_rgba(255,255,255,0.75)]">
                        <Image
                            src={img}
                            alt={name}
                            width={240}
                            height={180}
                            loading="lazy"
                            className="
                                h-[142px]
                                w-full
                                rounded-[19px]
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-[1.06]
                            "
                        />

                        <div className="absolute inset-[1px] rounded-[19px] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(74,63,119,0.02)_48%,rgba(20,16,39,0.30)_100%)]"></div>
                        <div className="absolute inset-x-4 top-0 h-px bg-white/70"></div>
                    </div>

                    <div
                        className={`
                            absolute
                            top-5
                            left-5
                            text-white
                            text-[10px]
                            font-black
                            px-2.5
                            py-1.5
                            rounded-full
                            shadow-lg
                            shadow-black/15
                            flex
                            items-center
                            gap-1.5
                            border
                            border-white/25
                            backdrop-blur-md

                            ${(
                                (isPaid && !isExpired) ||
                                (isPaid && isExpired && isFreeAccess) ||
                                (!isPaid && isFreeAccess)
                            )
                                ? "bg-[linear-gradient(135deg,#1f9d72,#0f7a5c)]"

                                : (
                                    isExpired
                                        ? "bg-[linear-gradient(135deg,#b42318,#7a271a)]"
                                        : "bg-[linear-gradient(135deg,#FFB84D,#E88923)]"
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
                <div className="relative p-4 pt-3">


                    {/* TOP */}
                    <div className="mb-2 flex items-center justify-between">

                        <p
                            className={`
                                inline-flex
                                max-w-full
                                items-center
                                gap-1
                                rounded-full
                                border
                                border-[#4A3F77]/12
                                bg-[#F3F0FF]
                                px-2
                                py-1
                                text-[9px]
                                font-black
                                uppercase
                                text-[#4A3F77]
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                            `}
                        >
                            <i className="fas fa-crown text-[8px] text-[#F2A93B]"></i>
                            {board}
                        </p>

                        <span className="rounded-full border border-[#F59E0B]/30 bg-[#FFF7D6] px-2 py-1 text-[9px] font-black uppercase text-[#A15C00] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                            Premium
                        </span>
                    </div>

                    {/* TITLE */}
                    <h3
                        className="
                            min-h-[40px]
                            font-black
                            text-[15.5px]
                            leading-[1.28]
                            mb-3
                            text-[#171426]
                            line-clamp-2
                        "
                    >
                        {name}
                    </h3>
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
                                <div className="mb-3 flex items-center justify-between rounded-[18px] border border-[#D9D6F0] bg-[linear-gradient(135deg,#F7F5FF_0%,#ECFEFF_50%,#FFF7ED_100%)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">

                                    <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0F766E]">
                                        <i className="far fa-file-alt text-[#0891B2]"></i> {totalTest}
                                    </p>

                                    <div className="flex items-center gap-1">

                                        <span className="text-[#E11D48] line-through text-[11px] font-bold">
                                            {totalPrice}
                                        </span>

                                        <h4
                                            className={`
                                                font-black
                                                text-lg
                                                leading-none
                                                text-[#16A34A]
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
                    <div className="mb-4 flex min-h-[34px] items-start gap-2 rounded-[18px] border border-[#BAE6FD] bg-[linear-gradient(135deg,#ECFEFF_0%,#F5F3FF_55%,#FFF7ED_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">

                        <span className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-[#06B6D4]/12">
                            <i className="fas fa-flask text-[8px] text-[#0891B2]"></i>
                        </span>

                        <span className="text-[10px] font-extrabold leading-4 text-[#6D28D9]">
                            {demoInfo}
                        </span>

                    </div>

                    {/* BUTTON */}
                    <button
                        className={`
                            w-full
                            h-11
                            rounded-[16px]
                            text-sm
                            font-black
                            tracking-[0.01em]
                            transition-all
                            duration-300
                            flex
                            items-center
                            justify-center
                            gap-2
                            active:scale-[0.98]
                            ${isAvailable
                                ? 'cursor-pointer border border-white/15 bg-[#4A3F77] text-white shadow-[0_14px_28px_rgba(74,63,119,0.34),inset_0_1px_0_rgba(255,255,255,0.24)] hover:bg-[#3D3466] hover:shadow-[0_18px_38px_rgba(74,63,119,0.46),inset_0_1px_0_rgba(255,255,255,0.28)]'
                                : 'cursor-not-allowed border border-[#D7D2E8] bg-[#F3F1FA] text-[#8D86A9] shadow-none'
                            }
                        `}
                        disabled={!isAvailable || loading}
                        style={{
                            cursor: !isAvailable
                                ? "not-allowed"
                                : undefined
                        }}
                        onClick={() => {
                            if (!isAvailable) {
                                return
                            }

                            clearTests()
                            setLoading(true)

                            router.push(`/series/${slug}`)
                        }}
                    >
                        {
                            loading
                                ? (
                                    <Spinner
                                        size={16}
                                    />
                                )
                                : (
                                    <>
                                        <i className={`fas ${isAvailable ? 'fa-bolt' : 'fa-lock'} text-[12px]`}></i>

                                        {actionBtnName}
                                    </>
                                )
                        }
                    </button>

                </div>

            </div >

        </>
    )
}
