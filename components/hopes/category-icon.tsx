import { Bike, Sparkles, PenTool, FileText, Code, Boxes, type LucideIcon } from "lucide-react"
import type { TaskCategory } from "@/lib/hopes"

const ICONS: Record<TaskCategory, LucideIcon> = {
  antar: Bike,
  bersih: Sparkles,
  desain: PenTool,
  tulis: FileText,
  ngoding: Code,
  lainnya: Boxes,
}

export function CategoryIcon({
  category,
  className,
}: {
  category: TaskCategory
  className?: string
}) {
  const Icon = ICONS[category]
  return <Icon className={className} />
}
