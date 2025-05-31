import { io } from 'socket.io-client';

export const EVENT_CONNECT = 'connect';
export const EVENT_JOIN_GAME = 'joinGame';
export const EVENT_SYNC_GAME = 'syncGame';
export const EVENT_SYNC_MOVE = 'syncMove';

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    autoConnect: false,
});
