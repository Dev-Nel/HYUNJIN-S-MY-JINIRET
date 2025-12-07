"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Camera, Zap } from "lucide-react"
import { SceneDisplay } from "./scene-display"
import { CameraCapture } from "./camera-capture"
import { ScoreDisplay } from "./score-display"
import { SpyLog } from "./spy-log"
import { UnlockNotification } from "./unlock-notification"

export type SpyLogEntry = {
  id: string
  scene: string
  score: number
  timestamp: Date
  imageUrl?: string
  detectedObjects: string[]
}

export function GameInterface() {
  const [totalScore, setTotalScore] = useState(0)
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [spyLog, setSpyLog] = useState<SpyLogEntry[]>([])
  const [unlockedScenes, setUnlockedScenes] = useState(10)
  const [showUnlock, setShowUnlock] = useState(false)
  const [newUnlockedCount, setNewUnlockedCount] = useState(0)

  const handleSceneGenerated = (scene: string) => {
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

    const updatedLog = [newEntry, ...spyLog]
    setSpyLog(updatedLog)
    setTotalScore(totalScore + points)
    setShowCamera(false)

    const newUnlocked = Math.min(82, 10 + Math.floor(updatedLog.length / 3) * 5)
    if (newUnlocked > unlockedScenes) {
      setNewUnlockedCount(newUnlocked - unlockedScenes)
      setUnlockedScenes(newUnlocked)
      setShowUnlock(true)
      setTimeout(() => setShowUnlock(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {showUnlock && <UnlockNotification count={newUnlockedCount} />}

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
                <p className="text-xs md:text-sm text-muted-foreground font-mono">{">"} SPY MISSION ACTIVE</p>
              </div>
            </div>
            <ScoreDisplay score={totalScore} unlockedScenes={unlockedScenes} />
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
                  {unlockedScenes}/82 SCENES
                </Badge>
              </div>

              <SceneDisplay onSceneGenerated={handleSceneGenerated} unlockedScenes={unlockedScenes} />

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
          <SpyLog entries={spyLog} />
        </div>
      </div>
    </div>
  )
}
