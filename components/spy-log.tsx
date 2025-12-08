"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, Camera, User } from "lucide-react"
import type { SpyLogEntry } from "./game-interface"

const MAX_BOARD_ENTRIES = 5

type SpyLogProps = {
  entries: SpyLogEntry[]
  onBoardFull?: () => void
  isBoardFull?: boolean
  agentPhoto?: string | null
}

const getPinboardStyle = (index: number) => {
  const positions = [
    { top: "8%", left: "15%", rotate: -3 },
    { top: "10%", left: "60%", rotate: 2 },
    { top: "40%", left: "8%", rotate: 4 },
    { top: "38%", left: "55%", rotate: -2 },
    { top: "70%", left: "35%", rotate: 1 },
  ]

  const pos = positions[index % positions.length]
  return {
    position: "absolute" as const,
    top: pos.top,
    left: pos.left,
    transform: `rotate(${pos.rotate}deg)`,
    zIndex: index + 1,
  }
}

const getConnectionPoints = () => {
  return [
    { x: 30, y: 18 }, // Position 0
    { x: 75, y: 20 }, // Position 1
    { x: 23, y: 50 }, // Position 2
    { x: 70, y: 48 }, // Position 3
    { x: 50, y: 80 }, // Position 4
  ]
}

export function SpyLog({ entries, onBoardFull, isBoardFull, agentPhoto }: SpyLogProps) {
  const connectionPoints = getConnectionPoints()
  const displayEntries = entries.slice(0, MAX_BOARD_ENTRIES)

  return (
    <Card className="border-2 border-primary/20 bg-card overflow-hidden">
      <div className="p-4 border-b border-primary/20 bg-secondary">
        <h2 className="font-mono font-bold text-sm text-card-foreground flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          SPY LOG
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          {displayEntries.length}/{MAX_BOARD_ENTRIES} MISSIONS COMPLETED
        </p>
      </div>

      <div className="h-[600px] overflow-hidden relative" style={{ backgroundColor: "#63372C" }}>
        {displayEntries.length >= 2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* Draw lines between consecutive entries */}
            {displayEntries.slice(0, -1).map((_, index) => {
              const from = connectionPoints[index]
              const to = connectionPoints[index + 1]
              return (
                <line
                  key={`line-${index}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="none"
                  opacity="0.8"
                />
              )
            })}
            {/* Extra connecting lines for web effect */}
            {displayEntries.length >= 3 && (
              <line
                x1={`${connectionPoints[0].x}%`}
                y1={`${connectionPoints[0].y}%`}
                x2={`${connectionPoints[2].x}%`}
                y2={`${connectionPoints[2].y}%`}
                stroke="#22c55e"
                strokeWidth="2"
                opacity="0.6"
              />
            )}
            {displayEntries.length >= 4 && (
              <line
                x1={`${connectionPoints[1].x}%`}
                y1={`${connectionPoints[1].y}%`}
                x2={`${connectionPoints[3].x}%`}
                y2={`${connectionPoints[3].y}%`}
                stroke="#22c55e"
                strokeWidth="2"
                opacity="0.6"
              />
            )}
            {displayEntries.length >= 5 && (
              <>
                <line
                  x1={`${connectionPoints[2].x}%`}
                  y1={`${connectionPoints[2].y}%`}
                  x2={`${connectionPoints[4].x}%`}
                  y2={`${connectionPoints[4].y}%`}
                  stroke="#22c55e"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1={`${connectionPoints[3].x}%`}
                  y1={`${connectionPoints[3].y}%`}
                  x2={`${connectionPoints[4].x}%`}
                  y2={`${connectionPoints[4].y}%`}
                  stroke="#22c55e"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </>
            )}
            {/* Small dots at connection points */}
            {displayEntries.map((_, index) => {
              const point = connectionPoints[index]
              return (
                <circle key={`dot-${index}`} cx={`${point.x}%`} cy={`${point.y}%`} r="4" fill="#22c55e" opacity="0.9" />
              )
            })}
          </svg>
        )}

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
          <div className="relative w-full h-full">
            {displayEntries.map((entry, index) => (
              <div
                key={entry.id}
                style={getPinboardStyle(index)}
                className="w-28 transition-transform hover:scale-105 hover:z-50"
              >
                {/* Yellow pushpin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg border-2 border-yellow-500" />
                </div>

                {/* Photo with border */}
                <div
                  className="relative shadow-xl hover:shadow-2xl transition-shadow"
                  style={{
                    backgroundColor: "#49111C",
                    padding: "6px",
                  }}
                >
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
                      className="font-mono text-[10px] border-yellow-400 text-yellow-400 bg-transparent w-full justify-center"
                    >
                      +{entry.score}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {isBoardFull && !agentPhoto && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="text-center p-6 bg-card/90 rounded-lg border-2 border-primary mx-4">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/20 mb-4">
                    <User className="size-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-mono font-bold text-card-foreground mb-2">BOARD COMPLETE!</h3>
                  <p className="text-sm text-muted-foreground mb-4">Take a selfie to reveal your agent identity</p>
                  <button
                    onClick={onBoardFull}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Camera className="size-5" />
                    AGENT PHOTO
                  </button>
                </div>
              </div>
            )}

            {agentPhoto && (
              <div
                className="absolute w-32 transition-transform hover:scale-105 hover:z-50"
                style={{
                  bottom: "5%",
                  right: "5%",
                  transform: "rotate(3deg)",
                  zIndex: 100,
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-5 h-5 rounded-full bg-red-500 shadow-lg border-2 border-red-600" />
                </div>
                <div
                  className="relative shadow-xl"
                  style={{
                    backgroundColor: "#49111C",
                    padding: "6px",
                  }}
                >
                  <div className="relative aspect-square bg-white">
                    <img src={agentPhoto || "/placeholder.svg"} alt="Agent" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-1 px-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] border-red-400 text-red-400 bg-transparent w-full justify-center"
                    >
                      AGENT ID
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
