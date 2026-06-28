"use client"

import { ArrowUpRight, Wallet, TrendingUp, Clock, ShieldCheck, Radio, PlusSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, formatRupiah, type Role, type ViewKey } from "@/lib/hopes"
import { RoleToggle } from "./role-toggle"

export function Dashboard({
  role,
  onNavigate,
  onRoleChange,
}: {
  role: Role
  onNavigate: (view: ViewKey) => void
  onRoleChange: (role: Role) => void
}) {
  const theme = THEMES[role]
  const isSeeker = role === "seeker"

  return (
    <div className="flex flex-col gap-4">
      <RoleToggle role={role} onChange={onRoleChange} />
      {/* Balance hero card */}
      <section className={cn("rounded-3xl p-6", theme.solidBg)}>
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-medium opacity-80", theme.textOnAccent)}>
            {isSeeker ? "Total Pendapatan" : "Saldo Tersedia"}
          </span>
          <Wallet className={cn("h-5 w-5", theme.textOnAccent)} />
        </div>
        <p className={cn("mt-2 text-4xl font-bold tracking-tight", theme.textOnAccent)}>
          {formatRupiah(isSeeker ? 845000 : 1250000)}
        </p>
        <p className={cn("mt-1 text-sm opacity-80", theme.textOnAccent)}>
          {isSeeker ? "+Rp120.000 minggu ini" : "Siap untuk diposting ke Escrow"}
        </p>
      </section>

      {/* Bento stat grid */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          icon={isSeeker ? TrendingUp : ShieldCheck}
          label={isSeeker ? "Job Selesai" : "Tugas Aktif"}
          value={isSeeker ? "37" : "2"}
          accent={theme.softText}
          accentBg={theme.softBg}
        />
        <StatCard
          icon={Clock}
          label={isSeeker ? "Rating" : "Menunggu"}
          value={isSeeker ? "4.9" : "1"}
          accent={theme.softText}
          accentBg={theme.softBg}
        />
      </section>

      {/* Primary action */}
      <button
        onClick={() => onNavigate(isSeeker ? "board" : "create")}
        className={cn(
          "flex min-h-[60px] items-center justify-between rounded-2xl px-5 text-left transition-all hover:-translate-y-0.5 active:scale-95",
          theme.solidBg,
          theme.solidBgHover,
        )}
      >
        <span className="flex items-center gap-3">
          {isSeeker ? (
            <Radio className={cn("h-5 w-5", theme.textOnAccent)} />
          ) : (
            <PlusSquare className={cn("h-5 w-5", theme.textOnAccent)} />
          )}
          <span className={cn("font-semibold", theme.textOnAccent)}>
            {isSeeker ? "Lihat Live Board" : "Posting Tugas Baru"}
          </span>
        </span>
        <ArrowUpRight className={cn("h-5 w-5", theme.textOnAccent)} />
      </button>

      {/* Activity list */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Aktivitas Terakhir</h2>
        <ul className="mt-3 flex flex-col divide-y divide-slate-100">
          {[
            { t: isSeeker ? "Antar paket — Selesai" : "Desain feed IG — Berjalan", v: "+Rp25.000" },
            { t: isSeeker ? "Desain logo — Selesai" : "Bersih kos — Menunggu", v: "+Rp75.000" },
            { t: isSeeker ? "Ngoding fix bug — Selesai" : "Tulis artikel — Selesai", v: "+Rp120.000" },
          ].map((row, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-600">{row.t}</span>
              <span className="text-sm font-bold text-slate-900">{row.v}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  accentBg,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent: string
  accentBg: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", accentBg)}>
        <Icon className={cn("h-5 w-5", accent)} />
      </span>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}
