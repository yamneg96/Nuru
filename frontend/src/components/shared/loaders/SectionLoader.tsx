import { NuruSkeleton } from "./NuruSkeleton"

export function SectionLoader() {
  return (
    <div className="space-y-4">
      <NuruSkeleton className="h-6 w-1/3" />
      <NuruSkeleton className="h-32 w-full" />
      <NuruSkeleton className="h-32 w-full" />
    </div>
  )
}