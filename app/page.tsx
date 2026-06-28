"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { Bell, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, formatRupiah, SAMPLE_TASKS, type Role, type ViewKey, type Task, type TaskCategory } from "@/lib/hopes"
import { BottomNav, SideNav } from "@/components/hopes/navigation"
import { Dashboard } from "@/components/hopes/dashboard"
import { LiveBoard } from "@/components/hopes/live-board"
import { CreateTask } from "@/components/hopes/create-task"
import { Vault } from "@/components/hopes/vault"
import { ToastStack, type ToastData } from "@/components/hopes/toast"

const VIEW_TITLES: Partial<Record<ViewKey, string>> = {
  board: "Live Board",
  create: "Buat Tugas",
  vault: "The Vault",
}

export default function HopesApp() {
  const [role, setRole] = useState<Role>("seeker")
  const [view, setView] = useState<ViewKey>("dashboard")
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function fetchLiveTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Gagal menarik data dari Supabase:", error)
      } else if (data) {
        setTasks(data)
      }
    }

    fetchLiveTasks()
  }, [])

  const [boardLoading, setBoardLoading] = useState(false)
  const [takenIds, setTakenIds] = useState<string[]>([])
  const [toasts, setToasts] = useState<ToastData[]>([])
  const toastId = useRef(0)

  const theme = THEMES[role]

  const pushToast = useCallback((message: string, accentText: string) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, message, accentText }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const navigate = useCallback((next: ViewKey) => {
    setView(next)
    if (next === "board") {
      setBoardLoading(true)
      setTimeout(() => setBoardLoading(false), 1000)
    }
  }, [])

  const handleRoleChange = useCallback(
    (next: Role) => {
      setRole(next)
      // Switch to a view valid for the new role
      if (view === "board" && next === "giver") navigate("create")
      else if (view === "create" && next === "seeker") navigate("board")
    },
    [view, navigate],
  )

  async function handleTakeJob(task: Task) {
    // 1. Update status di database ke 'TAKEN' dan masukkan seeker_id
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: 'TAKEN',
        job_seeker_id: '11111111-1111-1111-1111-111111111111' // ID dummy seeker kita
      })
      .eq('id', task.id);

    if (error) {
      pushToast("Gagal mengambil tugas.", "text-red-500");
      return;
    }

    // 2. Jika sukses, update state lokal agar UI langsung merespon
    setTakenIds((prev) => [...prev, task.id]);
    pushToast(`Job diambil! ${formatRupiah(task.price)} menunggu di Vault.`, THEMES.seeker.text);
    navigate("vault");
  }

  async function handlePostTask(data: { title: string; category: TaskCategory; price: number }) {
    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          task_giver_id: '11111111-1111-1111-1111-111111111111', 
          title: data.title,
          description: data.title, 
          category: data.category,
          price: data.price,
          status: 'OPEN'
          // Baris poster, distance, dan live DIHAPUS karena tidak ada di tabel Supabase
        }
      ]);

    if (error) {
      console.error("Gagal memposting tugas:", error);
      pushToast("Gagal memposting tugas ke database.", "text-red-500");
      return;
    }

    pushToast(`Tugas diposting! ${formatRupiah(data.price)} terkunci di Escrow.`, THEMES.giver.text);
    navigate("board"); 
  }

// Filter tugas untuk Live Board dan Vault
const openTasks = tasks.filter(t => t.status === 'OPEN');
const takenTasks = tasks.filter(t => t.status === 'TAKEN' && t.job_seeker_id === '11111111-1111-1111-1111-111111111111');
  function handleReleaseFunds() {
    pushToast("Dana berhasil dicairkan ke pekerja.", THEMES.giver.text)
  }

  return (
    <div className={cn("min-h-screen bg-slate-50", view === "vault" && "h-[100dvh] overflow-hidden")}>
      <ToastStack toasts={toasts} />

      <div className={cn("mx-auto flex max-w-6xl", view === "vault" && "h-full overflow-hidden")}>
        <SideNav role={role} active={view} onNavigate={navigate} />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            className={cn(
              "mx-auto flex w-full max-w-2xl flex-col px-4",
              view === "vault"
                ? "h-full min-h-0 flex-1 overflow-hidden pb-0 md:pb-10"
                : "pb-28 md:pb-10",
            )}
          >
            {/* Header */}
            <header
              className={cn(
                "z-30 shrink-0 -mx-4 bg-slate-50/90 px-4 py-3 backdrop-blur",
                view === "vault" ? "relative" : "sticky top-0",
              )}
            >
              {view === "dashboard" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-slate-900">HOPES</span>
                  </div>
                  <button
                    aria-label="Notifikasi"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("dashboard")}
                    aria-label="Kembali ke Beranda"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">{VIEW_TITLES[view]}</h1>
                </div>
              )}
            </header>

            <main className={cn(view === "vault" ? "flex min-h-0 flex-1 flex-col" : "mt-4")}>
  {view === "dashboard" && (
    <Dashboard role={role} onNavigate={navigate} onRoleChange={handleRoleChange} />
  )}
  {view === "board" && (
    <LiveBoard tasks={openTasks} loading={boardLoading} takenIds={takenIds} onTake={handleTakeJob} />
  )}
  {view === "create" && <CreateTask onPost={handlePostTask} />}
  {view === "vault" && (
    <Vault tasks={takenTasks} role={role} onReleaseFunds={handleReleaseFunds} />
  )}
</main>
          </div>
        </div>
      </div>

      <BottomNav role={role} active={view} onNavigate={navigate} />
    </div>
  )
}
