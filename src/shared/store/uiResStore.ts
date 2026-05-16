'use client'

import { create } from "zustand"

interface LayoutStoreProps {

    leftMobile: boolean
    leftSidebarOpen: boolean
    rightMobile: boolean

    rightSidebarOpen: boolean
    liveBubbleOpen: boolean,

    setLeftMobile: (value: boolean) => void
    setRightMobile: (value: boolean) => void

    setRightSidebarOpen: (value: boolean) => void
    setLeftSidebarOpen: (value: boolean) => void
    setLiveBubbleOpen: (value: boolean) => void
}

export const useLayoutStore = create<LayoutStoreProps>((set) => ({

    leftMobile: false,
    rightMobile: false,

    rightSidebarOpen: false,
    leftSidebarOpen: false,
    liveBubbleOpen: false,
    setLeftMobile: (value) =>
        set({
            leftMobile: value
        }),

    setRightMobile: (value) =>
        set({
            rightMobile: value
        }),


    setRightSidebarOpen: (value) =>
        set({
            rightSidebarOpen: value
        }),
    setLeftSidebarOpen: (value) =>
        set({
            leftSidebarOpen: value
        }),


    setLiveBubbleOpen: (value: boolean) =>
        set({
            liveBubbleOpen: value
        }),

}))