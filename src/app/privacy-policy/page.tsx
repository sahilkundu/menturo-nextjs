
export default function PrivacyPolicyPage() {
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
                        Privacy Policy
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Last updated on July 6, 2026
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        This privacy policy sets out how <strong>Menturo</strong> uses and
                        protects any information that you give when you visit this website
                        and/or agree to purchase from them.
                    </li>

                    <li>
                        We are committed to ensuring that your privacy is protected. Should
                        we ask you to provide certain information by which you can be
                        identified when using this website, then you can be assured that it
                        will only be used in accordance with this privacy statement.
                    </li>

                    <li>
                        We may change this policy from time to time by updating this page.
                        You should check this page periodically to ensure that you agree
                        with any changes.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-500 mt-8 mb-4">
                    We may collect the following information:
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        Contact information including email address and mobile number.
                    </li>

                    <li>
                        Website usage information such as page views, test series viewed,
                        search terms used on Menturo, purchase status, and typing-practice
                        interactions.
                    </li>

                    <li>
                        A first-party visitor identifier may be stored on your device to
                        recognize repeat visits, measure site usage, and improve content
                        recommendations. If you log in, this visitor identifier may be
                        associated with your account.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-500 mt-8 mb-4">
                    What we do with the information we gather:
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        We require this information to identify users and for security
                        purposes.
                    </li>

                    {/* <li>
                        We use behavioral information solely to protect users from fraud,
                        ensure account security, and identify suspicious activity.
                    </li> */}

                    <li>
                        We may periodically send promotional emails, special offers, or
                        other information that we think you may find interesting using the
                        email address you have provided.
                    </li>

                    <li>
                        We may contact you by email or phone. We may use the information to
                        customize the website according to your interests.
                    </li>

                    <li>
                        With your consent, we may use limited website activity to measure
                        advertising, improve recommendations, and create advertising
                        audiences through approved advertising partners.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-500 mt-8 mb-4">
                    Is your data secure?
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        We use end-to-end encryption to protect your personal information,
                        ensuring that no third party can access, misuse, or intercept your
                        data.
                    </li>

                    <li>
                        All data you share and any communications received over time are
                        secured using end-to-end encryption to ensure complete privacy and
                        protection.
                    </li>

                    <li>
                        We will not sell, distribute, or lease your personal information to
                        third parties unless we have your permission or are required by law
                        to do so.
                    </li>

                    <li>
                        If you believe that any information we are holding on you is
                        incorrect or incomplete, you can contact us through our support
                        system.
                    </li>

                    <li>
                        Users may request deletion of their data by contacting support.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-500 mt-8 mb-4">
                    How we use cookies
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        We use secure cookies for authentication, session management, fraud
                        prevention, and account security. Optional analytics and advertising
                        cookies are used only when you choose to allow them.
                    </li>

                    <li>
                        To avoid unnecessary storage growth, Menturo stores summarized
                        visitor profiles instead of retaining an unlimited raw log of every
                        interaction.
                    </li>

                    <li>
                        If Menturo enables third-party advertising, advertising partners may
                        use cookies or similar technologies to measure ad performance and,
                        where consent is required, personalize advertising. Users will be
                        offered the required consent choices before such advertising cookies
                        are used.
                    </li>

                    <li>
                        You may change browser cookie settings or contact support to request
                        deletion of account-linked personal data, subject to legal and
                        operational retention requirements.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-500 mt-8 mb-4">
                    Advertising and remarketing
                </h2>

                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>
                        Menturo may show advertising on its website and may use advertising
                        partners to measure performance or show Menturo ads on other
                        platforms.
                    </li>

                    <li>
                        Advertising partners may process limited technical and usage signals
                        such as page visits, device/browser information, and ad interaction
                        data according to their own policies.
                    </li>

                    <li>
                        Menturo does not sell account passwords, payment credentials, test
                        answers, or private account security data to advertising partners.
                    </li>
                </ul>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Collection and processing of this data is done in compliance with
                        the{" "}
                        <strong>
                            Digital Personal Data Protection Act, 2023 (DPDP Act),
                            Government of India
                        </strong>
                        .
                    </h3>
                </div>

                <p className="mt-8 text-gray-600">
                    Menturo (© 2026)
                </p>
            </div>
        </div>
    );
}
