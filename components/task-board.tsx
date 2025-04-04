import { getTasks } from "@/lib/data"
import { TaskCard } from "@/components/task-card"
import { EmptyState } from "@/components/empty-state"

export async function TaskBoard() {
  const tasks = await getTasks()

  if (tasks.length === 0) {
    return <EmptyState type="tasks" />
  }

  // Define different sizes for task cards - more variety
  const getSizeClass = (index: number, priority: string) => {
    // Make high priority tasks larger on average
    if (priority === "high") {
      const sizes = ["col-span-2 row-span-2", "col-span-2 row-span-1", "col-span-1 row-span-2"]
      return sizes[index % sizes.length]
    }

    // Medium priority tasks with mixed sizes
    if (priority === "medium") {
      const sizes = ["col-span-1 row-span-1", "col-span-2 row-span-1", "col-span-1 row-span-2", "col-span-1 row-span-1"]
      return sizes[index % sizes.length]
    }

    // Low priority tasks mostly smaller
    const sizes = ["col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-2", "col-span-2 row-span-1"]
    return sizes[index % sizes.length]
  }

  // Define Ghibli-inspired colors for task cards based on priority
  const getColorClass = (priority: string, index: number) => {
    // Ghibli-inspired color palettes
    const highPriorityColors = [
      "bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 border-rose-300 dark:border-rose-800",
      "bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/30 dark:to-orange-800/30 border-red-300 dark:border-red-800",
      "bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/30 dark:to-amber-800/30 border-orange-300 dark:border-orange-800",
    ]

    const mediumPriorityColors = [
      "bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 border-amber-300 dark:border-amber-800",
      "bg-gradient-to-br from-yellow-100 to-lime-200 dark:from-yellow-900/30 dark:to-lime-800/30 border-yellow-300 dark:border-yellow-800",
      "bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900/30 dark:to-cyan-800/30 border-teal-300 dark:border-teal-800",
    ]

    const lowPriorityColors = [
      "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 border-green-300 dark:border-green-800",
      "bg-gradient-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-800/30 border-blue-300 dark:border-blue-800",
      "bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-indigo-900/30 dark:to-violet-800/30 border-indigo-300 dark:border-indigo-800",
    ]

    switch (priority) {
      case "high":
        return highPriorityColors[index % highPriorityColors.length]
      case "medium":
        return mediumPriorityColors[index % mediumPriorityColors.length]
      case "low":
        return lowPriorityColors[index % lowPriorityColors.length]
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30 border-gray-300 dark:border-gray-700"
    }
  }

  // Get priority emoji
  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "high":
        return "🚨"
      case "medium":
        return "⚠️"
      case "low":
        return "✅"
      default:
        return "📝"
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your daily tasks and projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
        {tasks.map((task, index) => (
          <div key={task._id} className={getSizeClass(index, task.priority)}>
            <TaskCard
              task={task}
              colorClass={getColorClass(task.priority, index)}
              priorityEmoji={getPriorityEmoji(task.priority)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

