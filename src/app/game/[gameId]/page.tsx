'use client'

import { Chessboard } from "react-chessboard-expandable";
import { useEffect, useState } from "react";
import { Chess, Move } from "chessjs-expandable"
import { socket } from "@/api/socket"
export default function GamePage() {
    const [chess, setChess] = useState<Chess>(new Chess(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        4,
        2,
        { x: 2, y: 2 },
        { x: 2, y: 2 }
    ))

    useEffect(() => {
        const onMove = (move: string) => {
            console.log("move", move)
            console.log(chess.getCurrentFen())
            const chessCopy = chess.new()
            const valid = chessCopy.moveFromNotation(move)
            if (valid) {
                setChess(chessCopy)
            } else {
                console.log("invalid move")
            }
        }

        socket.connect()
        socket.on("connect", () => {
            console.log("connected")
        })
        socket.on("move", onMove)
        return () => {
            socket.off("move", onMove)
        }
    }, [chess])
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
                            socket.emit("move", notation)
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
