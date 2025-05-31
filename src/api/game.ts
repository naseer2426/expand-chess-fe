import { Game } from '@/chess/entities';
import axios from 'axios';
import { CreateGameReq, CreateGameResp } from './types';
import { tryCatch } from '@/utils/try-catch';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export async function createGame(req:CreateGameReq):Promise<CreateGameResp> {
    const resp = await tryCatch(axios.post<CreateGameResp>(`${API_URL}/game`,req))
    if (resp.error!=null) {
        // network related errors
        return {error:resp.error.message, id:null}
    }
    if (resp.data.data.error != null) {
        // backend related errors
        return {error:resp.data.data.error, id:null}
    }
    return {error:null,id:resp.data.data.id}
}
