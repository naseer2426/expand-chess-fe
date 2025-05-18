"use client"

import { useIdStore } from "@/store/id"
import { useEffect } from "react"

export default function GameLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const deviceId = useIdStore((state) => state.deviceId)
    useEffect(() => {
        // doing it here because I want to make sure deviceId is available for 
        // all children from the moment they are mounted
        if (!deviceId) {
            useIdStore.getState().initializeDeviceId()
        }
    }, [deviceId])
    return (
        <>
            {deviceId && children}
        </>
    )
}
