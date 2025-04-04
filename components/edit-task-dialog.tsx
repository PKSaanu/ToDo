"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import { updateTask } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import type { Task } from "@/lib/types"

interface EditTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority as "low" | "medium" | "high")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState(task.dueTime || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize reminder date and time from task
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")

  // Initialize form values when dialog opens or task changes
  useEffect(() => {
    if (open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority as "low" | "medium" | "high")

      // Set due date
      if (task.dueDate) {
        try {
          const date = parseISO(task.dueDate)
          setDueDate(format(date, "yyyy-MM-dd"))
        } catch (error) {
          console.error("Error parsing due date:", error)
          setDueDate("")
        }
      } else {
        setDueDate("")
      }

      // Set due time
      setDueTime(task.dueTime || "")

      // Set reminder date and time
      if (task.reminder) {
        try {
          const reminderDate = parseISO(task.reminder)
          setReminderDate(format(reminderDate, "yyyy-MM-dd"))
          setReminderTime(format(reminderDate, "HH:mm"))
        } catch (error) {
          console.error("Error parsing reminder date:", error)
          setReminderDate("")
          setReminderTime("")
        }
      } else {
        setReminderDate("")
        setReminderTime("")
      }
    }
  }, [open, task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time for due date if both are provided
      let combinedDueDate = null
      if (dueDate) {
        const dueDateObj = new Date(dueDate)
        if (dueTime) {
          const [hours, minutes] = dueTime.split(":").map(Number)
          dueDateObj.setHours(hours, minutes, 0, 0)
        } else {
          // Set to noon if no time specified
          dueDateObj.setHours(12, 0, 0, 0)
        }
        combinedDueDate = dueDateObj.toISOString()
      }

      // Combine date and time for reminder if both are provided
      let reminderDateTime = null
      if (reminderDate && reminderTime) {
        const reminderDateObj = new Date(reminderDate)
        const [hours, minutes] = reminderTime.split(":").map(Number)
        reminderDateObj.setHours(hours, minutes, 0, 0)
        reminderDateTime = reminderDateObj.toISOString()
      }

      await updateTask({
        _id: task._id,
        title,
        description,
        priority,
        dueDate: combinedDueDate,
        dueTime: dueTime || null,
        reminder: reminderDateTime,
        status: task.status,
      })

      toast({
        title: "Success",
        description: "Task updated successfully",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date & Time</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full" />
              <Input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reminder Date & Time</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full"
              />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}