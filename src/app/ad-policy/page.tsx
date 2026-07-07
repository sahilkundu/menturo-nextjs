export default function AdPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 px-5 py-10">
            <section className="mx-auto w-full max-w-4xl rounded-xl border-l-8 border-[#4A3F77] bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                    <img
                        src="/M3.png"
                        alt="Menturo Logo"
                        className="h-auto w-12"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A3F77]">
                            Advertising Policy
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Last updated on July 6, 2026
                        </p>
                    </div>
                </div>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-[#4A3F77]">
                            Advertising on Menturo
                        </h2>
                        <p className="mt-3 leading-7">
                            Menturo may display third-party advertisements, sponsored
                            placements, or promotional content. Ads may be contextual or,
                            where permitted by consent and law, personalized using limited
                            website activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#4A3F77]">
                            Cookies and similar technologies
                        </h2>
                        <p className="mt-3 leading-7">
                            Advertising partners may use cookies, pixels, tags, service
                            workers, local storage, or similar technologies to deliver ads,
                            measure performance, prevent fraud, frequency-cap ads, and
                            estimate campaign results.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#4A3F77]">
                            Remarketing and audiences
                        </h2>
                        <p className="mt-3 leading-7">
                            If optional advertising consent is provided, Menturo may use
                            website activity such as page visits, test-series interest, and
                            purchase status to create advertising audiences on partner
                            platforms. These partners may then show Menturo ads on their own
                            services according to their policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#4A3F77]">
                            Data we do not share for advertising
                        </h2>
                        <p className="mt-3 leading-7">
                            Menturo does not share account passwords, payment credentials,
                            private test answers, OTPs, or account security tokens with
                            advertising partners for ad targeting.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#4A3F77]">
                            User choices
                        </h2>
                        <p className="mt-3 leading-7">
                            Users can decline optional analytics and advertising cookies in
                            the cookie notice. Browser settings, device privacy settings,
                            and partner opt-out tools may also limit personalized
                            advertising.
                        </p>
                    </section>
                </div>
            </section>
        </main>
    )
}
