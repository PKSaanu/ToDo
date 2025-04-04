import { Skeleton } from "@/components/ui/skeleton"

export function ReminderListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <Skeleton className="h-6 w-48" />

          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <Skeleton key={itemIndex} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

