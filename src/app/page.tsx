'use client';

import { createGame } from "@/api/game";
import { CreateGameReq } from "@/api/types";
import { Button } from "@/components/ui/button"
import { useIdStore } from '@/store/id';
import { useState } from "react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Home() {
    const deviceId = useIdStore((state) => state.deviceId);
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter();

    const onClick = async () => {
        setLoading(true)
        const req: CreateGameReq = {
            creatorId: deviceId,
            randomColor: true,
            extendConfig: {
                horizontalAddUnit: { x: 2, y: 2 },
                verticalAddUnit: { x: 2, y: 2 },
                horizontalExtendLimit: 4,
                verticalExtendLimit: 2
            }
        }
        const resp = await createGame(req)
        if (resp.error != null) {
            setLoading(false)
            toast(resp.error);
            return;
        }
        setLoading(false);
        router.push(`/game/${resp.id}`)
    }
    return (
        <main className="flex flex-col gap-5 items-center justify-center h-screen w-screen">
            <h1>{loading ? "Creating new game..." : "Expandable Chess"}</h1>
            <Button onClick={onClick} disabled={loading}>Create Game</Button>
        </main>
    );
}
