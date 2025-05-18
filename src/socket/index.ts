import { io } from 'socket.io-client';

export const EVENT_JOIN_GAME = "joinGame"
export const EVENT_JOIN_GAME_RESP = "joinGameResp"
export const EVENT_MOVE = "move"

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    autoConnect: false
  });
