'use client'

import React, { useState, useRef } from 'react'
import { Chess, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function GambitLineCreator() {
  // Form state
  const [gambitName, setGambitName] = useState('')
  const [gambitSlug, setGambitSlug] = useState('')
  const [gambitDescription, setGambitDescription] = useState('')
  const [gambitSide, setGambitSide] = useState('white')
  const [lineTitle, setLineTitle] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  
  // Chess game state
  const chessGameRef = useRef(new Chess())
  const [game, setGame] = useState(chessGameRef.current.fen())
  const [moveFrom, setMoveFrom] = useState('')
  const [optionSquares, setOptionSquares] = useState({})
  const [moveHistory, setMoveHistory] = useState<Array<{ply: number, san: string, uci: string, fenAfter: string}>>([])
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  
  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    setGambitName(name)
    if (!gambitSlug || gambitSlug === generateSlug(gambitName)) {
      setGambitSlug(generateSlug(name))
    }
  }
  
  // Handle square click for move recording
  const onSquareClick = (square: string) => {
    const piece = chessGameRef.current.get(square as Square)
    
    // Piece clicked to move
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square)
      if (hasMoveOptions) {
        setMoveFrom(square)
      }
      return
    }

    // Square clicked to move to
    if (moveFrom) {
      const moves = chessGameRef.current.moves({
        square: moveFrom as Square,
        verbose: true
      })
      const foundMove = moves.find(m => m.from === moveFrom && m.to === square)

      // Not a valid move
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square as Square)
        setMoveFrom(hasMoveOptions ? square : '')
        return
      }

      // Valid move - make it
      const moveResult = makeAMove({
        from: moveFrom,
        to: square,
        promotion: 'q'
      })

      if (moveResult) {
        recordMove(moveResult)
      }
      
      setMoveFrom('')
      setOptionSquares({})
    }
  }
  
  // Get move options for highlighting
  function getMoveOptions(square: Square) {
    const moves = chessGameRef.current.moves({
      square,
      verbose: true
    })

    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: Record<string, React.CSSProperties> = {}

    for (const move of moves) {
      newSquares[move.to] = {
        background: chessGameRef.current.get(move.to) 
          ? 'radial-gradient(circle, rgba(255,0,0,.3) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)',
        borderRadius: '50%'
      }
    }

    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.6)'
    }

    setOptionSquares(newSquares)
    return true
  }

  // Make a move on the board
  function makeAMove(move: any) {
    try {
      const result = chessGameRef.current.move(move)
      setGame(chessGameRef.current.fen())
      return result
    } catch (error) {
      setMessage('Invalid move')
      setIsError(true)
      return null
    }
  }

  // Record move in history
  const recordMove = (moveResult: any) => {
    const newMove = {
      ply: moveHistory.length + 1,
      san: moveResult.san,
      uci: moveResult.from + moveResult.to + (moveResult.promotion || ''),
      fenAfter: chessGameRef.current.fen()
    }
    
    setMoveHistory([...moveHistory, newMove])
    setMessage(`Move ${moveResult.san} recorded`)
    setIsError(false)
  }

  // Handle piece drop for drag and drop
  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    })

    if (move) {
      recordMove(move)
      setMoveFrom('')
      setOptionSquares({})
      return true
    } else {
      setMessage('Invalid move')
      setIsError(true)
      return false
    }
  }
  
  // Reset the board and moves
  const resetBoard = () => {
    chessGameRef.current.reset()
    setGame(chessGameRef.current.fen())
    setMoveHistory([])
    setMoveFrom('')
    setOptionSquares({})
    setMessage('')
    setIsError(false)
  }
  
  // Undo last move
  const undoMove = () => {
    if (moveHistory.length === 0) return
    
    chessGameRef.current.reset()
    const movesToReplay = moveHistory.slice(0, -1)
    
    movesToReplay.forEach(move => {
      try {
        chessGameRef.current.move(move.san)
      } catch (error) {
        console.error('Error replaying move:', error)
      }
    })
    
    setGame(chessGameRef.current.fen())
    setMoveHistory(movesToReplay)
    setMoveFrom('')
    setOptionSquares({})
  }
  
  // Generate PGN from move history
  const generatePGN = () => {
    if (moveHistory.length === 0) return ''
    
    let pgn = ''
    moveHistory.forEach((move, index) => {
      if (index % 2 === 0) {
        pgn += `${Math.floor(index/2) + 1}. ${move.san} `
      } else {
        pgn += `${move.san} `
      }
    })
    
    return pgn.trim()
  }
  
  // Create gambit and line in database
  const createGambitLine = async (gambitData: any, lineData: any) => {
    console.log("gambitData", gambitData);
    console.log("lineData", lineData);
    try {
      // This would be your actual API call
      const response = await fetch('/api/admin/create-gambit-line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gambit: gambitData,
          line: lineData
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create gambit line')
      }
      
      return await response.json()
    } catch (error) {
      throw error
    }
  }
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setMessage('')
    setIsError(false)
    
    try {
      // Validate required fields
      if (!gambitName || !gambitSlug || !tenantId || !lineTitle) {
        setMessage('Please fill in all required fields')
        setIsError(true)
        return
      }
      
      if (moveHistory.length === 0) {
        setMessage('Please make some moves to create a line')
        setIsError(true)
        return
      }
      
      // Prepare gambit data
      const gambitData = {
        name: gambitName,
        slug: gambitSlug,
        description: gambitDescription,
        side: gambitSide,
        tenantId: tenantId,
        published: isPublished
      }
      
      // Prepare line data with moves
      const lineData = {
        title: lineTitle,
        startingFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: moveHistory
      }
      
      const result = await createGambitLine(gambitData, lineData)
      
      if (result.success) {
        setMessage('Gambit line created successfully!')
        setIsError(false)
        
        // Reset form
        setGambitName('')
        setGambitSlug('')
        setGambitDescription('')
        setGambitSide('white')
        setLineTitle('')
        setTenantId('')
        setIsPublished(false)
        resetBoard()
      } else {
        setMessage(result.error || 'Failed to create gambit line')
        setIsError(true)
      }
    } catch (error) {
      setMessage('An error occurred while creating the gambit line')
      setIsError(true)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gambit Line Creator</h1>
          <p className="text-gray-600">Create and record chess gambit lines for training</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Gambit & Line Details</CardTitle>
              <CardDescription>
                Enter the details for your gambit and the specific line you're creating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Gambit Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gambitName">Gambit Name *</Label>
                    <Input
                      id="gambitName"
                      value={gambitName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Italian Game, Queen's Gambit"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gambitSlug">Slug *</Label>
                    <Input
                      id="gambitSlug"
                      value={gambitSlug}
                      onChange={(e) => setGambitSlug(e.target.value)}
                      placeholder="e.g., italian-game, queens-gambit"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={gambitDescription}
                      onChange={(e) => setGambitDescription(e.target.value)}
                      placeholder="Describe the gambit..."
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="side">Playing Side *</Label>
                    <Select value={gambitSide} onValueChange={setGambitSide}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select side" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Line Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lineTitle">Line Title *</Label>
                    <Input
                      id="lineTitle"
                      value={lineTitle}
                      onChange={(e) => setLineTitle(e.target.value)}
                      placeholder="e.g., Main Line, Sharp Variation"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tenantId">Tenant ID *</Label>
                    <Input
                      id="tenantId"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      placeholder="Enter tenant ID"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      checked={isPublished}
                      onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || moveHistory.length === 0}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Gambit Line'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetBoard}
                    className="flex-1"
                  >
                    Reset Board
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Chessboard Section */}
          <Card>
            <CardHeader>
              <CardTitle>Record Moves</CardTitle>
              <CardDescription>
                Click on pieces to move them and record the line. Board orientation: {gambitSide}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Chessboard
                    position={game}
                    onSquareClick={onSquareClick}
                    onPieceDrop={onDrop}
                    customSquareStyles={optionSquares}
                    boardOrientation={gambitSide === 'white' ? 'white' : 'black'}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={undoMove}
                    disabled={moveHistory.length === 0}
                    size="sm"
                  >
                    Undo Move
                  </Button>
                  <Badge variant="secondary" className="ml-auto">
                    {moveHistory.length} moves
                  </Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Move History</h4>
                  <div className="font-mono text-sm text-gray-700 min-h-[60px] max-h-[120px] overflow-y-auto">
                    {moveHistory.length > 0 ? (
                      <div className="space-y-1">
                        {moveHistory.map((move, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-500 w-8">
                              {index % 2 === 0 ? `${Math.floor(index/2) + 1}.` : ''}
                            </span>
                            <span>{move.san}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No moves recorded yet</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Generated PGN</h4>
                  <div className="font-mono text-sm text-gray-700 min-h-[40px] break-all">
                    {generatePGN() || 'Make some moves to generate PGN'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Status Message */}
        {message && (
          <Alert className={`mt-6 ${isError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertDescription className={isError ? 'text-red-800' : 'text-green-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}