import '../index.css'; // Import your existing index.css
import { ReactNode } from 'react';
import { AppProviders } from './providers/AppProviders';

export const metadata = {
    title: 'Menturo',
    description: 'Enterprise-level app using Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                {/* Wrap the whole app with AppProviders (ThemeProvider inside it) */}
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}