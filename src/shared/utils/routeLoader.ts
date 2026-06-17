"use client"

export const ROUTE_LOADER_START_EVENT =
    "menturo-route-loader-start"

export const ROUTE_LOADER_STOP_EVENT =
    "menturo-route-loader-stop"

export const showRouteLoader = () => {
    if (typeof window === "undefined") {
        return
    }

    window.dispatchEvent(
        new Event(ROUTE_LOADER_START_EVENT)
    )
}

export const hideRouteLoader = () => {
    if (typeof window === "undefined") {
        return
    }

    window.dispatchEvent(
        new Event(ROUTE_LOADER_STOP_EVENT)
    )
}
