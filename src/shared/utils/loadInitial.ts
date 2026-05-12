import { FETCH_SERIES_PAGING, LOAD_SERIES_INITIAL, LOAD_TAG_SERIES, LOAD_TAGS } from "../../app/config/apiConfig";


// ================= GLOBAL =================
export const fetchHomeData = async () => {
    const res = await fetch(LOAD_SERIES_INITIAL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed home data");
    return res.json();
};

export const fetchSeriesPage = async (page: number) => {
    const res = await fetch(FETCH_SERIES_PAGING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page }),
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed series page");
    return res.json();
};

// ================= TAGS =================
export const fetchTags = async () => {
    const res = await fetch(LOAD_TAGS, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed tags");
    return res.json();
};

// ================= TAG SERIES =================
export const fetchTagSeries = async (tag: string, tagPage: number) => {
    const res = await fetch(LOAD_TAG_SERIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag, tagPage }),
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed tag series");
    return res.json();
};