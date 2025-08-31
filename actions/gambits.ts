'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { Chess } from 'chess.js'

const prisma = new PrismaClient()

export interface GambitInput {
  name: string
  slug: string
  description?: string
  tenantId: string
  pgn: string
  published?: boolean
  side: string
}

export interface GambitWithLines {
  id: string
  name: string
  slug: string
  description: string | null
  tenantId: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  lines: {
    id: string
    title: string
    startingFEN: string
    moves: {
      id: string
      ply: number
      san: string
      uci: string
      fenAfter: string
    }[]
  }[]
}

/**
 * Parse PGN string and extract moves
 */
function parsePGN(pgn: string) {
  const chess = new Chess()
  
  try {
    chess.loadPgn(pgn)
    const history = chess.history({ verbose: true })
    
    const moves = []
    const tempChess = new Chess()
    
    for (let i = 0; i < history.length; i++) {
      const move = history[i]
      tempChess.move(move)
      
      moves.push({
        ply: i + 1,
        san: move.san,
        uci: move.from + move.to + (move.promotion || ''),
        fenAfter: tempChess.fen()
      })
    }
    
    return {
      success: true,
      moves,
      startingFEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }
  } catch (error) {
    return {
      success: false,
      error: `Invalid PGN: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Register a new gambit with PGN data
 */
export async function registerGambit(data: GambitInput) {
  try {
    // Validate tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId }
    })
    
    if (!tenant) {
      return {
        success: false,
        error: 'Tenant not found'
      }
    }
    
    // Check if slug already exists
    const existingGambit = await prisma.gambit.findUnique({
      where: { slug: data.slug }
    })
    
    if (existingGambit) {
      return {
        success: false,
        error: 'A gambit with this slug already exists'
      }
    }
    
    // Parse PGN
    const pgnResult = parsePGN(data.pgn)
    if (!pgnResult.success) {
      return {
        success: false,
        error: pgnResult.error
      }
    }
    
    // Create gambit with line and moves in a transaction
    const gambit = await prisma.$transaction(async (tx) => {
      // Create the gambit
      const newGambit = await tx.gambit.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          tenantId: data.tenantId,
          published: data.published || false
        }
      })
      
      // Create the main line
      const line = await tx.line.create({
        data: {
          gambitId: newGambit.id,
          title: `${data.name} - Main Line`,
          startingFEN: pgnResult.startingFEN!
        }
      })
      
      // Create all moves
      if (pgnResult.moves && pgnResult.moves.length > 0) {
        await tx.move.createMany({
          data: pgnResult.moves.map(move => ({
            lineId: line.id,
            ply: move.ply,
            san: move.san,
            uci: move.uci,
            fenAfter: move.fenAfter
          }))
        })
      }
      
      return newGambit
    })
    
    revalidatePath('/gambits')
    
    return {
      success: true,
      data: gambit
    }
  } catch (error) {
    console.error('Error registering gambit:', error)
    return {
      success: false,
      error: 'Failed to register gambit. Please try again.'
    }
  }
}

/**
 * Retrieve all gambits for a tenant
 */
export async function getGambits(tenantId: string): Promise<{
  success: boolean
  data?: GambitWithLines[]
  error?: string
}> {
  try {
    const gambits = await prisma.gambit.findMany({
      where: {
        tenantId: tenantId
      },
      include: {
        lines: {
          include: {
            moves: {
              orderBy: {
                ply: 'asc'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return {
      success: true,
      data: gambits
    }
  } catch (error) {
    console.error('Error retrieving gambits:', error)
    return {
      success: false,
      error: 'Failed to retrieve gambits. Please try again.'
    }
  }
}

/**
 * Retrieve a single gambit by ID
 */
export async function getGambitById(id: string): Promise<{
  success: boolean
  data?: GambitWithLines
  error?: string
}> {
  try {
    const gambit = await prisma.gambit.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            moves: {
              orderBy: {
                ply: 'asc'
              }
            }
          }
        }
      }
    })
    
    if (!gambit) {
      return {
        success: false,
        error: 'Gambit not found'
      }
    }
    
    return {
      success: true,
      data: gambit
    }
  } catch (error) {
    console.error('Error retrieving gambit:', error)
    return {
      success: false,
      error: 'Failed to retrieve gambit. Please try again.'
    }
  }
}

/**
 * Retrieve a single gambit by slug
 */
export async function getGambitBySlug(slug: string): Promise<{
  success: boolean
  data?: GambitWithLines
  error?: string
}> {
  try {
    const gambit = await prisma.gambit.findUnique({
      where: { slug },
      include: {
        lines: {
          include: {
            moves: {
              orderBy: {
                ply: 'asc'
              }
            }
          }
        }
      }
    })
    
    if (!gambit) {
      return {
        success: false,
        error: 'Gambit not found'
      }
    }
    
    return {
      success: true,
      data: gambit
    }
  } catch (error) {
    console.error('Error retrieving gambit:', error)
    return {
      success: false,
      error: 'Failed to retrieve gambit. Please try again.'
    }
  }
}