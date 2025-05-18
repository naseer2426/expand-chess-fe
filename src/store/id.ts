import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid';

interface IdStore {
    userId?: string
    deviceId: string
    setUserId: (userId: string) => void
    initializeDeviceId: () => void
}

export const useIdStore = create<IdStore>()(
    persist((set, get) => ({
        userId: undefined,
        deviceId: "",
        setUserId: (userId: string) => set({ userId }),
        initializeDeviceId: () => {
            if (!get().deviceId) {
                set({ deviceId: uuidv4() })
            }
        }
    }), {
        name: 'chesspance-id',
        storage: createJSONStorage(() => localStorage),
    })
)
