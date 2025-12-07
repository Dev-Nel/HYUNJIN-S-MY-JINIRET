"use client"

import { Unlock, Sparkles } from "lucide-react"

type UnlockNotificationProps = {
  count: number
}

export function UnlockNotification({ count }: UnlockNotificationProps) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg border-2 border-primary flex items-center gap-3">
        <div className="relative">
          <Unlock className="size-6" />
          <Sparkles className="size-3 absolute -top-1 -right-1 text-primary-foreground animate-pulse" />
        </div>
        <div>
          <p className="font-mono font-bold text-sm">NEW SCENES UNLOCKED!</p>
          <p className="font-mono text-xs opacity-90">+{count} missions available</p>
        </div>
      </div>
    </div>
  )
}
