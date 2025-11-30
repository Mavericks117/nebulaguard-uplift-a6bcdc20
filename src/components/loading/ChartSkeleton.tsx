import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  className?: string;
  height?: string;
}

const ChartSkeleton = ({ className = "", height = "h-64" }: ChartSkeletonProps) => {
  return (
    <div className={`cyber-card space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className={`${height} flex items-end justify-center gap-2`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;
