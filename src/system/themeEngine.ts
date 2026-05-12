import type { Theme } from "../app/config/theme"

export type ThemeSystemConfig = {
    layout: 'grid' | 'compact'
    showSidebar: boolean
    enableAnimations: boolean
    enableCharts: boolean
    loginStyle: 'image-left' | 'centered'
    buttonShape: 'rounded' | 'pill'
    cardStyle: 'flat' | 'elevated'
}

export const themeSystem: Record<Theme, ThemeSystemConfig> = {
    default: {
        layout: 'grid',
        showSidebar: true,
        enableAnimations: true,
        enableCharts: false,
        loginStyle: 'image-left',
        buttonShape: 'rounded',
        cardStyle: 'elevated',
    },
    dark: {
        layout: 'grid',
        showSidebar: true,
        enableAnimations: true,
        enableCharts: false,
        loginStyle: 'image-left',
        buttonShape: 'rounded',
        cardStyle: 'elevated',
    },
    menturo: {
        layout: 'grid',
        showSidebar: true,
        enableAnimations: true,
        enableCharts: false,
        loginStyle: 'image-left',
        buttonShape: 'rounded',
        cardStyle: 'elevated',
    }
}
