import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  className?: string;
}

const CardSkeleton = ({ className = "" }: CardSkeletonProps) => {
  return (
    <div className={`cyber-card space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

export default CardSkeleton;
