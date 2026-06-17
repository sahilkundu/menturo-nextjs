import { useTheme } from '../..../ThemeProvider'

const Button = () => {
    const { theme } = useTheme();
    return <button
        style={{ background: theme.primary, color: theme.text }}>Click Me
    </button>
}
