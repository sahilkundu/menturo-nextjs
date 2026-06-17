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


            {/* DESKTOP LAYOUT */}
            <div className="h-full flex flex-col lg:flex-row relative z-10">

                {/* LEFT IMAGE (desktop only) */}


                {/* RIGHT CONTENT ALWAYS ABOVE */}
                <div className="w-full lg:w-full h-full overflow-y-auto flex">
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