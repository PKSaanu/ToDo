import { getCompletedTasks } from "@/lib/data"
import { format } from "date-fns"
import { CheckCircle2 } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

export async function HistoryList() {
  const completedTasks = await getCompletedTasks()

  if (completedTasks.length === 0) {
    return <EmptyState type="history" />
  }

  // Group tasks by completion date
  const groupedTasks: Record<string, typeof completedTasks> = {}

  completedTasks.forEach((task) => {
    const completedDate = format(new Date(task.completedAt || task.updatedAt), "yyyy-MM-dd")
    if (!groupedTasks[completedDate]) {
      groupedTasks[completedDate] = []
    }
    groupedTasks[completedDate].push(task)
  })

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {format(new Date(date), "EEEE, MMMM d, yyyy")}
          </h2>

          <div className="space-y-2">
            {groupedTasks[date].map((task) => (
              <div
                key={task._id}
                className="flex items-start p-4 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(task.completedAt || task.updatedAt), "h:mm a")}
                    </span>
                  </div>

                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

