import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
