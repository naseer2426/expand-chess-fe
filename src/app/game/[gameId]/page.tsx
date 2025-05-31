'use client';

import { Chessboard } from 'react-chessboard-expandable';
import { useEffect, useState } from 'react';
import { Chess, GameStatus } from 'chessjs-expandable';
import { useIdStore } from '@/store/id';
import {
    EVENT_CONNECT,
    EVENT_JOIN_GAME,
    EVENT_SYNC_GAME,
    EVENT_SYNC_MOVE,
    socket,
} from '@/socket';
import { useParams } from 'next/navigation';
import { JoinGame, SyncGame } from '@/socket/types';
import { toast } from 'sonner';
import { Game, GameStatusNotStarted, SyncMove } from '@/chess/entities';

type ClientInfo = {
    color: 'white' | 'black';
    type: 'player' | 'spectator';
};

export default function GamePage() {
    const [chess, setChess] = useState<Chess>(
        new Chess(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            4,
            2,
            { x: 2, y: 2 },
            { x: 2, y: 2 },
        ),
    );
    const [game, setGame] = useState<Game>();
    const [clientInfo, setClientInfo] = useState<ClientInfo>({
        type: 'spectator',
        color: 'white',
    });

    const params = useParams();
    const [message, setMessage] = useState<string>('connecting...');

    const deviceId = useIdStore((state) => state.deviceId);
    const gameId = params.gameId as string;

    useEffect(() => {
        socket.connect();
        const onConnect = () => {
            console.log(EVENT_CONNECT);
            socket.emit(EVENT_JOIN_GAME, {
                clientId: deviceId,
                gameId,
            } as JoinGame);
        };
        const onSync = (resp: SyncGame) => {
            console.log(EVENT_SYNC_GAME);
            // TODO: handle this in a more design pretty way
            if (resp.error != null) {
                toast(resp.error);
                setMessage(resp.error);
                return;
            }
            if (
                resp.game.gameStatus != GameStatusNotStarted &&
                resp.game.gameStatus != GameStatus.IN_PROGRESS
            ) {
                setMessage(resp.game.gameStatus);
                return;
            }
            setGame(resp.game);
            setChess(
                new Chess(
                    resp.game.currentFen,
                    resp.game.extendConfig.horizontalExtendLimit,
                    resp.game.extendConfig.verticalExtendLimit,
                    resp.game.extendConfig.horizontalAddUnit,
                    resp.game.extendConfig.verticalAddUnit,
                ),
            );
            if (deviceId == resp.game.whitePlayerId) {
                setClientInfo({ color: 'white', type: 'player' });
            } else if (deviceId == resp.game.blackPlayerId) {
                setClientInfo({ color: 'black', type: 'player' });
            } else {
                setClientInfo({ color: 'white', type: 'spectator' });
            }
            if (resp.game.gameStatus == GameStatusNotStarted) {
                setMessage('Waiting for opponent to join link....');
                return;
            }
            setMessage(''); // it should show the chess board
        };

        socket.on(EVENT_CONNECT, onConnect);
        socket.on(EVENT_SYNC_GAME, onSync);

        return () => {
            socket.off(EVENT_CONNECT, onConnect);
            socket.off(EVENT_SYNC_GAME, onSync);
        };
    }, [chess]);

    if (message) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <h1>{message}</h1>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex w-1/2 p-10">
                <Chessboard
                    id="defaultBoard"
                    boardOrientation={clientInfo.color}
                    modifiedFen={chess.getCurrentFen()}
                    onMove={(move) => {
                        if (game == null) {
                            return false;
                        }
                        if (clientInfo.type == 'spectator') {
                            return false;
                        }
                        if (chess.getTurn() !== clientInfo.color) {
                            return false;
                        }
                        const chessCopy = chess.new();
                        const valid = chessCopy.moveFromBoard({
                            moveType: move.type,
                            sourceSquare: move.sourceSquare,
                            targetSquare: move.targetSquare,
                            piece: move.piece,
                            expandLocation: move.expandLocation,
                        });
                        if (valid) {
                            const moveHistory = chessCopy.getMoveHistory();
                            const notation =
                                moveHistory[moveHistory.length - 1];
                            const move: SyncMove = {
                                move: notation,
                                gameId,
                                moveNumber: game.moveDetails.length + 1,
                            };
                            socket.emit(EVENT_SYNC_MOVE, move);
                            setChess(chessCopy);
                            return true;
                        }

                        return false;
                    }}
                    areArrowsAllowed={false}
                    arePremovesAllowed={false}
                    horizontalAddUnit={{ x: 2, y: 2 }}
                    verticalAddUnit={{ x: 2, y: 2 }}
                    horizontalExtendLimit={4}
                    verticalExtendLimit={2}
                />
            </div>
        </div>
    );
}
