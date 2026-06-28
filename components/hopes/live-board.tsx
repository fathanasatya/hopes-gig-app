"use client"

import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, CATEGORY_META, formatRupiah, type Task } from "@/lib/hopes"
import { CategoryIcon } from "./category-icon"

export function LiveBoard({
  tasks,
  loading,
  takenIds,
  onTake,
}: {
  tasks: Task[]
  loading: boolean
  takenIds: string[]
  onTake: (task: Task) => void
}) {
  const theme = THEMES.seeker

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Tugas tersedia di sekitarmu</p>
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-slate-700">Live</span>
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => {
            const taken = takenIds.includes(task.id)
            const cat = CATEGORY_META[task.category]
            return (
              <article
                key={task.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <CategoryIcon category={task.category} className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                  </span>
                  {task.live && (
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Live</span>
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900 text-balance">{task.title}</h2>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {task.distance}
                  </span>
                  <span>•</span>
                  <span>{task.poster}</span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Bayaran</p>
                    <p className="text-3xl font-bold tracking-tight text-slate-900">{formatRupiah(task.price)}</p>
                  </div>
                  <button
                    disabled={taken}
                    onClick={() => onTake(task)}
                    className={cn(
                      "min-h-[44px] rounded-full px-6 text-sm font-bold transition-all active:scale-95",
                      taken
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : cn(theme.solidBg, theme.solidBgHover, theme.textOnAccent, "hover:-translate-y-0.5"),
                    )}
                  >
                    {taken ? "Diambil" : "Ambil Job"}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TaskSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-10 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="mt-2 h-5 w-1/2 animate-pulse rounded-lg bg-slate-100" />
      <div className="mt-5 flex items-end justify-between">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  )
}
