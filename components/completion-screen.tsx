"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, X } from "lucide-react"

type CompletionScreenProps = {
  agentPhoto: string
  totalScore: number
  missionsCompleted: number
  onClose: () => void
}

export function CompletionScreen({ agentPhoto, totalScore, missionsCompleted, onClose }: CompletionScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-lg w-full">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="size-5" />
        </Button>

        {/* Celebration card */}
        <div className="bg-gradient-to-br from-primary/20 via-card to-primary/10 border-2 border-primary rounded-xl overflow-hidden">
          {/* Header with confetti effect */}
          <div className="relative bg-primary/30 p-6 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"][i % 4],
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            <Trophy className="size-12 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-2xl font-mono font-bold text-card-foreground">MISSION COMPLETE!</h2>
            <p className="text-sm text-muted-foreground font-mono mt-1">Agent Identity Confirmed</p>
          </div>

          {/* Agent photo and stats */}
          <div className="p-6 space-y-6">
            {/* Agent photo */}
            <div className="flex justify-center">
              <div className="relative p-2 shadow-xl" style={{ backgroundColor: "#49111C" }}>
                <div className="w-32 h-32 overflow-hidden">
                  <img src={agentPhoto || "/placeholder.svg"} alt="Agent" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg border-2 border-red-600" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <Star className="size-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-mono font-bold text-card-foreground">{totalScore}</p>
                <p className="text-xs text-muted-foreground font-mono">TOTAL POINTS</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <Trophy className="size-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-mono font-bold text-card-foreground">{missionsCompleted}</p>
                <p className="text-xs text-muted-foreground font-mono">MISSIONS</p>
              </div>
            </div>

            {/* Badge */}
            <div className="text-center">
              <Badge className="bg-primary text-primary-foreground font-mono text-sm px-4 py-2">
                ELITE SPY STATUS ACHIEVED
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
