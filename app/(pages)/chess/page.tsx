'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Chess, Square } from "chess.js";
import { Chessboard } from 'react-chessboard'


const ChessGame = () => {

    const italianGamePGN = [
        "1. e4 e5",
        "2. Nf3 Nc6",
        "3. Bc4 Bc5",
        "4. c3 Nf6",
        "5. d4 exd4",
        "6. cxd4 Bb4+",
        "7. Nc3 d5",
        "8. exd5 Nxd5",
        "9. O-O O-O"
    ];

    // Parse PGN into individual moves
    const parsePGNMoves = (pgnArray: string[]) => {
        const moves: string[] = [];
        pgnArray.forEach(line => {
            // Remove move numbers and split by spaces
            const cleanLine = line.replace(/\d+\./g, '').trim();
            const lineMoves = cleanLine.split(/\s+/).filter(move => move.length > 0);
            moves.push(...lineMoves);
        });
        return moves;
    };

    const pgnMoves = parsePGNMoves(italianGamePGN);



    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    const [game, setGame] = useState(chessGame.fen());
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [expectedMove, setExpectedMove] = useState(pgnMoves[currentMoveIndex]);
    const [errorMessage, setErrorMessage] = useState('');


    // currentmoveindex is not updating correctly and is behind. fix that
    useEffect(() => {
        console.log("pgnMoves", pgnMoves);
        console.log("currentMoveIndex", currentMoveIndex);
        console.log("expectedMove", expectedMove);
    }, [pgnMoves, currentMoveIndex, expectedMove]);

    function makeAMove(move: any) {
        const result = chessGame.move(move);
        setGame(chessGame.fen());
        return result; // null if the move was illegal, the move object if the move was legal
    }

    // Validate if a move matches the expected PGN move
    function validatePGNMove(move: string): boolean {
        if (currentMoveIndex >= pgnMoves.length) {
            setErrorMessage("Game has reached the end of the predefined line.");
            return false;
        }

        const expectedMove = pgnMoves[currentMoveIndex];

        // Create a temporary game to test the move
        const tempGame = new Chess(chessGame.fen());
        try {
            const moveResult = tempGame.move(move);
            if (!moveResult) return false;

            // Check if the move notation matches the expected PGN move
            const moveNotation = moveResult.san;

            console.log(moveNotation === expectedMove, "moveNotation === expectedMove");

            if (moveNotation === expectedMove) {
                setErrorMessage('');
                return true;
            } else {
                setErrorMessage(`This doesn't follow the predefined game line. Expected: ${expectedMove}, but got: ${moveNotation}`);
                return false;
            }
        } catch {
            return false;
        }
    }

    // Make a move with PGN validation
    function makeValidatedMove(move: any): any {
        // First check if it's a legal chess move

        const tempGame = new Chess(chessGame.fen());
        const testMove = tempGame.move(move);
        console.log("testMove", testMove);
        if (!testMove) {
            setErrorMessage("Illegal chess move.");
            return null;
        }

        // Then validate against PGN
        if (!validatePGNMove(move)) {
            return null;
        }

        // If valid, make the actual move
        const result = chessGame.move(move);
        if (result) {
            const newMoveIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newMoveIndex);
            // Use the NEW index to set the next expected move
            setExpectedMove(newMoveIndex < pgnMoves.length ? pgnMoves[newMoveIndex] : '');
            setGame(chessGame.fen());
        }
        return result;
    }

    function makePGNMove() {
        if (currentMoveIndex >= pgnMoves.length) {
            setErrorMessage("Game has reached the end of the predefined line.");
            return;
        }

        if (chessGame.isGameOver() || chessGame.isDraw())
            return; // exit if the game is over

        const expectedMoveNotation = pgnMoves[currentMoveIndex];

        // Find the move that matches the expected PGN notation
        const possibleMoves = chessGame.moves({ verbose: true });

        console.log("possibleMoves for CPU:", possibleMoves.map(m => m.san));
        console.log("expectedMoveNotation:", expectedMoveNotation);

        const matchingMove = possibleMoves.find(move => move.san === expectedMoveNotation);

        console.log("matchingMove:", matchingMove);

        if (matchingMove) {
            const result = chessGame.move(matchingMove);
            if (result) {
                const newMoveIndex = currentMoveIndex + 1;
                setCurrentMoveIndex(newMoveIndex);
                // Use the NEW index to set the next expected move
                setExpectedMove(newMoveIndex < pgnMoves.length ? pgnMoves[newMoveIndex] : '');
                setGame(chessGame.fen());
                setErrorMessage('');
            }
        } else {
            setErrorMessage(`Cannot find the expected move: ${expectedMoveNotation}`);
        }
    }

    // get the move options for a square to show valid moves (filtered by PGN)
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

        // Filter moves to only show the one that matches the expected PGN move
        const expectedMove = currentMoveIndex < pgnMoves.length ? pgnMoves[currentMoveIndex] : null;
        const validMoves = expectedMove ? moves.filter(move => move.san === expectedMove) : [];

        if (validMoves.length === 0) {
            setOptionSquares({});
            return false;
        }

        // create a new object to store the option squares
        const newSquares: Record<string, React.CSSProperties> = {};

        // loop through the valid moves and set the option squares
        for (const move of validMoves) {
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

        // is normal move - validate with PGN
        const moveResult = makeValidatedMove({
            from: moveFrom,
            to: square,
            promotion: 'q'
        });

        if (!moveResult) {
            // if invalid, setMoveFrom and getMoveOptions
            const hasMoveOptions = getMoveOptions(square as Square);

            // if new piece, setMoveFrom, otherwise clear moveFrom
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }

        // make PGN-based cpu move after a short delay
        setTimeout(makePGNMove, 300);

        // clear moveFrom and optionSquares
        setMoveFrom('');
        setOptionSquares({});
    }

    function onDrop(sourceSquare: string, targetSquare: string) {

        // type narrow targetSquare potentially being null (e.g. if dropped off board)
        if (!targetSquare) {
            return false;
        }

        // try to make the move with PGN validation
        const move = makeValidatedMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });

        if (move) {
            // clear moveFrom and optionSquares
            setMoveFrom('');
            setOptionSquares({});

            // make PGN-based cpu move after a short delay
            setTimeout(makePGNMove, 500);

            // return true as the move was successful
            return true;
        } else {
            // return false as the move was not successful
            return false;
        }
    }

    return (
        <main className='flex flex-col items-center justify-center h-screen bg-secondary'>
            <div className="max-w-2xl w-full mx-auto space-y-4">
                {/* Game Status */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Chess Trainer - Italian Game</h2>
                    <p className="text-sm text-gray-600">
                        Move {Math.floor(currentMoveIndex / 2) + 1} - {currentMoveIndex % 2 === 0 ? 'White' : 'Black'} to move
                    </p>
                    {currentMoveIndex < pgnMoves.length && (
                        <p className="text-sm font-medium">
                            Expected move: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{pgnMoves[currentMoveIndex]}</span>
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                        {errorMessage}
                    </div>
                )}

                {/* Chess Board */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <Chessboard
                        position={game}
                        onSquareClick={onSquareClick}
                        onPieceDrop={onDrop}
                        customSquareStyles={optionSquares}
                        autoPromoteToQueen={true} // always promote to a queen for example simplicity
                    />
                </div>

                {/* Game Progress */}
                <div className="text-center text-sm text-gray-600">
                    Progress: {currentMoveIndex} / {pgnMoves.length} moves completed
                    {currentMoveIndex >= pgnMoves.length && (
                        <div className="mt-2 text-green-600 font-medium">
                            🎉 Congratulations! You've completed the Italian Game opening!
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default ChessGame