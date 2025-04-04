"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTask } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Priority = "low" | "medium" | "high"

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium") 
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")

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

    if (!dueDate.trim()) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let combinedDueDate = null
      if (dueDate) {
        // Parse date using UTC to avoid time zone issues
        const [year, month, day] = dueDate.split("-").map(Number)
        let dueDateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)) // Midnight UTC

        if (dueTime) {
          const [hours, minutes] = dueTime.split(":").map(Number)
          dueDateObj.setUTCHours(hours, minutes, 0, 0) // Set UTC time
        }

        combinedDueDate = dueDateObj.toISOString()
      }

      let reminderDateTime = null
      if (reminderDate && reminderTime) {
        const [year, month, day] = reminderDate.split("-").map(Number)
        let reminderDateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))

        const [hours, minutes] = reminderTime.split(":").map(Number)
        reminderDateObj.setUTCHours(hours, minutes, 0, 0)

        reminderDateTime = reminderDateObj.toISOString()
      }

      console.log("📌 Final Due Date:", combinedDueDate)
      console.log("⏰ Final Reminder Date:", reminderDateTime)

      await addTask({
        title,
        description,
        priority,
        dueDate: combinedDueDate,
        dueTime: dueTime || null,
        reminder: reminderDateTime,
        status: "pending",
      })

      toast({
        title: "Success",
        description: "Task added successfully",
      })

      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")
      setDueTime("")
      setReminderDate("")
      setReminderTime("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
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
          <DialogTitle>Add New Task</DialogTitle>
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
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
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
            <Label htmlFor="dueDate">Due Date & Time <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
                required
              />
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full"
                aria-label="Due time (optional)"
              />
            </div>
            <p className="text-sm text-gray-500">Due date is required, time is optional</p>
          </div>

          <div className="space-y-2">
            <Label>Reminder (Optional)</Label>
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
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}