import { Suspense } from "react"
import { ReminderList } from "@/components/reminder-list"
import { ReminderListSkeleton } from "@/components/skeletons/reminder-list-skeleton"
import { DashboardHeader } from "@/components/dashboard-header"

export default function RemindersPage() {
  return (
    <div className="min-h-screen backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your task reminders</p>
        </div>

        <main>
          <Suspense fallback={<ReminderListSkeleton />}>
            <ReminderList />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

