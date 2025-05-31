import { Game } from "@/chess/entities";

export type JoinGame = {
    gameId: string
    clientId: string
}

export type SyncGame =
  | {
      error: string;
      game: null;
    }
  | {
      error: null;
      game: Game;
    };

export type SyncMove = {
    move: string;
    gameId: string;
    moveNumber: number;
  };
