'use client';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { useIdStore } from '@/store/id';
import { useEffect } from 'react';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const deviceId = useIdStore((state) => state.deviceId);
    useEffect(() => {
        // doing it here because I want to make sure deviceId is available for
        // all children from the moment they are mounted
        if (!deviceId) {
            useIdStore.getState().initializeDeviceId();
        }
    }, [deviceId]);
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#2B1B17]`}
            >
                {deviceId && children}
                <Toaster />
            </body>
        </html>
    );
}
