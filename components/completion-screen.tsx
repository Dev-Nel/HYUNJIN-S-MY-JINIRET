"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, ArrowRight, Sparkles, Crown, Medal } from "lucide-react"
import { ConfettiCelebration } from "./confetti-celebration"

type CompletionScreenProps = {
  agentPhoto: string
  totalScore: number
  missionsCompleted: number
  boardNumber: number
  onClose: () => void
}

const getRank = (score: number, missions: number) => {
  const avgScore = score / Math.max(missions, 1)
  if (avgScore >= 85) return { title: "LEGENDARY SPY", icon: Crown, color: "text-yellow-400" }
  if (avgScore >= 70) return { title: "ELITE AGENT", icon: Medal, color: "text-primary" }
  if (avgScore >= 50) return { title: "FIELD OPERATIVE", icon: Star, color: "text-blue-400" }
  return { title: "RECRUIT", icon: Sparkles, color: "text-muted-foreground" }
}

export function CompletionScreen({
  agentPhoto,
  totalScore,
  missionsCompleted,
  boardNumber,
  onClose,
}: CompletionScreenProps) {
  const [showStats, setShowStats] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [showRank, setShowRank] = useState(false)

  const rank = getRank(totalScore, missionsCompleted)
  const RankIcon = rank.icon

  useEffect(() => {
    setShowStats(true)

    const duration = 1500
    const steps = 60
    const increment = totalScore / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= totalScore) {
        setDisplayScore(totalScore)
        clearInterval(timer)
        setTimeout(() => setShowRank(true), 300)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [totalScore])

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <ConfettiCelebration />

      <div className="relative max-w-lg w-full animate-in zoom-in-95 duration-500" style={{ animationDelay: "100ms" }}>
        <div className="bg-gradient-to-br from-primary/30 via-card to-primary/20 border-2 border-primary rounded-xl overflow-hidden shadow-[0_0_60px_rgba(234,179,8,0.3)]">
          <div className="relative bg-gradient-to-r from-primary/40 via-primary/30 to-primary/40 p-8 text-center overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: 4 + Math.random() * 8,
                    height: 4 + Math.random() * 8,
                    backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"][i % 4],
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>

            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg">
                <Trophy className="size-10 text-yellow-900" />
              </div>
            </div>

            <h2 className="text-3xl font-mono font-bold text-card-foreground tracking-wider animate-in fade-in duration-700">
              BOARD {boardNumber} COMPLETE!
            </h2>
            <p className="text-sm text-muted-foreground font-mono mt-2 flex items-center justify-center gap-2">
              <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              Agent Identity Confirmed
              <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            </p>
          </div>

          {/* Agent photo and stats */}
          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-lg opacity-50 blur-lg group-hover:opacity-75 transition-opacity animate-pulse" />

                {/* Photo frame */}
                <div className="relative p-3 shadow-2xl rounded-lg" style={{ backgroundColor: "#49111C" }}>
                  <div className="w-36 h-36 overflow-hidden rounded">
                    <img src={agentPhoto || "/placeholder.svg"} alt="Agent" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg border-2 border-red-700 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 ${
                showStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="bg-secondary/70 rounded-lg p-4 text-center border border-primary/30 hover:border-primary/60 transition-colors">
                <Star
                  className="size-7 text-yellow-400 mx-auto mb-2 animate-bounce"
                  style={{ animationDuration: "2s" }}
                />
                <p className="text-3xl font-mono font-bold text-card-foreground tabular-nums">{displayScore}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">TOTAL POINTS</p>
              </div>
              <div className="bg-secondary/70 rounded-lg p-4 text-center border border-primary/30 hover:border-primary/60 transition-colors">
                <Trophy
                  className="size-7 text-primary mx-auto mb-2 animate-bounce"
                  style={{ animationDelay: "0.5s", animationDuration: "2s" }}
                />
                <p className="text-3xl font-mono font-bold text-card-foreground">{missionsCompleted}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">MISSIONS</p>
              </div>
            </div>

            <div
              className={`text-center transition-all duration-500 ${
                showRank ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary via-secondary/80 to-secondary px-6 py-3 rounded-full border border-primary/50">
                <RankIcon className={`size-6 ${rank.color}`} />
                <span className={`font-mono font-bold text-lg ${rank.color}`}>{rank.title}</span>
                <RankIcon className={`size-6 ${rank.color}`} />
              </div>
            </div>

            <div className="text-center">
              <Badge className="bg-primary/20 text-primary border border-primary/50 font-mono text-sm px-4 py-2">
                {boardNumber === 1 ? "🎖️ ELITE SPY STATUS ACHIEVED" : `🏆 BOARD ${boardNumber} CLEARED`}
              </Badge>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary via-yellow-500 to-primary hover:from-primary/90 hover:via-yellow-400 hover:to-primary/90 text-primary-foreground font-mono font-bold py-6 text-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
            >
              <span className="flex items-center justify-center gap-2">
                CONTINUE TO BOARD {boardNumber + 1}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
