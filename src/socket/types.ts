import { GameStatus } from 'chessjs-expandable';

export const GameStatusNotStarted = 'NOT_STARTED'

// not started is only something I need to worry about in the backend so I am not adding it in the chessjs-expandable package
export type BackendGameStatus = GameStatus | 'NOT_STARTED' 

export type JoinGame = {
    gameId: string
    clientId: string
}


export type ExtendConfig ={
    horizontalAddUnit: {x:number, y:number}
    verticalAddUnit: {x:number, y:number}
    horizontalExtendLimit: number
    verticalExtendLimit: number
}

export type GameState = {
    fen:string
    gameStatus: BackendGameStatus
    extendConfig:ExtendConfig
    // TODO: extend for clock state later
}

export type JoinGameResp = {
    error:string
    gameState:null
} | {
    error:null
    gameState: GameState
}

export type Move = {
    move:string
    gameId:string
}
