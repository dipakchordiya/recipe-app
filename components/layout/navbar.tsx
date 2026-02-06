"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChefHat,
  Search,
  Plus,
  User,
  LogOut,
  Bookmark,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button, Avatar, Dropdown, DropdownItem, DropdownDivider } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import type { Header, NavLink } from "@/lib/contentstack";

interface NavbarProps {
  header?: Header | null;
}

// Default navigation links
const defaultNavLinks: NavLink[] = [
  { label: "Home", url: "/" },
  { label: "Browse", url: "/recipes" },
  { label: "Categories", url: "/categories" },
];

export function Navbar({ header }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use dynamic or default values
  const siteName = header?.siteName || "RecipeHub";
  const navLinks = header?.navigationLinks || defaultNavLinks;
  const showSearch = header?.showSearch ?? true;
  const ctaButton = header?.ctaButton;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-stone-100 bg-white/80 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-stone-900 dark:text-stone-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <span className="hidden sm:inline">{siteName}</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target={link.open_new_tab ? "_blank" : undefined}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.url
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        {showSearch && (
        <form onSubmit={handleSearch} className="hidden lg:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-xl border-2 border-stone-200 bg-stone-50 pl-10 pr-4 text-sm placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:border-stone-700 dark:bg-stone-900 dark:focus:border-amber-500"
            />
          </div>
        </form>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/recipes/new" className="hidden sm:block">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  New Recipe
                </Button>
              </Link>

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-stone-100 transition-colors dark:hover:bg-stone-800">
                    <Avatar
                      src={profile?.avatar_url}
                      fallback={profile?.full_name || profile?.username || "U"}
                      size="sm"
                    />
                  </button>
                }
              >
                <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {profile?.full_name || profile?.username || "User"}
                  </p>
                  <p className="text-sm text-stone-500">@{profile?.username}</p>
                </div>
                <DropdownItem onClick={() => router.push(`/profile/${profile?.username}`)}>
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/saved")}>
                  <Bookmark className="h-4 w-4" />
                  Saved Recipes
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/profile/edit")}>
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              {ctaButton && (!ctaButton.logged_out_only || !user) ? (
                <Link href={ctaButton.url} className="hidden sm:block">
                  <Button size="sm">{ctaButton.label}</Button>
                </Link>
              ) : (
              <Link href="/signup" className="hidden sm:block">
                <Button size="sm">Sign Up</Button>
              </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="flex md:hidden items-center justify-center h-10 w-10 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-950 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-2">
            {/* Mobile Search */}
            {showSearch && (
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border-2 border-stone-200 bg-stone-50 pl-10 pr-4 text-sm placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-all dark:border-stone-700 dark:bg-stone-900"
                />
              </div>
            </form>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target={link.open_new_tab ? "_blank" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.url
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800"
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/recipes/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-4"
              >
                <Button className="w-full">
                  <Plus className="h-4 w-4" />
                  New Recipe
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
