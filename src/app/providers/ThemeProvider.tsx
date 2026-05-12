'use client'   // ← THIS LINE IS REQUIRED

import { createContext, useContext, useEffect, useState } from "react";
import { themes, BRAND_COLOR } from "../config/theme";
import { themeSystem } from "../../system/themeEngine";
import type { ThemeSystemConfig } from "../../system/themeEngine"
import type { Theme } from "../config/theme";

type ThemeContextType = {
    theme: Theme
    setTheme: (t: Theme) => void
    system: ThemeSystemConfig
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("menturo")
    const system = themeSystem[theme]

    useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--brand', BRAND_COLOR)

        Object.entries(themes[theme]).forEach(([k, v]) => {
            root.style.setProperty(k, v)
        })
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, system }}>
            {children}
        </ThemeContext.Provider>
    )
}