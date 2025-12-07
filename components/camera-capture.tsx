"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DetectionResults } from "@/components/detection-results"

type CameraCaptureProps = {
  scene: string
  onCapture: (imageUrl: string, detectedObjects: string[], points: number) => void
  onCancel: () => void
}

export function CameraCapture({ scene, onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectionResults, setDetectionResults] = useState<{
    objects: string[]
    points: number
  } | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setError(null)
    } catch (err) {
      console.error("[v0] Camera access error:", err)
      setError("Unable to access camera. Please grant camera permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageUrl = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageUrl)
    stopCamera()
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setDetectionResults(null)
    startCamera()
  }

  const submitPhoto = async () => {
    if (!capturedImage) return

    setIsProcessing(true)

    setTimeout(() => {
      const detectedObjects = mockObjectDetection(scene)
      const points = calculatePoints(detectedObjects, scene)

      setDetectionResults({ objects: detectedObjects, points })
      setIsProcessing(false)
    }, 1500)
  }

  const confirmAndSubmit = () => {
    if (!capturedImage || !detectionResults) return
    onCapture(capturedImage, detectionResults.objects, detectionResults.points)
  }

  return (
    <Card className="border-2 border-primary/30 bg-secondary overflow-hidden">
      <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-card">
        <h3 className="font-mono font-bold text-sm text-card-foreground flex items-center gap-2">
          <Camera className="size-4 text-primary" />
          SURVEILLANCE MODE
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel} className="size-8 p-0 hover:bg-destructive/10">
          <X className="size-4" />
        </Button>
      </div>

      <div className="relative bg-black aspect-video">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-destructive text-sm p-4 text-center">
            {error}
          </div>
        ) : capturedImage ? (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
        )}

        {!capturedImage && !error && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-primary/30 m-8">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded text-xs font-mono text-primary">
              RECORDING
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-4 space-y-3">
        {detectionResults && (
          <DetectionResults detectedObjects={detectionResults.objects} points={detectionResults.points} scene={scene} />
        )}

        {!capturedImage ? (
          <Button
            onClick={capturePhoto}
            disabled={!!error}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            size="lg"
          >
            <Camera className="size-5 mr-2" />
            CAPTURE EVIDENCE
          </Button>
        ) : !detectionResults ? (
          <div className="flex gap-2">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1 font-mono border-primary/50 bg-transparent"
            >
              <RotateCcw className="size-4 mr-2" />
              RETAKE
            </Button>
            <Button
              onClick={submitPhoto}
              disabled={isProcessing}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            >
              {isProcessing ? (
                <>
                  <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  ANALYZING...
                </>
              ) : (
                "ANALYZE"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1 font-mono border-primary/50 bg-transparent"
            >
              <RotateCcw className="size-4 mr-2" />
              RETAKE
            </Button>
            <Button
              onClick={confirmAndSubmit}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            >
              <CheckCircle2 className="size-4 mr-2" />
              ADD TO LOG
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

function mockObjectDetection(scene: string): string[] {
  const objects = ["person", "table", "chair", "cup", "book", "phone", "laptop", "bag"]

  const detectedCount = Math.floor(Math.random() * 4) + 2
  const detected: string[] = []

  for (let i = 0; i < detectedCount; i++) {
    const obj = objects[Math.floor(Math.random() * objects.length)]
    if (!detected.includes(obj)) {
      detected.push(obj)
    }
  }

  if (scene.includes("cake") || scene.includes("cookie") || scene.includes("food")) {
    detected.push("food")
  }
  if (scene.includes("money") || scene.includes("wallet")) {
    detected.push("money")
  }
  if (scene.includes("phone")) {
    detected.push("phone")
  }

  return [...new Set(detected)]
}

function calculatePoints(detectedObjects: string[], scene: string): number {
  let points = detectedObjects.length * 10

  const lowerScene = scene.toLowerCase()
  detectedObjects.forEach((obj) => {
    if (lowerScene.includes(obj.toLowerCase())) {
      points += 25
    }
  })

  return points
}
