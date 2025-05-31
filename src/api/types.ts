import { ExtendConfig } from "@/chess/entities"

export type CreateGameReq = {
    creatorId: string,
    randomColor: boolean,
    extendConfig: ExtendConfig,
    fixedColor?: 'black' | 'white',
}

export type CreateGameResp = 
| 
    {
        id:string
        error: null
    } 
|   {
        id: null,
        error:string
    }
