'use client'
import { ReactNode } from 'react';
import Image from '../../shared/components/Image';
import { useTheme } from "../../app/providers/ThemeProvider";

interface Props {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    const { system } = useTheme();
    const useDesktopImage = system.loginStyle === 'image-left';

    return (
        <div className="relative h-screen overflow-hidden">

            {/* BACKGROUND IMAGE ONLY FOR MOBILE */}
            {useDesktopImage && (
                <div className="absolute inset-0 lg:hidden">
                    <div className="w-full h-full blur-md scale-110">
                        <Image />
                    </div>

                    {/* dark overlay for readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}

            {/* DESKTOP LAYOUT */}
            <div className="h-full flex flex-col lg:flex-row relative z-10">

                {/* LEFT IMAGE (desktop only) */}
                {useDesktopImage && (
                    <div className="hidden lg:block lg:w-full h-full">
                        <Image />
                    </div>
                )}

                {/* RIGHT CONTENT ALWAYS ABOVE */}
                <div className="w-full lg:w-1/2 h-full overflow-y-auto flex">
                    <div className="w-full flex items-center justify-center min-h-full">
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}