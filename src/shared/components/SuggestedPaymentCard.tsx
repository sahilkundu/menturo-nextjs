'use client'

import { useRef } from 'react'

interface SuggestedPaymentCard {
    id: number
    badge: string
    title: string
    description: string
    price: number
    originalPrice: number
    features: string[]
    buttonText: string
}

interface SuggestedPaymentCardProps {
    cards: SuggestedPaymentCard[]
}

export default function SuggestedPaymentCard({
    cards,
}: SuggestedPaymentCardProps) {

    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {

        if (scrollRef.current) {

            scrollRef.current.scrollBy({
                left: -320,
                behavior: 'smooth',
            })
        }
    }

    const scrollRight = () => {

        if (scrollRef.current) {

            scrollRef.current.scrollBy({
                left: 320,
                behavior: 'smooth',
            })
        }
    }

    return (
        <div className="m-3 lg:col-span-2 space-y-6 overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 flex-wrap">

                <div>
                    <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-gray-900">
                        <span className="bg-indigo-600 w-2 h-7 rounded-full"></span>

                        🔥 Premium Test Series
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Choose your exam pack. One-time payment gets full access.
                    </p>
                </div>

                {/* MOBILE SLIDER ICONS */}
                <div className="flex gap-2 md:hidden">

                    <button
                        onClick={scrollLeft}
                        className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ‹
                    </button>

                    <button
                        onClick={scrollRight}
                        className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm text-lg font-bold active:scale-95 transition"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* CARDS */}
            <div
                ref={scrollRef}
                className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2"
            >

                {cards.map((card) => {

                    const discountPercent = Math.round(
                        ((card.originalPrice - card.price) / card.originalPrice) * 100
                    )

                    return (
                        <div
                            key={card.id}
                            className="min-w-[300px] sm:min-w-[340px] md:min-w-0 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
                        >

                            <div className="p-5">

                                <div className="flex justify-between items-start gap-2">

                                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full">
                                        {card.badge}
                                    </span>

                                    <span className="text-yellow-500 text-xs">
                                        ⭐⭐⭐⭐⭐
                                    </span>
                                </div>

                                <h4 className="text-xl font-black mt-4 text-gray-900">
                                    {card.title}
                                </h4>

                                <p className="text-gray-500 text-sm leading-relaxed mt-2">
                                    {card.description}
                                </p>

                                <div className="flex items-center gap-2 mt-5 flex-wrap">

                                    <span className="text-3xl font-black text-indigo-700">
                                        ₹{card.price}
                                    </span>

                                    <span className="text-gray-400 line-through text-sm">
                                        ₹{card.originalPrice}
                                    </span>

                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                                        {discountPercent}% OFF
                                    </span>
                                </div>

                                <div className="mt-5 space-y-2 text-xs text-gray-600">

                                    {card.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <span>✅</span>

                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-sm shadow-md transition">
                                    {card.buttonText}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}