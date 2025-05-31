
import { GameStatus } from 'chessjs-expandable';

export const GameStatusNotStarted = 'NOT_STARTED'

// not started is only something I need to worry about in the backend so I am not adding it in the chessjs-expandable package
export type BackendGameStatus = GameStatus | 'NOT_STARTED' 



export type ExtendConfig ={
    horizontalAddUnit: {x:number, y:number}
    verticalAddUnit: {x:number, y:number}
    horizontalExtendLimit: number
    verticalExtendLimit: number
}

export enum GameType {
    OPEN = 'OPEN',
    PRIVATE = 'PRIVATE',
}

export type MoveDetail = {
    move: string;
    playedAtMs: number; // unix timestamp of when game move was played
};

export type Game = {
    id?: string;
    creatorId: string;
    creatorColor: 'black' | 'white' | 'random';
    whitePlayerId?: string; // could be user id for logged in user or devide id for non logged in user
    blackPlayerId?: string; // could be user id for logged in user or devide id for non logged in user
    gameType: GameType;
    gameStatus: BackendGameStatus;
    currentFen: string; // should contain everything to rebuild board state
    startTime?: number;
    extendConfig: ExtendConfig;
    moveDetails: MoveDetail[];
}

export type SyncMove = {
    move: string;
    gameId: string;
    moveNumber: number;
  };
