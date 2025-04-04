import clientPromise from "./mongodb"
import type { Task } from "./types"
import { ObjectId } from "mongodb"
import { cache } from "react"

// Use React cache to avoid duplicate requests
export const getTasks = cache(async (): Promise<Task[]> => {
  const client = await clientPromise
  const db = client.db("taskmaster")

  const tasks = await db
    .collection("tasks")
    .find({ status: { $ne: "completed" } })
    .sort({ createdAt: -1 })
    .toArray()

  return tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
  })) as Task[]
})

export const getCompletedTasks = cache(async (): Promise<Task[]> => {
  const client = await clientPromise
  const db = client.db("taskmaster")

  const tasks = await db
    .collection("tasks")
    .find({ status: "completed" })
    .sort({ completedAt: -1, updatedAt: -1 })
    .toArray()

  return tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
  })) as Task[]
})

export const getTasksWithReminders = cache(async (): Promise<Task[]> => {
  const client = await clientPromise
  const db = client.db("taskmaster")

  const now = new Date()

  const tasks = await db
    .collection("tasks")
    .find({
      reminder: { $ne: null },
      status: { $ne: "completed" },
    })
    .sort({ reminder: 1 })
    .toArray()

  return tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
  })) as Task[]
})

export const getTaskById = cache(async (id: string): Promise<Task | null> => {
  const client = await clientPromise
  const db = client.db("taskmaster")

  try {
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })

    if (!task) return null

    return {
      ...task,
      _id: task._id.toString(),
    } as Task
  } catch (error) {
    console.error("Error fetching task:", error)
    return null
  }
})

