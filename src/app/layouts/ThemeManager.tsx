'use client'  // ← this is mandatory for hooks
import { useTheme } from "../providers/ThemeProvider";
import { themes } from "../config/theme";

export default function ThemeManager() {
    const { setTheme } = useTheme();

    return (
        <div className="flex flex-wrap gap-2">
            {Object.keys(themes).map((t) => (
                <button key={t} onClick={() => setTheme(t as any)} className="btn-theme">
                    {t}
                </button>
            ))}
        </div>
    );
}
