"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Camera, Zap } from "lucide-react"
import { SceneDisplay } from "./scene-display"
import { CameraCapture } from "./camera-capture"
import { ScoreDisplay } from "./score-display"
import { SpyLog } from "./spy-log"
import { UnlockNotification } from "./unlock-notification"
import { AgentCamera } from "./agent-camera"
import { CompletionScreen } from "./completion-screen"
import { QuitWarning } from "./quit-warning"
import { MusicPlayer, type MusicPlayerHandle } from "./music-player"

export type SpyLogEntry = {
  id: string
  scene: string
  score: number
  timestamp: Date
  imageUrl?: string
  detectedObjects: string[]
}

const MISSIONS_PER_BOARD = 5

export function GameInterface() {
  const [totalScore, setTotalScore] = useState(0)
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [currentBoardEntries, setCurrentBoardEntries] = useState<SpyLogEntry[]>([])
  const [totalMissionsCompleted, setTotalMissionsCompleted] = useState(0)
  const [unlockedScenes, setUnlockedScenes] = useState(10)
  const [showUnlock, setShowUnlock] = useState(false)
  const [newUnlockedCount, setNewUnlockedCount] = useState(0)
  const [showAgentCamera, setShowAgentCamera] = useState(false)
  const [agentPhoto, setAgentPhoto] = useState<string | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showQuitWarning, setShowQuitWarning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [boardNumber, setBoardNumber] = useState(1)

  const completionAudioRef = useRef<HTMLAudioElement>(null)
  const emotionalDamageRef = useRef<HTMLAudioElement>(null)
  const musicPlayerRef = useRef<MusicPlayerHandle>(null)

  const isBoardFull = currentBoardEntries.length >= MISSIONS_PER_BOARD

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted && totalMissionsCompleted > 0 && totalMissionsCompleted < 8) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasStarted, totalMissionsCompleted])

  const handleSceneGenerated = (scene: string) => {
    if (!hasStarted) {
      setHasStarted(true)
      // Start music when first mission begins
      musicPlayerRef.current?.play()
    }
    setCurrentScene(scene)
    setShowCamera(true)
  }

  const handlePhotoCapture = (imageUrl: string, detectedObjects: string[], points: number) => {
    const newEntry: SpyLogEntry = {
      id: Date.now().toString(),
      scene: currentScene || "Unknown",
      score: points,
      timestamp: new Date(),
      imageUrl,
      detectedObjects,
    }

    const updatedBoardEntries = [newEntry, ...currentBoardEntries]
    setCurrentBoardEntries(updatedBoardEntries)
    setTotalScore(totalScore + points)
    setTotalMissionsCompleted(totalMissionsCompleted + 1)
    setShowCamera(false)

    // Unlock more scenes based on total missions
    const newUnlocked = Math.min(82, 10 + Math.floor((totalMissionsCompleted + 1) / 3) * 5)
    if (newUnlocked > unlockedScenes) {
      setNewUnlockedCount(newUnlocked - unlockedScenes)
      setUnlockedScenes(newUnlocked)
      setShowUnlock(true)
      setTimeout(() => setShowUnlock(false), 3000)
    }
  }

  const handleAgentPhotoCapture = (imageUrl: string) => {
    setAgentPhoto(imageUrl)
    setShowAgentCamera(false)
    setShowCompletion(true)

    // Pause BGM and play completion song
    musicPlayerRef.current?.pause()
    if (completionAudioRef.current) {
      completionAudioRef.current.play().catch((err) => {
        console.log("[v0] Completion audio playback failed:", err)
      })
    }
  }

  const handleContinuePlaying = () => {
    setShowCompletion(false)
    setCurrentBoardEntries([]) // Clear board for new missions
    setBoardNumber(boardNumber + 1)
    // Resume music
    musicPlayerRef.current?.play()
  }

  const handleQuit = () => {
    if (emotionalDamageRef.current) {
      emotionalDamageRef.current.play().catch((err) => console.log("[v0] Emotional damage audio error:", err))
    }
    setShowQuitWarning(false)
  }

  const handleContinue = () => {
    setShowQuitWarning(false)
  }

  const handleTryQuit = () => {
    if (hasStarted && totalMissionsCompleted > 0 && totalMissionsCompleted < 8) {
      setShowQuitWarning(true)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Audio elements */}
      <audio ref={completionAudioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/happy-happy-happy-song-93vWyyTNEflvtF078jQ0YJ3xHi9T1Q.mp3" preload="auto" />
      <audio ref={emotionalDamageRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emotional-damage-meme-cbhmoPvqkQRkF7l82TdCvsChf7Lcid.mp3" preload="auto" />

      {showUnlock && <UnlockNotification count={newUnlockedCount} />}

      {showQuitWarning && (
        <QuitWarning missionsCompleted={totalMissionsCompleted} onQuit={handleQuit} onContinue={handleContinue} />
      )}

      {showCompletion && agentPhoto && (
        <CompletionScreen
          agentPhoto={agentPhoto}
          totalScore={totalScore}
          missionsCompleted={totalMissionsCompleted}
          boardNumber={boardNumber}
          onClose={handleContinuePlaying}
        />
      )}

      {showAgentCamera && (
        <AgentCamera onCapture={handleAgentPhotoCapture} onCancel={() => setShowAgentCamera(false)} />
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 md:size-12 rounded-lg bg-primary flex items-center justify-center">
                <Eye className="size-6 md:size-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-mono text-foreground">JINIRET</h1>
                <p className="text-xs md:text-sm text-muted-foreground font-mono">
                  {">"} SPY MISSION ACTIVE {boardNumber > 1 && `(BOARD ${boardNumber})`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 relative">
              {hasStarted && <MusicPlayer ref={musicPlayerRef} autoPlay={false} />}
              <ScoreDisplay score={totalScore} unlockedScenes={unlockedScenes} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left Column - Scene & Camera */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-2 border-primary/20 bg-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-mono font-bold text-card-foreground flex items-center gap-2">
                  <Camera className="size-5 text-primary" />
                  MISSION CONTROL
                </h2>
                <Badge variant="outline" className="font-mono text-xs border-primary text-primary">
                  <Zap className="size-3 mr-1" />
                  {currentBoardEntries.length}/{MISSIONS_PER_BOARD} BOARD | {totalMissionsCompleted} TOTAL
                </Badge>
              </div>

              {!isBoardFull ? (
                <SceneDisplay onSceneGenerated={handleSceneGenerated} unlockedScenes={unlockedScenes} />
              ) : (
                <div className="text-center py-8 bg-secondary/50 rounded-lg border-2 border-dashed border-primary/30">
                  <p className="text-lg font-mono text-primary mb-2">BOARD {boardNumber} COMPLETE!</p>
                  <p className="text-sm text-muted-foreground">
                    {agentPhoto
                      ? "Take your agent photo to continue to the next board."
                      : "Take your agent photo to finish this board."}
                  </p>
                </div>
              )}

              {showCamera && currentScene && (
                <CameraCapture
                  scene={currentScene}
                  onCapture={handlePhotoCapture}
                  onCancel={() => setShowCamera(false)}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Spy Log */}
        <div className="lg:col-span-1">
          <SpyLog
            entries={currentBoardEntries}
            onBoardFull={() => setShowAgentCamera(true)}
            isBoardFull={isBoardFull}
            agentPhoto={agentPhoto}
            boardNumber={boardNumber}
          />
        </div>
      </div>
    </div>
  )
}
