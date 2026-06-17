import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-cyan-300/10 bg-[hsl(218,36%,10%)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-7 w-20" />
          <Skeleton className="mt-3 h-3 w-32" />
        </div>
        <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="rounded-lg border border-cyan-300/10 bg-[hsl(218,36%,10%)] p-5">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-1 h-3 w-56" />
      <div className="mt-4 flex items-end gap-1" style={{ height }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${25 + ((i * 17) % 61)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AlertSkeleton() {
  return (
    <div className="rounded-md border border-cyan-300/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-3/4" />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-lg border border-cyan-300/10 bg-[hsl(218,36%,10%)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <span className="text-xs text-slate-400">Loading climate data...</span>
      </div>
      <div className="absolute inset-0 bg-radar-grid bg-[size:40px_40px] opacity-30" />
    </div>
  );
}
