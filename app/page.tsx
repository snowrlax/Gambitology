'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, Github, Twitter, Play, Users, Trophy, BookOpen, Star, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"

const chessOpenings = [
  {
    name: "Sicilian Defense",
    description: "Master the most popular opening in chess. Create imbalanced positions and fight for the initiative.",
    lines: 25,
    difficulty: "Advanced",
    image: "./images/placeholder-e8alj.png"
  },
  {
    name: "Queen's Gambit",
    description: "Control the center with classical principles. Perfect for positional players seeking strategic depth.",
    lines: 18,
    difficulty: "Intermediate",
    image: "./images/chess-queens-gambit.png"
  },
  {
    name: "King's Indian Defense",
    description: "Turn defense into attack with dynamic counterplay. Master the art of strategic patience.",
    lines: 22,
    difficulty: "Advanced",
    image: "./images/chess-board-kings-indian.png"
  },
  {
    name: "Italian Game",
    description: "Learn fundamental opening principles. Perfect introduction to center control and development.",
    lines: 12,
    difficulty: "Beginner",
    image: "./images/chess-italian-game.png"
  }
]

const testimonials = [
  // Row 1
  {
    name: "Magnus C.",
    username: "@magnuschess",
    avatar: "./images/chess-player-avatar.png",
    content: "This chess trainer helped me improve my opening repertoire significantly. The interactive lessons are fantastic!"
  },
  {
    name: "Hikaru N.",
    username: "@hikarunakamura",
    avatar: "./images/chess-streamer-avatar.png",
    content: "Finally, a chess training platform that makes learning openings actually fun. My viewers love it too!"
  },
  {
    name: "Anna R.",
    username: "@chessqueen",
    avatar: "./images/female-chess-player-avatar.png",
    content: "The spaced repetition system is genius. I've memorized more opening lines in a month than in years of study."
  },
  {
    name: "Garry K.",
    username: "@garryking",
    avatar: "./images/chess-grandmaster-avatar.png",
    content: "Excellent tool for both beginners and masters. The analysis depth is impressive."
  },
  {
    name: "Beth H.",
    username: "@bethharmony",
    avatar: "./images/chess-prodigy-avatar.png",
    content: "This platform revolutionized how I prepare for tournaments. Highly recommended!"
  },
  {
    name: "Fabiano C.",
    username: "@fabianocaruana",
    avatar: "./images/chess-player-avatar.png",
    content: "The opening preparation tools are world-class. Perfect for serious competitive players."
  },
  // Row 2
  {
    name: "Alexandra B.",
    username: "@alexchess",
    avatar: "./images/female-chess-player-avatar.png",
    content: "Love how intuitive the interface is. Makes studying complex variations actually enjoyable."
  },
  {
    name: "Daniel N.",
    username: "@danielking",
    avatar: "./images/chess-grandmaster-avatar.png",
    content: "The best chess training platform I've used. The progress tracking keeps me motivated."
  },
  {
    name: "Judit P.",
    username: "@juditpolgar",
    avatar: "./images/female-chess-player-avatar.png",
    content: "Incredible depth of analysis. This tool has become essential for my chess improvement."
  },
  {
    name: "Wesley S.",
    username: "@wesleyso",
    avatar: "./images/chess-player-avatar.png",
    content: "The interactive lessons make learning openings so much more effective than books."
  },
  {
    name: "Hou Y.",
    username: "@houyifan",
    avatar: "./images/female-chess-player-avatar.png",
    content: "Perfect for building a solid opening repertoire. The spaced repetition really works!"
  },
  {
    name: "Levon A.",
    username: "@levonaronian",
    avatar: "./images/chess-grandmaster-avatar.png",
    content: "This platform has everything a chess player needs to master openings systematically."
  },
  // Row 3
  {
    name: "Maxime V.",
    username: "@maximevachier",
    avatar: "./images/chess-player-avatar.png",
    content: "The quality of analysis rivals the best chess engines. Absolutely brilliant platform."
  },
  {
    name: "Koneru H.",
    username: "@konerhumpy",
    avatar: "./images/female-chess-player-avatar.png",
    content: "Finally found a tool that makes opening study systematic and fun. Game changer!"
  },
  {
    name: "Anish G.",
    username: "@anishgiri",
    avatar: "./images/chess-grandmaster-avatar.png",
    content: "The interactive approach to learning openings is revolutionary. Highly recommend!"
  },
  {
    name: "Kateryna L.",
    username: "@katerynalagno",
    avatar: "./images/female-chess-player-avatar.png",
    content: "This platform transformed my opening preparation. The results speak for themselves."
  },
  {
    name: "Ian N.",
    username: "@iannepo",
    avatar: "./images/chess-player-avatar.png",
    content: "Incredible tool for serious chess improvement. The lesson quality is outstanding."
  },
  {
    name: "Mariya M.",
    username: "@mariyamuzychuk",
    avatar: "./images/female-chess-player-avatar.png",
    content: "Perfect balance of theory and practice. This is how chess should be taught!"
  }
]

// Split testimonials into three rows
const testimonialRows = [
  testimonials.slice(0, 6),
  testimonials.slice(6, 12),
  testimonials.slice(12, 18)
]


const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Learn with hands-on practice and immediate feedback"
  },
  {
    icon: Users,
    title: "500,000+ Players",
    description: "Join a thriving community of chess enthusiasts"
  },
  {
    icon: Trophy,
    title: "Tournament Prep",
    description: "Prepare for competitions with grandmaster-level analysis"
  }
]

export default function ChessTrainerLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">♔</span>
            </div>
            <span className="font-bold text-xl">Gambitology</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#openings" className="text-gray-300 hover:text-white transition-colors">
              Openings
            </Link>
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Reviews
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">
              Start Training
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✓ Interactive Chess Training
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Master Your
                  <span className="block text-green-400 italic">Chess Openings</span>
                  Like a Pro
                </h1>
                <p className="text-xl text-gray-400 max-w-lg">
                  Master chess openings with interactive lessons and spaced repetition. 
                  Build your winning repertoire faster than ever.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-medium">
                  <Play className="w-5 h-5 mr-2" />
                  Start Training
                </Button>
                <Button size="lg" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                  View Openings
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
                    <feature.icon className="w-4 h-4 text-green-400" />
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Live Training
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-4">
                    <div className="grid grid-cols-8 gap-1 mb-4">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm ${
                            (Math.floor(i / 8) + i) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between items-center">
                        <span>Sicilian Defense - Najdorf Variation</span>
                        <span className="text-green-400">85% accuracy</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-green-400">12/25 lines mastered</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chess Openings Section */}
      <section id="openings" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              ✓ Opening Courses
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Master Every Opening
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From beginner-friendly classics to advanced theoretical lines. 
              Build your complete opening repertoire with interactive training.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {chessOpenings.map((opening, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors">
                          {opening.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {opening.lines} lines
                          </Badge>
                          <Badge 
                            className={`${
                              opening.difficulty === 'Beginner' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : opening.difficulty === 'Intermediate'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {opening.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="grid grid-cols-8 gap-0.5 mb-3">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-sm ${
                              (Math.floor(i / 8) + i) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <CardDescription className="text-gray-400">
                      {opening.description}
                    </CardDescription>
                    
                    <Button 
                      className="w-full bg-transparent border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black transition-all"
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              ✓ Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Loved by players worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See what the chess community is saying about Gambitology
            </p>
          </div>

          <div className="relative">
            {/* Blur overlays */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
            
            <div className="space-y-6 overflow-hidden py-2">
              {testimonialRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative">
                  <div 
                    className={`flex gap-6 ${
                      rowIndex % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'
                    }`}
                    style={{
                      width: 'fit-content',
                    }}
                  >
                    {/* Duplicate the row for seamless looping */}
                    {[...row, ...row].map((testimonial, index) => (
                      <motion.div
                        key={`${rowIndex}-${index}`}
                        className="flex-shrink-0 w-80"
                      >
                        <Card className="bg-gray-800/30 border-gray-700 h-[180px] p-0">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-3 mb-4">
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-green-500 text-black">
                                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate">{testimonial.name}</div>
                                <div className="text-sm text-gray-400 truncate">{testimonial.username}</div>
                              </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4 line-clamp-2">{testimonial.content}</p>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500/10 to-green-600/10 border-y border-green-500/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-bold">
              Master chess openings and build your winning repertoire today.
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-medium">
                Start Training
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                View on GitHub
              </Button>
            </div>
            
            <p className="text-gray-400 italic">
              Free to use. Open source.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">♔</span>
                </div>
                <span className="font-bold text-xl">Gambitology</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                Master chess openings with interactive training and spaced repetition. 
                Build your winning repertoire.
              </p>
              <div className="flex space-x-4">
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Features</Link>
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Openings</Link>
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Pricing</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">GitHub</Link>
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Discord</Link>
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Contact</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-gray-400 hover:text-white block transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              © 2025 Gambitology. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2 sm:mt-0">
              Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
