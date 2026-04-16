export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <div className="rounded-2xl aspect-[16/9] bg-gray-200 animate-pulse" />
  )
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
