import { Suspense } from "react"
import { HistoryList } from "@/components/history-list"
import { HistoryListSkeleton } from "@/components/skeletons/history-list-skeleton"
import { DashboardHeader } from "@/components/dashboard-header"

export default function HistoryPage() {
  return (
    <div className="min-h-screen backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task History</h1>
          <p className="text-gray-600 dark:text-gray-400">View your completed tasks and activity</p>
        </div>

        <main>
          <Suspense fallback={<HistoryListSkeleton />}>
            <HistoryList />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

