"use client"

import { LayoutDashboard, Radio, PlusSquare, ShieldCheck, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, type Role, type ViewKey } from "@/lib/hopes"

type NavItem = {
  key: ViewKey
  label: string
  icon: LucideIcon
}

function itemsForRole(role: Role): NavItem[] {
  const contextual: NavItem =
    role === "seeker"
      ? { key: "board", label: "Live Board", icon: Radio }
      : { key: "create", label: "Buat Tugas", icon: PlusSquare }
  return [
    { key: "dashboard", label: "Beranda", icon: LayoutDashboard },
    contextual,
    { key: "vault", label: "The Vault", icon: ShieldCheck },
  ]
}

export function BottomNav({
  role,
  active,
  onNavigate,
}: {
  role: Role
  active: ViewKey
  onNavigate: (view: ViewKey) => void
}) {
  const theme = THEMES[role]
  const items = itemsForRole(role)
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive = active === item.key
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? "page" : undefined}
              className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 transition-transform active:scale-95"
            >
              <span
                className={cn(
                  "flex h-9 w-12 items-center justify-center rounded-full transition-colors",
                  isActive ? theme.softBg : "bg-transparent",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? theme.text : "text-slate-400")} />
              </span>
              <span className={cn("text-[11px] font-medium", isActive ? theme.text : "text-slate-500")}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function SideNav({
  role,
  active,
  onNavigate,
}: {
  role: Role
  active: ViewKey
  onNavigate: (view: ViewKey) => void
}) {
  const theme = THEMES[role]
  const items = itemsForRole(role)
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", theme.solidBg)}>
          <ShieldCheck className={cn("h-5 w-5", theme.textOnAccent)} />
        </span>
        <span className="text-xl font-bold tracking-tight text-slate-900">HOPES</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.key
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive ? cn(theme.softBg, theme.text) : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-500">{theme.tagline}</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{theme.label}</p>
      </div>
    </aside>
  )
}
