import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("taskmaster")

    // Check if collection exists and has documents
    const collections = await db.listCollections({ name: "tasks" }).toArray()
    if (collections.length > 0) {
      const count = await db.collection("tasks").countDocuments()
      if (count > 0) {
        return NextResponse.json({
          message: "Database already seeded",
          count,
        })
      }
    }

    // Create sample tasks
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const sampleTasks = [
      {
        title: "Complete project documentation",
        description: "Finish writing the technical documentation for the new feature",
        status: "pending",
        priority: "high",
        dueDate: tomorrow.toISOString(),
        reminder: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        title: "Review pull requests",
        description: "Review and approve pending pull requests from the team",
        status: "in-progress",
        priority: "medium",
        dueDate: tomorrow.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        title: "Weekly team meeting",
        description: "Prepare agenda for the weekly team sync",
        status: "pending",
        priority: "medium",
        dueDate: nextWeek.toISOString(),
        reminder: new Date(nextWeek.setHours(13, 0, 0, 0)).toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        title: "Fix critical bug in production",
        description: "Address the authentication issue reported by users",
        status: "completed",
        priority: "high",
        completedAt: yesterday.toISOString(),
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
      },
      {
        title: "Update dependencies",
        description: "Update all npm packages to their latest versions",
        status: "pending",
        priority: "low",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        title: "Refactor authentication module",
        description: "Improve code quality and performance of the auth system",
        status: "pending",
        priority: "medium",
        dueDate: nextWeek.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ]

    const result = await db.collection("tasks").insertMany(sampleTasks)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      count: result.insertedCount,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
  }
}

