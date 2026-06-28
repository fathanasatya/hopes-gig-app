"use client"

import { useState } from "react"
import { supabase } from '@/lib/supabase';
import { Lock, X, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, CATEGORY_META, formatRupiah, type TaskCategory } from "@/lib/hopes"

type PostTaskData = { title: string; category: TaskCategory; price: number }
import { CategoryIcon } from "./category-icon"

const CATEGORIES = Object.keys(CATEGORY_META) as TaskCategory[]

export function CreateTask({ onPost }: { onPost: (data: PostTaskData) => void }) {
  const theme = THEMES.giver
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TaskCategory>("antar")
  const [price, setPrice] = useState("")
  const [showModal, setShowModal] = useState(false)

  const priceNumber = Number(price) || 0
  const canSubmit = title.trim().length > 0 && priceNumber > 0

  async function handleConfirm() {
    try {
      // 1. Panggil fungsi onPost yang dikirim dari page.tsx
      onPost({ 
        title: title.trim(), 
        category: category, 
        price: priceNumber 
      });

      // 2. Tutup modal & Bersihkan form lokal
      setShowModal(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("antar");

    } catch (err) {
      console.error("System Error:", err);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-500">Posting kebutuhanmu, dana diamankan Escrow</p>

      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5">
        {/* Title */}
        <Field label="Judul Tugas">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth. Antar dokumen ke kantor"
            className={cn(
              "min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2",
              theme.ring,
            )}
          />
        </Field>

        {/* Description */}
        <Field label="Deskripsi">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Jelaskan detail tugas, lokasi, dan ekspektasi..."
            className={cn(
              "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2",
              theme.ring,
            )}
          />
        </Field>

        {/* Category chips */}
        <Field label="Kategori">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all active:scale-95",
                    active
                      ? cn(theme.solidBg, theme.border, theme.textOnAccent)
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  <CategoryIcon category={cat} className="h-4 w-4" />
                  {CATEGORY_META[cat].label}
                </button>
              )
            })}
          </div>
        </Field>

        {/* Price */}
        <Field label="Bayaran (Rp)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder="15000"
            className={cn(
              "min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-lg font-bold text-slate-900 outline-none transition-colors placeholder:font-normal placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2",
              theme.ring,
            )}
          />
        </Field>
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => setShowModal(true)}
        className={cn(
          "flex min-h-[52px] items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all active:scale-95",
          canSubmit
            ? cn(theme.solidBg, theme.solidBgHover, theme.textOnAccent, "hover:-translate-y-0.5")
            : "cursor-not-allowed bg-slate-100 text-slate-400",
        )}
      >
        Posting Tugas
      </button>

      {/* Escrow confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in sm:items-center"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom-4"
          >
            <div className="flex items-start justify-between">
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", theme.softBg)}>
                <ShieldCheck className={cn("h-6 w-6", theme.softText)} />
              </span>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">Konfirmasi Escrow</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Saldo{" "}
              <span className="font-bold text-slate-900">{formatRupiah(priceNumber)}</span> akan dikunci oleh sistem
              secara aman di dalam sistem{" "}
              <span className={cn("font-semibold", theme.text)}>Escrow Trustless</span>. Dana hanya cair setelah tugas
              kamu konfirmasi selesai.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Lock className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Jumlah dikunci</p>
                <p className="text-lg font-bold text-slate-900">{formatRupiah(priceNumber)}</p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className={cn(
                "mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all active:scale-95",
                theme.solidBg,
                theme.solidBgHover,
                theme.textOnAccent,
              )}
            >
              <Lock className="h-5 w-5" />
              Kunci &amp; Sebarkan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}
