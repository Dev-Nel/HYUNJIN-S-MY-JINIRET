"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getRandomScene } from "@/lib/scenes"
import { Shuffle, AlertCircle } from "lucide-react"

type SceneDisplayProps = {
  onSceneGenerated: (scene: string) => void
  unlockedScenes: number
}

export function SceneDisplay({ onSceneGenerated, unlockedScenes }: SceneDisplayProps) {
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateScene = () => {
    setIsGenerating(true)

    // Simulate scene generation animation
    setTimeout(() => {
      const scene = getRandomScene(unlockedScenes)
      setCurrentScene(scene)
      onSceneGenerated(scene)
      setIsGenerating(false)
    }, 500)
  }

  return (
    <div className="space-y-4">
      {!currentScene ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
              <Shuffle className="size-8 text-primary" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2 text-card-foreground">READY FOR MISSION</h3>
            <p className="text-muted-foreground text-sm">Generate a random scene to begin spying</p>
          </div>

          <Button
            onClick={generateScene}
            disabled={isGenerating}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-base"
          >
            {isGenerating ? (
              <>
                <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                GENERATING...
              </>
            ) : (
              <>
                <Shuffle className="size-5 mr-2" />
                GENERATE SCENE
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-secondary border-2 border-primary/30 rounded-lg p-6 text-center">
            <div className="mb-3">
              <AlertCircle className="size-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">TARGET MISSION</p>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-mono text-primary mb-4 uppercase">{currentScene}</h3>
            <p className="text-sm text-muted-foreground">Capture evidence of this mischievous act with your camera</p>
          </div>

          <Button
            onClick={generateScene}
            variant="outline"
            className="w-full font-mono border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
          >
            <Shuffle className="size-4 mr-2" />
            NEW MISSION
          </Button>
        </div>
      )}
    </div>
  )
}
