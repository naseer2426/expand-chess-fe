import { useEffect, useState } from "react"

export const SECOND = 1000 //ms
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE

interface CountdownProps {
    totalDuration: number // time in ms
    on: boolean
    finishCallback?: () => void
}

export function Countdown({ totalDuration, on, finishCallback }: CountdownProps) {
    const [tickedMs, setTickedMs] = useState<number>(totalDuration)
    const [internalOn, setInternalOn] = useState<boolean>(false) // to maintain old state before change
    const [timeWhenOn, setTimeWhenOn] = useState<number>(-1)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

    useEffect(() => {
        setTickedMs(totalDuration)
    }, [totalDuration])

    useEffect(() => {
        if (!internalOn && on) { // prop changing from false to true
            const nowMs = Date.now()
            setTimeWhenOn(nowMs)
            setInternalOn(on)
        }
        if (internalOn && !on) { // prop changing from true to false
            if (!intervalId) {
                return
            }
            setInternalOn(on)
            clearInterval(intervalId)
        }
    }, [on])

    useEffect(() => {
        if (!on || timeWhenOn == -1) {
            return
        }
        if (intervalId) {
            clearInterval(intervalId)
        }
        setIntervalId(setInterval(() => {
            const nowMs = Date.now();
            const passed = nowMs - timeWhenOn
            setTickedMs(tickedMs - passed)
        }, 300))
    }, [timeWhenOn])

    const h = Math.trunc(tickedMs / HOUR)
    const m = Math.trunc((tickedMs - h * HOUR) / MINUTE)
    const s = Math.trunc((tickedMs - h * HOUR - m * MINUTE) / SECOND)
    return (
        <>
            <div className="border-2 p-2">
                {tickedMs > 59 * MINUTE && `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
                {tickedMs < 59 * MINUTE && `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
            </div>
        </>
    )
}
