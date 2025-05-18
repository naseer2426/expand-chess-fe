'use client'

import { Chessboard } from "react-chessboard-expandable";
import { useEffect, useState } from "react";
import { Chess, GameStatus } from "chessjs-expandable"
import { useIdStore } from "@/store/id";
import { EVENT_JOIN_GAME, EVENT_JOIN_GAME_RESP, socket } from "@/socket";
import { useParams } from 'next/navigation';
import { GameStatusNotStarted, JoinGame, JoinGameResp } from "@/socket/types";
import { toast } from "sonner"

export default function GamePage() {
    const [chess, setChess] = useState<Chess>(new Chess(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        4,
        2,
        { x: 2, y: 2 },
        { x: 2, y: 2 }
    ))
    const params = useParams()
    const [message, setMessage] = useState<string>("connecting...")

    const deviceId = useIdStore((state) => state.deviceId)
    const gameId = params.gameId as string

    useEffect(() => {
        socket.connect()

        socket.on("connect", () => {
            socket.emit(EVENT_JOIN_GAME, { clientId: deviceId, gameId } as JoinGame)
        })

        socket.on(EVENT_JOIN_GAME_RESP, (resp: JoinGameResp) => {
            // TODO: handle this in a more design pretty way
            if (resp.error) {
                toast(resp.error)
                setMessage(resp.error)
                return
            }
            setChess(new Chess(
                resp.gameState!.fen,
                resp.gameState!.extendConfig.horizontalExtendLimit,
                resp.gameState!.extendConfig.verticalExtendLimit,
                resp.gameState!.extendConfig.horizontalAddUnit,
                resp.gameState!.extendConfig.verticalAddUnit,
            ))
            if (resp.gameState!.gameStatus == GameStatusNotStarted) {
                setMessage("waiting for opponent..")
                return
            }
            setMessage("") // it should show the chess board
        })
    }, [])

    // useEffect(() => {
    //     const onMove = (move: string) => {
    //         console.log("move", move)
    //         console.log(chess.getCurrentFen())
    //         const chessCopy = chess.new()
    //         const valid = chessCopy.moveFromNotation(move)
    //         if (valid) {
    //             setChess(chessCopy)
    //         } else {
    //             console.log("invalid move")
    //         }
    //     }
    //     socket.on("connect", () => {
    //         console.log("connected")
    //     })
    //     socket.on("move", onMove)
    //     return () => {
    //         socket.off("move", onMove)
    //     }
    // }, [chess])
    if (message) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <h1>{message}</h1>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex w-1/2 p-10">
                <Chessboard
                    id="defaultBoard"
                    boardOrientation="white"
                    modifiedFen={chess.getCurrentFen()}
                    onMove={(move) => {
                        const chessCopy = chess.new()
                        const valid = chessCopy.moveFromBoard({
                            moveType: move.type,
                            sourceSquare: move.sourceSquare,
                            targetSquare: move.targetSquare,
                            piece: move.piece,
                            expandLocation: move.expandLocation
                        })
                        if (valid) {
                            const moveHistory = chessCopy.getMoveHistory()
                            const notation = moveHistory[moveHistory.length - 1]
                            // socket.emit("move", notation)
                            setChess(chessCopy)
                            return true
                        }

                        return false
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
