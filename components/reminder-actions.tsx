"use client"

import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { BellOff, Check } from "lucide-react"
import { removeReminder, completeTask } from "@/lib/actions"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface ReminderActionsProps {
  task: Task
}

export function ReminderActions({ task }: ReminderActionsProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleRemoveReminder = async () => {
    setIsRemoving(true)
    try {
      await removeReminder(task._id)
      toast({
        title: "Success",
        description: "Reminder removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove reminder",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const handleCompleteTask = async () => {
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

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleRemoveReminder} disabled={isRemoving}>
        <BellOff className="h-3.5 w-3.5 mr-1" />
        Remove Reminder
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCompleteTask}
        disabled={isCompleting}
        className=" text-green-400 border-green-800 hover:bg-green-900/20"
      >
        <Check className="h-3.5 w-3.5 mr-1" />
        Complete
      </Button>
    </div>
  )
}

