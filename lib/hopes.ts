export type Role = "giver" | "seeker"

export type Theme = {
  role: Role
  label: string
  tagline: string
  solidBg: string
  solidBgHover: string
  text: string
  textOnAccent: string
  ring: string
  border: string
  softBg: string
  softText: string
  dot: string
}

// Static class strings so Tailwind can detect them at build time.
export const THEMES: Record<Role, Theme> = {
  giver: {
    role: "giver",
    label: "Cari Bantuan",
    tagline: "Mode Pemberi Tugas",
    solidBg: "bg-emerald-800",
    solidBgHover: "hover:bg-emerald-900",
    text: "text-emerald-800",
    textOnAccent: "text-white",
    ring: "ring-emerald-800",
    border: "border-emerald-800",
    softBg: "bg-emerald-50",
    softText: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  seeker: {
    role: "seeker",
    label: "Cari Uang",
    tagline: "Mode Pencari Kerja",
    solidBg: "bg-lime-500",
    solidBgHover: "hover:bg-lime-600",
    text: "text-lime-600",
    textOnAccent: "text-slate-900",
    ring: "ring-lime-500",
    border: "border-lime-500",
    softBg: "bg-lime-50",
    softText: "text-lime-700",
    dot: "bg-lime-500",
  },
}

export type ViewKey = "dashboard" | "board" | "create" | "vault"

export function formatRupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID")
}

export type TaskCategory = "antar" | "bersih" | "desain" | "tulis" | "ngoding" | "lainnya"

export type Task = {
  id: string
  title: string
  category: TaskCategory
  price: number
  poster: string
  distance: string
  live: boolean
}

export const CATEGORY_META: Record<TaskCategory, { label: string; icon: string }> = {
  antar: { label: "Antar", icon: "Bike" },
  bersih: { label: "Bersih-bersih", icon: "Sparkles" },
  desain: { label: "Desain", icon: "PenTool" },
  tulis: { label: "Tulis", icon: "FileText" },
  ngoding: { label: "Ngoding", icon: "Code" },
  lainnya: { label: "Lainnya", icon: "Boxes" },
}

export const SAMPLE_TASKS: Task[] = [
  {
    id: "t1",
    title: "Antar dokumen ke kantor pusat sebelum jam 3 sore",
    category: "antar",
    price: 25000,
    poster: "Rina W.",
    distance: "1.2 km",
    live: true,
  },
  {
    id: "t2",
    title: "Bantu desain feed Instagram 5 slide untuk promo kopi",
    category: "desain",
    price: 75000,
    poster: "Kedai Senja",
    distance: "Remote",
    live: true,
  },
  {
    id: "t3",
    title: "Bersihin kos 2 kamar, sapu pel dan rapikan",
    category: "bersih",
    price: 40000,
    poster: "Bagas P.",
    distance: "0.8 km",
    live: true,
  },
  {
    id: "t4",
    title: "Tulis ulang 3 artikel blog jadi lebih SEO friendly",
    category: "tulis",
    price: 60000,
    poster: "Maya S.",
    distance: "Remote",
    live: false,
  },
  {
    id: "t5",
    title: "Fix bug kecil di landing page Next.js (1 komponen)",
    category: "ngoding",
    price: 120000,
    poster: "Devan T.",
    distance: "Remote",
    live: true,
  },
]
