import { Suspense } from "react"
import { TaskBoard } from "@/components/task-board"
import { TaskBoardSkeleton } from "@/components/skeletons/task-board-skeleton"
import { DashboardHeader } from "@/components/dashboard-header"

export default function HomePage() {
  return (
    <div className="min-h-screen backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <main>
          <Suspense fallback={<TaskBoardSkeleton />}>
            <TaskBoard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

