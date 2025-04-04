"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CheckSquare, History, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const pathname = usePathname()
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  
  // Matching the deep blue gradient from the background
  const headerGradient = "from-blue-600 via-blue-700 to-blue-800"
  const buttonGradient = "from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700"
  const activeColor = "border-blue-500"
  
  return (
    <header className="mb-8 backdrop-blur-md bg-white/5 rounded-lg p-4 md:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className={cn(
          "text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          headerGradient
        )}>
          Saanu's Work Log
        </h1>
        <Button
          onClick={() => setIsAddTaskOpen(true)}
          className={cn(
            "bg-gradient-to-r text-white w-full sm:w-auto",
            buttonGradient
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      <nav className="flex flex-wrap md:flex-nowrap space-x-0 md:space-x-1 border-b border-white/10">
        <Link
          href="/"
          className={cn(
            "px-3 md:px-4 py-2 flex items-center transition-colors text-sm md:text-base",
            pathname === "/"
              ? `border-b-2 font-medium ${activeColor}`
              : "text-gray-300 hover:text-white"
          )}
        >
          <CheckSquare className="mr-1 md:mr-2 h-4 w-4" />
          Tasks
        </Link>
        <Link
          href="/history"
          className={cn(
            "px-3 md:px-4 py-2 flex items-center transition-colors text-sm md:text-base",
            pathname === "/history"
              ? `border-b-2 font-medium ${activeColor}`
              : "text-gray-300 hover:text-white"
          )}
        >
          <History className="mr-1 md:mr-2 h-4 w-4" />
          History
        </Link>
        <Link
          href="/reminders"
          className={cn(
            "px-3 md:px-4 py-2 flex items-center transition-colors text-sm md:text-base",
            pathname === "/reminders"
              ? `border-b-2 font-medium ${activeColor}`
              : "text-gray-300 hover:text-white"
          )}
        >
          <Bell className="mr-1 md:mr-2 h-4 w-4" />
          Reminders
        </Link>
      </nav>
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </header>
  )
}