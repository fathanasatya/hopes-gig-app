"use client"

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastData = {
  id: number
  message: string
  accentText: string
}

export function ToastStack({ toasts }: { toasts: ToastData[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className={cn("h-5 w-5 shrink-0", t.accentText)} />
          <p className="text-sm font-medium text-slate-900">{t.message}</p>
        </div>
      ))}
    </div>
  )
}
