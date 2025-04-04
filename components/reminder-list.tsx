import { getTasksWithReminders } from "@/lib/data"
import { format } from "date-fns"
import { Bell, Calendar } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { ReminderActions } from "@/components/reminder-actions"

export async function ReminderList() {
  const tasksWithReminders = await getTasksWithReminders()

  if (tasksWithReminders.length === 0) {
    return <EmptyState type="reminders" />
  }

  // Group reminders by date
  const groupedReminders: Record<string, typeof tasksWithReminders> = {}

  tasksWithReminders.forEach((task) => {
    if (!task.reminder) return

    const reminderDate = format(new Date(task.reminder), "yyyy-MM-dd")
    if (!groupedReminders[reminderDate]) {
      groupedReminders[reminderDate] = []
    }
    groupedReminders[reminderDate].push(task)
  })

  // Sort dates
  const sortedDates = Object.keys(groupedReminders).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">
            {format(new Date(date), "EEEE, MMMM d, yyyy")}
          </h2>

          <div className="space-y-2">
            {groupedReminders[date].map((task) => (
              <div
                key={task._id}
                className="flex items-start p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <Bell className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-100">{task.title}</h3>
                    <span className="text-sm text-gray-400">
                      {format(new Date(task.reminder!), "h:mm a")}
                    </span>
                  </div>

                  {task.description && (
                    <p className="mt-1 text-sm text-gray-300">{task.description}</p>
                  )}

                  {task.dueDate && (
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                    </div>
                  )}

                  <div className="mt-3">
                    <ReminderActions task={task} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

