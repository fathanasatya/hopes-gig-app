"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Timer, ShieldCheck, Send, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, formatRupiah, type Role, type Task } from "@/lib/hopes"
import { SwipeToConfirm } from "./swipe-to-confirm"

// ----------------------------------------------------------------------
// DATA & HOOKS BANTUAN (Diletakkan di luar komponen utama agar rapi)
// ----------------------------------------------------------------------
type Message = { id: number; from: "me" | "them"; text?: string; image?: string; time: string }
const BASE_MESSAGES: Message[] = [
  { id: 1, from: "them", text: "Halo, saya sudah otw ke lokasi ya. Dokumennya sudah saya ambil.", time: "14:02" },
  { id: 2, from: "me", text: "Siap, ditunggu. Tolong foto kalau sudah sampai.", time: "14:03" },
]

function useCountdown(start: number) {
  const [seconds, setSeconds] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const s = String(seconds % 60).padStart(2, "0")
  return `${h}:${m}:${s}`
}

// ----------------------------------------------------------------------
// KOMPONEN UTAMA VAULT
// ----------------------------------------------------------------------
export function Vault({ 
  // JARING PENGAMAN 1: tasks = [] (Jika undefined, paksa jadi array kosong)
  tasks = [], 
  role, 
  onReleaseFunds 
}: { 
  tasks: Task[], 
  role: Role, 
  onReleaseFunds: () => void 
}) {
  const [released, setReleased] = useState(false)
  const theme = THEMES[role]
  const countdown = useCountdown(23 * 3600 + 59 * 60 + 10)
  
  // JARING PENGAMAN 2: Pastikan tasks adalah array dan memiliki isi, baru ambil index [0]
  const activeTask = Array.isArray(tasks) && tasks.length > 0 ? tasks[0] : null;

  function handleRelease() {
    setReleased(true)
    onReleaseFunds()
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden">
      {/* HEADER ESCROW */}
      <header className="z-20 shrink-0 border-b border-slate-200 bg-white/95 py-3 backdrop-blur md:rounded-t-3xl">
        <div className="flex min-w-0 items-center justify-between gap-3 px-4">
          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <ShieldCheck className={cn("h-3.5 w-3.5 shrink-0", theme.text)} />
              The Vault • Escrow Aktif
            </span>
            <h2 className="truncate text-base font-bold text-slate-900">
              {activeTask ? activeTask.title : "Belum ada tugas di Vault"}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-2.5 py-2 sm:px-3">
            <Timer className="h-4 w-4 text-white" />
            <span className="font-mono text-xs font-bold tabular-nums text-white sm:text-sm">{countdown}</span>
          </div>
        </div>
      </header>

      {/* ISI VAULT (DANA & CHAT) */}
      <div className="scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <div className={cn("mx-4 mt-4 flex items-center justify-between rounded-2xl p-4", theme.softBg)}>
          <span className={cn("text-sm font-medium", theme.softText)}>Dana terkunci</span>
          <span className={cn("text-lg font-bold", theme.softText)}>
            {activeTask ? formatRupiah(activeTask.price) : "Rp0"}
          </span>
        </div>
        
        {/* Render area chat hanya jika ada tugas aktif */}
        {activeTask ? (
          <div className="flex flex-col gap-3 px-4 py-4">
            {BASE_MESSAGES.map((msg) => (
              <Bubble key={msg.id} msg={msg} theme={theme} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-sm font-medium text-slate-400">
            Ambil tugas di Live Board terlebih dahulu.
          </div>
        )}
      </div>

      {/* FOOTER AKSI */}
      <footer className="z-20 shrink-0 border-t border-slate-200 bg-white pt-4 pb-[calc(env(safe-area-inset-bottom)+4.5rem)] md:rounded-b-3xl md:pb-4 px-4">
        {role === "giver" && activeTask ? (
          <div className="w-full min-w-0">
             <SwipeToConfirm onConfirm={handleRelease} />
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <input
              disabled={!activeTask}
              placeholder={activeTask ? "Ketik pesan..." : "Menunggu tugas aktif..."}
              className="min-h-[48px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              disabled={!activeTask}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all",
                activeTask ? "active:scale-95 cursor-pointer" : "opacity-50 cursor-not-allowed",
                theme.solidBg,
                theme.textOnAccent
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}

// ----------------------------------------------------------------------
// KOMPONEN UI BANTUAN (CHAT BUBBLE)
// ----------------------------------------------------------------------
function Bubble({ msg, theme }: { msg: Message; theme: (typeof THEMES)[Role] }) {
  const mine = msg.from === "me"
  return (
    <div className={cn("flex min-w-0", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] min-w-0 overflow-hidden", msg.image ? "rounded-3xl" : "")}>
        {msg.image ? (
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <Image
              src={msg.image || "/placeholder.svg"}
              alt="Bukti"
              width={400}
              height={300}
              className="h-44 w-full max-w-full object-cover"
            />
          </figure>
        ) : (
          <div
            className={cn(
              "rounded-3xl px-4 py-2.5",
              mine ? cn(theme.solidBg, theme.textOnAccent) : "border border-slate-200 bg-white text-slate-800",
            )}
          >
            <p className="break-words text-sm leading-relaxed">{msg.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}