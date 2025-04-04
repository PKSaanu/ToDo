"use client"
import { cn } from "@/lib/utils"

export function AnimatedBackground() {
  // Single blue background with a subtle radial gradient
  const blueBackground = "bg-[radial-gradient(circle_at_center,_#1e40af_0%,_#1e3a8a_40%,_#0f172a_80%)]"
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Single static background layer */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          blueBackground
        )}
      />
    </div>
  )
}