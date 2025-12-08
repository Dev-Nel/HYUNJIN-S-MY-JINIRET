"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, LogOut, ArrowRight } from "lucide-react"

type QuitWarningProps = {
  missionsCompleted: number
  onQuit: () => void
  onContinue: () => void
}

export function QuitWarning({ missionsCompleted, onQuit, onContinue }: QuitWarningProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Play emotional damage sound when warning appears
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log("[v0] Warning audio error:", err))
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <audio ref={audioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emotional-damage-meme-cbhmoPvqkQRkF7l82TdCvsChf7Lcid.mp3" preload="auto" />

      <div className="bg-card border-2 border-destructive rounded-lg overflow-hidden max-w-md w-full animate-in zoom-in-95 duration-300">
        <div className="p-4 border-b border-destructive/20 bg-destructive/10">
          <h3 className="font-mono font-bold text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            MISSION INCOMPLETE!
          </h3>
        </div>

        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-destructive/20 mb-4">
            <span className="text-4xl">😢</span>
          </div>

          <p className="text-card-foreground font-mono mb-2">
            You've only completed <span className="text-primary font-bold">{missionsCompleted}/5</span> missions!
          </p>
          <p className="text-sm text-muted-foreground mb-6">Are you sure you want to abandon your spy career?</p>

          <div className="flex gap-3">
            <Button
              onClick={onQuit}
              variant="outline"
              className="flex-1 font-mono border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <LogOut className="size-4 mr-2" />
              QUIT
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 font-mono bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowRight className="size-4 mr-2" />
              CONTINUE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
