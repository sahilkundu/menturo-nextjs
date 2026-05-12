'use client'
import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
// import {Auth}

interface Props { children: ReactNode }

export const AppProviders = ({ children }: Props) => {
    return (
        <ThemeProvider>
            {/* <AuthProvider> */}
            {/* <QueryProvider> */}
            {children}
            {/* </QueryProvider> */}
            {/* </AuthProvider> */}
        </ThemeProvider>
    );
};


