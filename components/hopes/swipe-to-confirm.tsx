"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronsRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES } from "@/lib/hopes"

const KNOB = 56 // px

export function SwipeToConfirm({
  label = "Geser untuk Cairkan Dana",
  onConfirm,
}: {
  label?: string
  onConfirm: () => void
}) {
  const theme = THEMES.giver
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const xRef = useRef(0)
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const maxX = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    return track.clientWidth - KNOB - 8
  }, [])

  const setKnobX = useCallback((value: number) => {
    xRef.current = value
    setX(value)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (confirmed) return
    draggingRef.current = true
    setDragging(true)
    try {
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // Some synthetic/non-trusted pointers can't be captured; safe to ignore.
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || confirmed) return
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const next = Math.min(Math.max(e.clientX - rect.left - KNOB / 2, 0), maxX())
    setKnobX(next)
  }

  const handlePointerUp = () => {
    if (confirmed) return
    draggingRef.current = false
    setDragging(false)
    if (xRef.current >= maxX() - 4) {
      setKnobX(maxX())
      setConfirmed(true)
      onConfirm()
    } else {
      setKnobX(0)
    }
  }

  const progress = maxX() > 0 ? x / maxX() : 0

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative flex h-16 w-full max-w-full min-w-0 select-none items-center overflow-hidden rounded-2xl px-1",
        confirmed ? theme.solidBg : "bg-slate-100",
      )}
    >
      {/* Filled progress */}
      <div
        className={cn("absolute inset-y-1 left-1 rounded-xl transition-colors", theme.solidBg)}
        style={{ width: confirmed ? "100%" : `${KNOB + x}px`, opacity: confirmed ? 1 : 0.18 }}
      />

      {/* Label */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold transition-colors",
          confirmed ? theme.textOnAccent : "text-slate-500",
        )}
        style={{ opacity: confirmed ? 1 : 1 - progress * 1.3 }}
      >
        {confirmed ? "Dana Cair!" : label}
      </span>

      {/* Knob */}
      <button
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateX(${x}px)` }}
        className={cn(
          "relative z-10 flex h-14 w-14 shrink-0 touch-none items-center justify-center rounded-xl bg-white shadow-md",
          !dragging && "transition-transform",
          confirmed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        )}
      >
        {confirmed ? (
          <Check className={cn("h-6 w-6", theme.text)} />
        ) : (
          <ChevronsRight className={cn("h-6 w-6", theme.text)} />
        )}
      </button>
    </div>
  )
}
