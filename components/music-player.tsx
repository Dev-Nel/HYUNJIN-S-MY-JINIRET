"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, SkipForward, Music } from "lucide-react"

const SONGS = [
  { name: "FaShIoN", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CORTIS%20-%20FaSHioN-VzgnWZ60pVhL7SsaAjwQwhDJByA5HF.mp3" },
  { name: "Sweet Venom", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sweet%20Venom-rWwrhbLgFw5ZPAfKkAUdvvZydK8Uex.mp3" },
  { name: "Brought The Heat Back", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Brought%20The%20Heat%20Back-WmM5Nsjgkrpvh9YzB0AaJwZQtILfnS.mp3" },
  { name: "PSYCHO", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PSYCHO%20%281%29-r8Pmv1DF8FULOt2rRm02CgTECn1ihe.mp3" },
  { name: "Moonstruck - ENHYPEN", src: "/audio/moonstruck.mp3" },
]

export type MusicPlayerHandle = {
  play: () => void
  pause: () => void
  isPlaying: () => boolean
}

type MusicPlayerProps = {
  autoPlay?: boolean
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(({ autoPlay = false }, ref) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showName, setShowName] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error)
        setIsPlaying(true)
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    },
    isPlaying: () => isPlaying,
  }))

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(console.error)
      setIsPlaying(true)
    }
  }, [autoPlay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length)
    setShowName(true)
    setTimeout(() => setShowName(false), 2000)
  }

  const handleSongEnd = () => {
    nextSong()
  }

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={SONGS[currentSongIndex].src} onEnded={handleSongEnd} loop={false} />

      {showName && (
        <div className="absolute top-16 right-4 bg-card border border-primary/50 rounded-lg px-3 py-2 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-mono text-primary flex items-center gap-2">
            <Music className="size-3" />
            {SONGS[currentSongIndex].name}
          </p>
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={nextSong}
        className="border-primary/50 bg-transparent"
        title="Next Song"
      >
        <SkipForward className="size-4 text-primary" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={togglePlay}
        className="border-primary/50 bg-transparent"
        title={isPlaying ? "Mute" : "Play"}
      >
        {isPlaying ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4 text-muted-foreground" />}
      </Button>
    </div>
  )
})

MusicPlayer.displayName = "MusicPlayer"
