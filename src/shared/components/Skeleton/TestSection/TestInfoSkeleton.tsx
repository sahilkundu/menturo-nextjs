'use client'

export default function TestInfoSkeleton() {

    return (

        <div className="bg-white rounded-2xl shadow-md border border-indigo-50 sticky top-6 overflow-hidden animate-pulse">

            {/* HEADER */}
            <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100">

                <div className="h-6 w-56 bg-indigo-100 rounded"></div>

                <div className="h-3 w-40 bg-indigo-100 rounded mt-2"></div>

            </div>

            {/* CONTENT */}
            <div className="p-5 max-h-[550px] overflow-y-auto">

                {/* WEEK SECTION */}
                <div className="mb-5">

                    <div className="flex items-center justify-between mb-4">

                        <div className="h-4 w-44 bg-gray-200 rounded"></div>

                        <div className="h-5 w-16 bg-green-100 rounded-full"></div>

                    </div>

                    <div className="space-y-3">

                        {Array.from({ length: 6 }).map((_, index) => (

                            <div
                                key={index}
                                className="flex justify-between items-center border-b pb-2"
                            >

                                <div className="space-y-2 w-full">

                                    <div className="h-4 w-[80%] bg-gray-200 rounded"></div>

                                    <div className="h-3 w-24 bg-gray-100 rounded"></div>

                                </div>

                                <div className="h-6 w-14 bg-indigo-100 rounded-full"></div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* FEATURES */}
                <div className="mb-4">

                    <div className="flex items-center gap-2 mb-4">

                        <div className="h-5 w-44 bg-gray-200 rounded"></div>

                        <div className="h-5 w-10 bg-gray-200 rounded-full"></div>

                    </div>

                    <div className="space-y-3">

                        {Array.from({ length: 5 }).map((_, index) => (

                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >

                                <div className="h-4 w-4 bg-indigo-100 rounded-full"></div>

                                <div className="h-4 w-[80%] bg-gray-200 rounded"></div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* DEVICE BOX */}
                <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border mt-3">

                    <div className="h-4 w-48 bg-indigo-100 rounded"></div>

                    <div className="h-3 w-full bg-gray-200 rounded mt-3"></div>

                    <div className="h-3 w-[70%] bg-gray-200 rounded mt-2"></div>

                    <div className="flex gap-2 mt-4 flex-wrap">

                        {Array.from({ length: 4 }).map((_, index) => (

                            <div
                                key={index}
                                className="h-5 w-16 bg-gray-200 rounded-full"
                            ></div>

                        ))}

                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <div className="bg-gray-50 p-3 border-t">

                <div className="h-3 w-[90%] mx-auto bg-gray-200 rounded"></div>

            </div>

        </div>
    )
}