import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        secondary:
          "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
        success:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        outline:
          "border-2 border-stone-200 bg-transparent text-stone-700 dark:border-stone-700 dark:text-stone-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
