"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Target } from "lucide-react"
import type { SpyLogEntry } from "./game-interface"

type SpyLogProps = {
  entries: SpyLogEntry[]
}

const getPinboardStyle = (index: number) => {
  const positions = [
    { top: "8%", left: "10%", rotate: -3 },
    { top: "5%", left: "45%", rotate: 2 },
    { top: "12%", left: "75%", rotate: -2 },
    { top: "35%", left: "8%", rotate: 4 },
    { top: "38%", left: "52%", rotate: -4 },
    { top: "42%", left: "82%", rotate: 3 },
    { top: "65%", left: "15%", rotate: -2 },
    { top: "68%", left: "55%", rotate: 2 },
    { top: "70%", left: "85%", rotate: -3 },
  ]

  const pos = positions[index % positions.length]
  return {
    position: "absolute" as const,
    top: pos.top,
    left: pos.left,
    transform: `rotate(${pos.rotate}deg)`,
    zIndex: index,
  }
}

export function SpyLog({ entries }: SpyLogProps) {
  return (
    <Card className="border-2 border-primary/20 bg-card overflow-hidden">
      <div className="p-4 border-b border-primary/20 bg-secondary">
        <h2 className="font-mono font-bold text-sm text-card-foreground flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          SPY LOG
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">{entries.length} MISSIONS COMPLETED</p>
      </div>

      <div className="h-[600px] overflow-y-auto relative" style={{ backgroundColor: "#63372C" }}>
        {entries.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-black/20 mb-3">
                <Target className="size-6 text-yellow-400" />
              </div>
              <p className="text-sm text-yellow-400 font-mono">NO MISSIONS YET</p>
              <p className="text-xs text-yellow-400/70 mt-1">Complete missions to pin them here</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full" style={{ minHeight: "600px" }}>
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                style={getPinboardStyle(index)}
                className="w-32 transition-transform hover:scale-105 hover:z-50"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg border-2 border-yellow-500" />
                </div>

                <div
                  className="relative shadow-xl hover:shadow-2xl transition-shadow"
                  style={{
                    backgroundColor: "#49111C",
                    padding: "6px",
                  }}
                >
                  {/* Photo */}
                  <div className="relative aspect-square bg-white">
                    {entry.imageUrl ? (
                      <img
                        src={entry.imageUrl || "/placeholder.svg"}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Target className="size-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="mt-1 px-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs border-yellow-400 text-yellow-400 bg-transparent w-full justify-center"
                    >
                      +{entry.score}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
