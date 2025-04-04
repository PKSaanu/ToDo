export interface Task {
  _id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string | null
  dueTime?: string | null
  reminder?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: string | null
  dueTime?: string | null
  reminder?: string | null
}

export interface TaskUpdateInput extends TaskInput {
  _id: string
}

