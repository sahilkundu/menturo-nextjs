"use client"

export const TEST_ACTION_LOADER_SHOW_EVENT =
    "menturo-test-action-loader-show"

export const TEST_ACTION_LOADER_HIDE_EVENT =
    "menturo-test-action-loader-hide"

export type TestActionLoaderDetail = {
    message: string
}

export const showTestActionLoader = (
    message: string
) => {
    if (typeof window === "undefined") {
        return
    }

    window.dispatchEvent(
        new CustomEvent<TestActionLoaderDetail>(
            TEST_ACTION_LOADER_SHOW_EVENT,
            {
                detail: {
                    message
                }
            }
        )
    )
}

export const hideTestActionLoader = () => {
    if (typeof window === "undefined") {
        return
    }

    window.dispatchEvent(
        new Event(TEST_ACTION_LOADER_HIDE_EVENT)
    )
}
