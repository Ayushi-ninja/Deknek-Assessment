function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-2 w-16 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="flex gap-1 mt-2">
          <div className="h-3 w-12 skeleton rounded" />
          <div className="h-3 w-16 skeleton rounded" />
        </div>
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
