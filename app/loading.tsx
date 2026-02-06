import { ChefHat } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        <p className="text-sm font-medium text-stone-500">Loading...</p>
      </div>
    </div>
  );
}
