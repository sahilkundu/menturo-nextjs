
export default function TermsAndConditionsPage() {
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
                        Terms and Conditions
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Last updated on Jul 2, 2025
                </p>

                <p className="text-gray-700 mb-4">
                    For the purpose of these Terms and Conditions, the terms{" "}
                    <strong>"we", "us", and "our"</strong> shall mean{" "}
                    <strong>Menturo</strong>.
                </p>

                <p className="text-gray-700 mb-6">
                    The terms <strong>"you", "your", "user", and "visitor"</strong> refer
                    to any natural or legal person visiting our website and/or purchasing
                    from us.
                </p>

                <h2 className="text-xl font-semibold text-teal-500 mb-4">
                    Your use of the website and/or purchase from us are governed by the
                    following Terms and Conditions:
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        The content of the pages of this website is subject to change
                        without notice.
                    </li>

                    <li>
                        We shall not be liable for any loss or damage arising directly or
                        indirectly out of the decline of authorization for any transaction,
                        due to the cardholder having exceeded the preset limit agreed upon
                        by us and our acquiring bank from time to time.
                    </li>

                    <li>
                        Neither we nor any third parties provide any warranty or guarantee
                        as to the accuracy, timeliness, performance, completeness, or
                        suitability of the information and materials found or offered on
                        this website for any particular purpose. You acknowledge that such
                        information and materials may contain inaccuracies or errors, and we
                        expressly exclude liability for any such inaccuracies or errors to
                        the fullest extent permitted by law.
                    </li>

                    <li>
                        Your use of any information or materials on our website and/or
                        product pages is entirely at your own risk, for which we shall not
                        be liable. It shall be your responsibility to ensure that any
                        products, services, or information available through our website
                        meet your specific requirements.
                    </li>

                    <li>
                        This website contains material which is owned by or licensed to us.
                        This includes, but is not limited to, the design, layout, look,
                        appearance, and graphics. Reproduction is prohibited other than in
                        accordance with the copyright notice, which forms part of these
                        terms and conditions.
                    </li>

                    <li>
                        Unauthorized use of information provided by us shall give rise to a
                        claim for damages and/or be a criminal offense.
                    </li>

                    <li>
                        From time to time, our website may also include links to other
                        websites. These links are provided for your convenience to provide
                        further information.
                    </li>

                    <li>
                        You may not create a link to our website from another website or
                        document without prior written consent from{" "}
                        <strong>Menturo</strong>.
                    </li>

                    <li>
                        Any dispute arising out of the use of our website and/or purchases
                        is subject to the laws of India.
                    </li>
                </ul>

                <p className="mt-8 text-gray-600">
                    Menturo (© 2026)
                </p>
            </div>
        </div>
    );
}
