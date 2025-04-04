import { Skeleton } from "@/components/ui/skeleton"

export function TaskBoardSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={i % 3 === 0 ? "col-span-1 row-span-2" : "col-span-1 row-span-1"}>
            <Skeleton className="h-full min-h-[180px] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

