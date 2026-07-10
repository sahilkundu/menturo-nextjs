import type { Metadata } from "next"
import SeriesPageClient from "../../../shared/components/SeriesPageClient"
import { createPageMetadata } from "../../../shared/seo"

export const metadata: Metadata = createPageMetadata({
    title: "All Test Series",
    description: "All Test Series",
    path: "/series",
    keywords: [
        "all test series",
        "government exam test series",
        "Haryana CET test series",
        "HSSC test series",
        "previous year test series"
    ]
})

export default function SeriesPage() {
    return <SeriesPageClient />
}
