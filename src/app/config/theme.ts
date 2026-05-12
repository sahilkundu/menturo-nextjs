'use client'
export type Theme = 'default' | 'dark' | 'menturo'

export const BRAND_COLOR = '#1ABC7F'

/* ================= PALETTE LAYER ================= */

type Palette = {
    color1: string
    color2: string
    color3: string
    color4: string
    color5: string
    color6: string
    color7: string
    color8: string
}

const palettes: Record<Theme, Palette> = {
    default: {
        color1: '#232323',
        // color1: '#ffffff',
        color2: '#f8f5f2',
        color3: '#222525',
        // color4: '#078080',
        color4: BRAND_COLOR,
        color5: '#fffffe',
        color6: '#f45d48',
        // color6: BRAND_COLOR,
        color7: '#feefe8',
        color8: '#ffffff'
    },
    menturo: {
        color1: '#232323',
        // color1: '#ffffff',
        color2: '#ffffff',
        color3: '#222525',
        // color4: '#078080',
        color4: BRAND_COLOR,
        color5: '#fffffe',
        color6: '#1ABC7F',
        // color6: BRAND_COLOR,
        color7: '#1abc7e25',
        color8: '#ffffff'
    },


    dark: {
        color1: '#ffffff',
        color2: '#111111',
        color3: '#cccccc',
        color4: BRAND_COLOR,
        color5: '#1a1a1a',
        color6: '#000000',
        color7: '#0d0d0d',
        color8: '#e6e6e6'
    }
}

/* ================= COMMON TOKEN MAPPER ================= */

function buildCommonTokens(p: Palette): Record<string, string> {
    return {
        '--main': p.color5,
        '--h1-heading1': p.color1,
        '--h1-heading2': p.color3,
        '--paragraph': p.color3,
        '--stroke': p.color1,
        '--background1': p.color2,
        '--background2': p.color5,
        '--iconHighlight': p.color4,
        '--iconSecondary': p.color6,
        '--iconsTertiary': p.color2,
        '--cardHeading': p.color1,
        '--cardHeadline': p.color1,
        '--cardBackground1': p.color2,
        '--cardBackground2': p.color5,
        '--cardParagraph': p.color3,
        '--cardHighlight': p.color4,
        '--aboveImageTextHighlight': p.color6,
        '--cardTagBackground': p.color4,
        '--cardTagText': p.color5,
        '--buttonText': p.color1,
        '--buttonTextOpposite': p.color8,
        '--buttonBackground': p.color4,
        '--linksText': p.color4,
        '--formBackground': p.color7,
        '--formInput': p.color5,
        '--formLabelAndPlaceholder': p.color1,
        '--formButtonBackground': p.color6,
        '--formLinkText': p.color6,
        '--illustrationsTertiary': p.color2,
        '--illustrationsSecondary': p.color6,
    }
}

/* ================= FINAL THEMES OBJECT ================= */

export const themes: Record<Theme, Record<string, string>> =
    Object.fromEntries(
        Object.entries(palettes).map(([name, palette]) => [
            name,
            buildCommonTokens(palette),
        ])
    ) as Record<Theme, Record<string, string>>
