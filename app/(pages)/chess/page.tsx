'use client'

import React, { useRef, useState } from 'react'
import { Chess, Square } from "chess.js";
import { Chessboard } from 'react-chessboard'


const ChessGame = () => {

    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    const [game, setGame] = useState(chessGame.fen());
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    function makeAMove(move: any) {
        const result = chessGame.move(move);
        setGame(chessGame.fen());
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function makeRandomMove() {
        const possibleMoves = chessGame.moves();
        console.log("possibleMoves", possibleMoves);

        if (chessGame.isGameOver() || chessGame.isDraw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    // get the move options for a square to show valid moves
    function getMoveOptions(square: Square) {
        // get the moves for the square
        const moves = chessGame.moves({
            square,
            verbose: true
        });

        // if no moves, clear the option squares
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        // create a new object to store the option squares
        const newSquares: Record<string, React.CSSProperties> = {};

        // loop through the moves and set the option squares
        for (const move of moves) {
            newSquares[move.to] = {
                background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                // smaller circle for moving
                borderRadius: '50%'
            };
        }

        // set the square clicked to move from to yellow
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.8)'
        };

        // set the option squares
        setOptionSquares(newSquares);

        // return true to indicate that there are move options
        return true;
    }

    function onSquareClick({
        square,
        piece
    }: any) {
        // piece clicked to move
        if (!moveFrom && piece) {
            // get the move options for the square
            const hasMoveOptions = getMoveOptions(square as Square);

            // if move options, set the moveFrom to the square
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }

        // square clicked to move to, check if valid move
        const moves = chessGame.moves({
            square: moveFrom as Square,
            verbose: true
        });
        const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

        // not a valid move
        if (!foundMove) {
            // check if clicked on new piece
            const hasMoveOptions = getMoveOptions(square as Square);

            // if new piece, setMoveFrom, otherwise clear moveFrom
            setMoveFrom(hasMoveOptions ? square : '');

            // return early
            return;
        }

        // is normal move
        try {
            chessGame.move({
                from: moveFrom,
                to: square,
                promotion: 'q'
            });
        } catch {
            // if invalid, setMoveFrom and getMoveOptions
            const hasMoveOptions = getMoveOptions(square as Square);

            // if new piece, setMoveFrom, otherwise clear moveFrom
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }

        // update the position state
        setGame(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 300);

        // clear moveFrom and optionSquares
        setMoveFrom('');
        setOptionSquares({});
    }

    function onDrop(sourceSquare: string, targetSquare: string) {

        // type narrow targetSquare potentially being null (e.g. if dropped off board)
        if (!targetSquare) {
            return false;
        }

        // try to make the move according to chess.js logic
        try {
            const move = makeAMove({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q", // always promote to a queen for example simplicity
            });

            // update the position state upon successful move to trigger a re-render of the chessboard
            setGame(chessGame.fen());

            // update the position state upon successful move to trigger a re-render of the chessboard
            setGame(chessGame.fen());

            // clear moveFrom and optionSquares
            setMoveFrom('');
            setOptionSquares({});

            // make random cpu move after a short delay
            setTimeout(makeRandomMove, 500);

            // return true as the move was successful
            return true;
        } catch {
            // return false as the move was not successful
            return false;
        }
    }

    return (
        <main className='flex flex-col items-center justify-center h-screen bg-secondary'>
            <div className="max-w-2xl w-full mx-auto">
                <Chessboard
                    position={game}
                    onSquareClick={onSquareClick}
                    onPieceDrop={onDrop}
                    autoPromoteToQueen={true} // always promote to a queen for example simplicity
                />
            </div>
        </main>
    )
}

export default ChessGame