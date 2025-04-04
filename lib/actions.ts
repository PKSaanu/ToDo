"use server"

import clientPromise from "./mongodb"
import type { TaskInput, TaskUpdateInput } from "./types"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

export async function addTask(taskData: TaskInput) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  // Local time conversion on server
  const now = new Date().toISOString()  // This gets the current UTC time, you can use the server's local time if needed

  // Convert due date and reminder to local time if it's stored in UTC
  const convertToLocalTime = (dateString: string) => {
    const dateObj = new Date(dateString);
    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString(); // Convert to local time
  };

  let dueDate = taskData.dueDate ? convertToLocalTime(taskData.dueDate) : null;
  let reminderDate = taskData.reminder ? convertToLocalTime(taskData.reminder) : null;

  const result = await db.collection("tasks").insertOne({
    ...taskData,
    dueDate,        // Use the converted due date
    reminder: reminderDate, // Use the converted reminder date
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath("/")
  return { success: true, id: result.insertedId.toString() }
}


export async function updateTask(taskData: TaskUpdateInput) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  const { _id, ...updateData } = taskData

  await db.collection("tasks").updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  revalidatePath("/")
  revalidatePath("/reminders")
  return { success: true }
}

export async function completeTask(id: string) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  const now = new Date().toISOString()

  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "completed",
        completedAt: now,
        updatedAt: now,
      },
    },
  )

  revalidatePath("/")
  revalidatePath("/history")
  revalidatePath("/reminders")
  return { success: true }
}

export async function deleteTask(id: string) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  await db.collection("tasks").deleteOne({ _id: new ObjectId(id) })

  revalidatePath("/")
  revalidatePath("/history")
  revalidatePath("/reminders")
  return { success: true }
}

export async function addReminder(id: string, reminderDate: string) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        reminder: reminderDate,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  revalidatePath("/")
  revalidatePath("/reminders")
  return { success: true }
}

export async function removeReminder(id: string) {
  const client = await clientPromise
  const db = client.db("taskmaster")

  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        reminder: null,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  revalidatePath("/")
  revalidatePath("/reminders")
  return { success: true }
}

