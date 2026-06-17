
export default function CancellationAndRefundPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-5 py-10">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border-l-8 border-teal-500 p-8 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src="/M3.png"
                        alt="Menturo Logo"
                        className="w-12 h-auto"
                    />

                    <span className="text-3xl font-bold text-teal-500">
                        Cancellation and Refund
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Last updated on Jul 2, 2025
                </p>

                <p className="text-gray-700 mb-4">
                    <strong>Menturo</strong> provides digital services including online
                    test series and video-based test solutions.
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        Due to the nature of digital content, we do not offer any
                        cancellation or refund once a purchase is completed.
                    </li>

                    <li>
                        We offer high-quality digital products including online test series
                        and video-based learning. Due to the nature of our services, we do
                        not provide cancellations or refunds once a purchase is completed.
                    </li>

                    <li>
                        We encourage all users to review product details before purchasing.
                    </li>

                    <li>
                        If any candidate purchases a video course or test series and the
                        website becomes <strong>permanently inaccessible</strong>, then:
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>
                                <strong>100% refund</strong> if the purchase was made within the
                                last 15 days.
                            </li>

                            <li>
                                <strong>50% refund</strong> if the purchase was made between 15
                                and 40 days ago.
                            </li>

                            <li>
                                <strong>No refund</strong> after 40 days from the purchase date.
                            </li>
                        </ul>
                    </li>

                    <li>
                        However, if the purchased content has already been fully accessed or
                        completed at any point during this time, no refund will be
                        applicable under any condition.
                    </li>

                    <li>
                        Thank you for understanding and supporting our fair-use policy.
                    </li>
                </ul>

                <p className="mt-8 text-gray-600">
                    Menturo (© 2026)
                </p>
            </div>
        </div>
    );
}
