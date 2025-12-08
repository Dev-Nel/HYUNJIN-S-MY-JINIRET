"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw, CheckCircle2, User, CameraOff } from "lucide-react"

type AgentCameraProps = {
  onCapture: (imageUrl: string) => void
  onCancel: () => void
}

export function AgentCamera({ onCapture, onCancel }: AgentCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsVideoReady(false)

      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setIsVideoReady(true)
            })
            .catch((err) => {
              console.log("[v0] Video play error:", err)
            })
        }
      }
    } catch (err: any) {
      console.log("[v0] Agent camera error:", err.name, err.message)
      if (err.name === "NotAllowedError" || err.message?.includes("Permission denied")) {
        setError("Camera permission denied. Please allow camera access in your browser settings and click 'Try Again'.")
      } else if (err.name === "NotFoundError") {
        setError("No camera found. Please connect a camera and try again.")
      } else if (err.name === "NotReadableError") {
        setError("Camera is being used by another application. Please close other apps using the camera.")
      } else {
        setError("Unable to access camera. Please check your permissions and try again.")
      }
    }
  }, [stream])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth || 720
    canvas.height = video.videoHeight || 720
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageUrl = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageUrl)
    stopCamera()
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const confirmPhoto = () => {
    if (!capturedImage) return
    onCapture(capturedImage)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary rounded-lg overflow-hidden max-w-md w-full">
        <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-secondary">
          <h3 className="font-mono font-bold text-sm text-card-foreground flex items-center gap-2">
            <User className="size-4 text-primary" />
            AGENT IDENTIFICATION
          </h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="size-8 p-0 hover:bg-destructive/10">
            <X className="size-4" />
          </Button>
        </div>

        <div className="relative bg-black aspect-square">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <CameraOff className="size-12 text-destructive mb-4" />
              <p className="text-destructive text-sm mb-4">{error}</p>
              <Button
                onClick={startCamera}
                variant="outline"
                className="font-mono border-primary text-primary bg-transparent"
              >
                Try Again
              </Button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage || "/placeholder.svg"} alt="Agent" className="w-full h-full object-cover" />
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!isVideoReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-primary font-mono text-sm animate-pulse">Initializing camera...</div>
                </div>
              )}
            </>
          )}

          {!capturedImage && !error && isVideoReady && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-4 border-primary/50 m-12 rounded-full" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded text-xs font-mono text-primary">
                POSITION YOUR FACE
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 bg-card">
          {!capturedImage ? (
            <Button
              onClick={capturePhoto}
              disabled={!!error || !isVideoReady}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono disabled:opacity-50"
              size="lg"
            >
              <Camera className="size-5 mr-2" />
              {isVideoReady ? "CAPTURE AGENT PHOTO" : "LOADING..."}
            </Button>
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
                onClick={confirmPhoto}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
              >
                <CheckCircle2 className="size-4 mr-2" />
                CONFIRM
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
