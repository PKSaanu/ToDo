"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertCircle, Bell, Calendar, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { completeTask, deleteTask } from "@/lib/actions"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { toast } from "@/components/ui/use-toast"

interface TaskCardProps {
  task: Task
  colorClass: string
  priorityEmoji: string
}

export function TaskCard({ task, colorClass, priorityEmoji }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [shimmerPosition, setShimmerPosition] = useState(0)

  // Shimmer effect animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPosition((prev) => (prev + 1) % 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Check for reminder notifications
  useEffect(() => {
    if (!task.reminder || task.status === "completed") return

    const reminderTime = new Date(task.reminder).getTime()
    const now = new Date().getTime()
    const thirtyMinutesInMs = 30 * 60 * 1000

    // If reminder is within 30 minutes from now
    if (reminderTime > now && reminderTime - now <= thirtyMinutesInMs) {
      setShowNotification(true)

      // Request browser notification permission
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
      }

      // Show browser notification if permitted
      if (Notification.permission === "granted") {
        new Notification("Task Reminder", {
          body: `${task.title} is due in 30 minutes`,
          icon: "/favicon.ico",
        })
      }

      // Hide notification after 10 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [task])

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await completeTask(task._id)
      toast({
        title: "Success",
        description: "Task marked as complete",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task._id)
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="border-rose-500 text-rose-400 text-xs whitespace-nowrap">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-400 text-xs whitespace-nowrap">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-400 text-xs whitespace-nowrap">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  // Format due date with proper error handling
  const formatDueDate = () => {
    try {
      if (!task.dueDate) return null
      const date = parseISO(task.dueDate)
      return format(date, "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting due date:", error)
      return "Invalid date"
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <>
      {/* Notification toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-amber-500 animate-bounce max-w-md">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">Due in 30 minutes</p>
            </div>
          </div>
        </div>
      )}

      <Card
        className={cn(
          "h-full border transition-all hover:shadow-md relative overflow-hidden backdrop-blur-sm bg-gray-900/30",
          colorClass,
          task.priority === "high" && "animate-pulse-slow",
        )}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            transform: `translateX(${-50 + shimmerPosition}%)`,
            width: "100%",
            opacity: 0.5,
          }}
        />

        {/* Dynamic background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-black -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black -ml-12 -mb-12"></div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            {/* Left side: Checkbox, emoji, title */}
            <div className="flex items-start gap-3 min-w-0">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={handleComplete}
                disabled={isCompleting}
                className="mt-1"
              />
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                    {priorityEmoji}
                  </span>
                  <h3
                    className={cn(
                      "font-medium text-base break-words truncate",
                      task.status === "completed" && "line-through text-gray-400",
                    )}
                  >
                    {task.title}
                  </h3>
                </div>
                
                {task.dueDate && (
                  <div className="flex flex-wrap items-center text-sm text-gray-400">
                    <div className="flex items-center mr-3">
                      <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span className={cn(isOverdue && "text-red-400")}>
                        {formatDueDate()}
                      </span>
                    </div>
                    
                    {task.dueTime && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{task.dueTime}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Priority badge & menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {getPriorityBadge(task.priority)}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {task.description && (
          <CardContent className="p-4 pt-0">
            <p className="text-gray-300 text-sm break-words">
              {task.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {task.reminder && (
            <div className="flex items-center text-xs text-gray-400">
              <Bell className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span>{format(new Date(task.reminder), "MMM d, h:mm a")}</span>
            </div>
          )}

          {isOverdue && (
            <div className="flex items-center text-xs text-red-400 ml-auto">
              <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span>Overdue</span>
            </div>
          )}
        </CardFooter>
      </Card>

      <EditTaskDialog task={task} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  )
}