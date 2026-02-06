import Link from "next/link";
import { ChefHat, Home, Search } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
        <ChefHat className="h-10 w-10 text-stone-400" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-stone-900 dark:text-stone-100">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-stone-500">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/recipes">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse Recipes
          </Button>
        </Link>
      </div>
    </div>
  );
}
