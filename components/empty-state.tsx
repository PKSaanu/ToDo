"use client"

import { Button } from "@/components/ui/button"
import { CheckSquare, History, Bell, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  type: "tasks" | "history" | "reminders"
}

export function EmptyState({ type }: EmptyStateProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  
  // Matching the gradient from DashboardHeader
  const buttonGradient = "from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
  
  const content = {
    tasks: {
      icon: <CheckSquare className="h-12 w-12 text-gray-400" />,
      title: "No tasks yet",
      description: "Create your first task to get started",
      action: (
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className={cn(
            "bg-gradient-to-r text-white",
            buttonGradient
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      ),
    },
    history: {
      icon: <History className="h-12 w-12 text-gray-400" />,
      title: "No completed tasks",
      description: "Your completed tasks will appear here",
      action: (
        <Link href="/">
          <Button variant="outline">Go to Tasks</Button>
        </Link>
      ),
    },
    reminders: {
      icon: <Bell className="h-12 w-12 text-gray-400" />,
      title: "No reminders set",
      description: "Add reminders to your tasks to get notified",
      action: (
        <Link href="/">
          <Button variant="outline">Go to Tasks</Button>
        </Link>
      ),
    },
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-800 p-6 rounded-full mb-4">{content[type].icon}</div>
      <h2 className="text-xl font-semibold mb-2">{content[type].title}</h2>
      <p className="text-gray-400 mb-6">{content[type].description}</p>
      {content[type].action}
      
      {/* Dialog component for adding tasks */}
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  )
}