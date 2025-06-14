'use client'

import React, { useState } from 'react'
import { Chess } from "chess.js";
import { Chessboard } from 'react-chessboard'


const ChessGame = () => {

    const [game, setGame] = useState(new Chess());

    function makeAMove(move: any) {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function makeRandomMove() {
        const possibleMoves = game.moves();
        console.log("possibleMoves", possibleMoves);
        
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return false;
        setTimeout(makeRandomMove, 200);
        return true;
    }

    return (
        <main className='flex flex-col items-center justify-center h-screen bg-secondary'>
            <div className="max-w-2xl w-full mx-auto">
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    autoPromoteToQueen={true} // always promote to a queen for example simplicity
                />
            </div>
        </main>
    )
}

export default ChessGame