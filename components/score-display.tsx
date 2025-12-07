import { Badge } from "@/components/ui/badge"
import { Trophy, Unlock } from "lucide-react"

type ScoreDisplayProps = {
  score: number
  unlockedScenes: number
}

export function ScoreDisplay({ score, unlockedScenes }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <Badge className="bg-primary text-primary-foreground font-mono text-sm md:text-base px-3 py-1.5">
        <Trophy className="size-4 mr-2" />
        {score} PTS
      </Badge>
      {unlockedScenes > 10 && (
        <Badge variant="outline" className="border-primary text-primary font-mono text-xs md:text-sm">
          <Unlock className="size-3 mr-1" />+{unlockedScenes - 10}
        </Badge>
      )}
    </div>
  )
}
