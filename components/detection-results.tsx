"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Target, Zap } from "lucide-react"

type DetectionResultsProps = {
  detectedObjects: string[]
  points: number
  scene: string
}

export function DetectionResults({ detectedObjects, points, scene }: DetectionResultsProps) {
  const relevantObjects = detectedObjects.filter((obj) => scene.toLowerCase().includes(obj.toLowerCase()))

  return (
    <Card className="border-2 border-primary/30 bg-secondary p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono font-bold text-sm text-card-foreground flex items-center gap-2">
            <Target className="size-4 text-primary" />
            DETECTION REPORT
          </h4>
          <Badge className="bg-primary text-primary-foreground font-mono">
            <Zap className="size-3 mr-1" />+{points} PTS
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono">IDENTIFIED OBJECTS:</p>
          <div className="flex flex-wrap gap-2">
            {detectedObjects.map((obj, index) => {
              const isRelevant = relevantObjects.includes(obj)
              return (
                <Badge
                  key={index}
                  variant={isRelevant ? "default" : "outline"}
                  className={
                    isRelevant
                      ? "bg-primary text-primary-foreground font-mono text-xs"
                      : "border-primary/30 text-foreground font-mono text-xs bg-transparent"
                  }
                >
                  {isRelevant && <CheckCircle2 className="size-3 mr-1" />}
                  {obj.toUpperCase()}
                </Badge>
              )
            })}
          </div>

          {relevantObjects.length > 0 && (
            <div className="mt-3 pt-3 border-t border-primary/20">
              <p className="text-xs text-primary font-mono flex items-center gap-1">
                <Zap className="size-3" />
                BONUS: {relevantObjects.length} relevant {relevantObjects.length === 1 ? "object" : "objects"} detected
                (+{relevantObjects.length * 25} pts)
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
