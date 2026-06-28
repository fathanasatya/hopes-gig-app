"use client"

import { HandHelping, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, type Role } from "@/lib/hopes"

export function RoleToggle({
  role,
  onChange,
}: {
  role: Role
  onChange: (role: Role) => void
}) {
  const theme = THEMES[role]
  return (
    <div
      role="tablist"
      aria-label="Ganti mode peran"
      className="relative flex w-full items-center rounded-full border border-slate-200 bg-slate-100 p-1"
    >
      {/* Sliding pill */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full shadow-sm transition-transform duration-300 ease-out",
          theme.solidBg,
          role === "seeker" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0",
        )}
      />
      <button
        role="tab"
        aria-selected={role === "giver"}
        onClick={() => onChange("giver")}
        className={cn(
          "relative z-10 flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
          role === "giver" ? THEMES.giver.textOnAccent : "text-slate-600",
        )}
      >
        <HandHelping className="h-4 w-4" />
        Cari Bantuan
      </button>
      <button
        role="tab"
        aria-selected={role === "seeker"}
        onClick={() => onChange("seeker")}
        className={cn(
          "relative z-10 flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
          role === "seeker" ? THEMES.seeker.textOnAccent : "text-slate-600",
        )}
      >
        <Wallet className="h-4 w-4" />
        Cari Uang
      </button>
    </div>
  )
}
