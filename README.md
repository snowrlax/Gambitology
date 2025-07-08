# Gambitology MVP Development Roadmap

**Gambitology** is a SaaS platform for learning chess gambits and opening traps through interactive, error-checked move-by-move training. This roadmap outlines the development of a Minimum Viable Product (MVP) to compete with Chessreps.

---

## MVP Goal

Build a functional chess gambit trainer where users can:
- Practice gambit lines move-by-move
- Get immediate feedback on incorrect moves
- Track basic progress
- Authors can create and manage gambit content

**Target Timeline**: 6-8 weeks

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, react-chessboard, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: MongoDB
- **Chess Logic**: chess.js for move validation
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Project Setup & Authentication
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS and basic styling
- [ ] Configure MongoDB and Prisma
- [ ] Implement simplified Prisma schema
- [ ] Set up NextAuth.js with email/password authentication
- [ ] Create basic layout and navigation
- [ ] Set up protected routes

### Week 2: Core Models & Database
- [ ] Implement Tenant, User, Gambit, Line, Move models
- [ ] Create database seed scripts with sample gambits
- [ ] Set up basic API routes for CRUD operations
- [ ] Implement multi-tenancy logic
- [ ] Create user registration and login flows
- [ ] Set up role-based access control (USER, AUTHOR, ADMIN)

**Deliverable**: Users can register, login, and access a multi-tenant dashboard

---

## Phase 2: Authoring System (Week 3-4)

### Week 3: Gambit Management
- [ ] Create gambit listing page
- [ ] Implement gambit creation form
- [ ] Add gambit editing functionality
- [ ] Create line management interface
- [ ] Set up basic gambit search and filtering
- [ ] Implement publish/unpublish functionality

### Week 4: Move Input System
- [ ] Integrate react-chessboard for move input
- [ ] Create move sequence input interface
- [ ] Implement FEN position tracking
- [ ] Add move validation using chess.js
- [ ] Create simple PGN import functionality
- [ ] Set up move tree storage and retrieval

**Deliverable**: Authors can create gambits with move sequences

---

## Phase 3: Training Engine (Week 5-6)

### Week 5: Interactive Trainer
- [ ] Create training interface with react-chessboard
- [ ] Implement move-by-move validation
- [ ] Add error handling for incorrect moves
- [ ] Create move progression logic
- [ ] Add engine response moves
- [ ] Implement basic UI feedback (success/error states)

### Week 6: Progress Tracking
- [ ] Create UserProgress model integration
- [ ] Track correct/incorrect moves
- [ ] Implement basic statistics display
- [ ] Add training session completion
- [ ] Create progress dashboard
- [ ] Set up line completion tracking

**Deliverable**: Users can practice gambit lines with real-time feedback

---

## Phase 4: Polish & Launch (Week 7-8)

### Week 7: UI/UX Polish
- [ ] Improve responsive design
- [ ] Add loading states and error boundaries
- [ ] Implement toast notifications
- [ ] Create onboarding flow
- [ ] Add keyboard shortcuts for training
- [ ] Optimize performance and bundle size

### Week 8: Testing & Deployment
- [ ] Write unit tests for core functionality
- [ ] Set up E2E testing for critical paths
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Deploy to Vercel
- [ ] Create documentation
- [ ] Beta testing with initial users

**Deliverable**: Production-ready MVP deployed and accessible

---

## Key Features for MVP

### Core Training Features
- **Interactive Board**: Use react-chessboard for move input
- **Move Validation**: chess.js validates legal moves and checks against stored lines
- **Error Feedback**: Immediate notification when user deviates from line
- **Progress Tracking**: Simple statistics on attempts and accuracy

### Authoring Features
- **Gambit Creation**: Form-based gambit and line creation
- **Move Input**: Manual move entry with position validation
- **Line Management**: Create and edit training sequences
- **Publishing**: Control which gambits are available to users

### User Management
- **Multi-Tenancy**: Support for multiple organizations/clubs
- **Role-Based Access**: USER, AUTHOR, ADMIN permissions
- **Basic Authentication**: Email/password login

---

## Essential Components

### 1. Training Interface
```typescript
// Core training logic
function onDrop(source: string, target: string) {
  const move = game.current.move({from: source, to: target});
  if (!move) return false; // Illegal move

  if (move.san !== expectedMove.san) {
    toast.error("That's not in the gambit line!");
    game.current.undo();
    return false;
  }
  
  // Progress to next move
  setMoveIndex(i => i + 1);
  return true;
}
```

### 2. Data Structure
```typescript
// Simplified move tree structure
interface Move {
  id: string;
  san: string;    // "Nf3"
  uci: string;    // "g1f3"
  fenAfter: string;
  parentId?: string;
  children: Move[];
}
```

### 3. API Routes
- `GET /api/gambits` - List gambits
- `POST /api/gambits` - Create gambit
- `GET /api/gambits/[id]/lines` - Get gambit lines
- `POST /api/training/progress` - Update user progress

---

## Success Metrics

- [ ] Users can complete a full gambit line without errors
- [ ] Authors can create and publish new gambits
- [ ] System tracks user progress accurately
- [ ] Application is responsive and performs well
- [ ] Multi-tenancy works correctly
- [ ] Error handling provides good user experience

---

## Post-MVP Enhancements

Once MVP is validated:
- **Advanced Analytics**: Detailed progress tracking and spaced repetition
- **Subscription Billing**: Stripe integration for monetization
- **Mobile Optimization**: PWA or React Native app
- **Import/Export**: PGN import/export functionality
- **Community Features**: Sharing and rating gambits
- **Advanced Training**: Branching scenarios and trap detection

---

## Getting Started

1. **Environment Setup**
   ```bash
   npx create-next-app@latest gambitology --typescript --tailwind
   cd gambitology
   npm install prisma @prisma/client next-auth react-chessboard chess.js
   ```

2. **Database Configuration**
   ```bash
   npx prisma init
   # Configure DATABASE_URL in .env
   npx prisma db push
   npx prisma generate
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Testing**
   - Create sample gambits and lines
   - Test training interface with various scenarios
   - Verify multi-tenancy isolation

---

## Resources

- [react-chessboard Documentation](https://github.com/Clariity/react-chessboard)
- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [NextAuth.js Guide](https://next-auth.js.org/getting-started/example)

---

*Focus on core functionality first. Build something that works, then iterate and improve.*