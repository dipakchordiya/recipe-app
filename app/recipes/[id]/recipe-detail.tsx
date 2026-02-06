"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  ChefHat,
  Heart,
  Bookmark,
  Share2,
  Printer,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
} from "lucide-react";
import {
  Button,
  Badge,
  Avatar,
  Card,
  CardContent,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  useToast,
} from "@/components/ui";
import { Comments } from "@/components/recipes/comments";
import { useAuth } from "@/contexts/auth-context";
import { formatDate, cn } from "@/lib/utils";
import { trackRecipeView, trackRecipeLike, trackRecipeSave, trackRecipeShare, trackEngagement } from "@/lib/lytics";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
}

interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: { name: string; amount: string; unit?: string }[];
  steps: string;
  cooking_time: number | null;
  difficulty: "easy" | "medium" | "hard";
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
  likes_count: number;
  comments_count: number;
}

interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
}

interface RecipeDetailProps {
  recipe: Recipe;
  comments: Comment[];
}

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "danger",
} as const;

export function RecipeDetail({ recipe, comments: initialComments }: RecipeDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likes_count || 0);
  const [comments, setComments] = useState(initialComments);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Track engagement time
  const startTimeRef = useRef<number>(Date.now());

  const isOwner = user?.id === recipe.user_id;
  const ingredients = recipe.ingredients || [];
  const steps = recipe.steps.split("\n").filter((step) => step.trim());
  
  // Track recipe view on mount
  useEffect(() => {
    // Detect cuisine from category
    const cuisine = recipe.category?.toLowerCase().includes("indian") ? "indian" 
                  : recipe.category?.toLowerCase().includes("american") ? "american" 
                  : undefined;
    
    trackRecipeView(recipe.id, recipe.title, recipe.category || undefined, cuisine);
    
    // Track engagement on unmount
    return () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (duration > 3) { // Only track if user spent more than 3 seconds
        trackEngagement("recipe_detail", duration);
      }
    };
  }, [recipe.id, recipe.title, recipe.category]);

  // Check if user has liked/saved this recipe
  useEffect(() => {
    if (user) {
      const checkUserInteractions = async () => {
        try {
          const res = await fetch(`/api/recipes/${recipe.id}`);
          const data = await res.json();
          setIsLiked(data.is_liked || false);
          setIsSaved(data.is_saved || false);
        } catch (error) {
          console.error("Failed to check interactions:", error);
        }
      };
      checkUserInteractions();
    }
  }, [user, recipe.id]);

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipe.id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      setIsLiked(data.liked);
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
      
      // Track in Lytics
      trackRecipeLike(recipe.id, recipe.title, data.liked);
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/recipes/${recipe.id}/save`, {
        method: "POST",
      });
      const data = await res.json();
      setIsSaved(data.saved);
      addToast(data.saved ? "Recipe saved!" : "Recipe removed from saved", "info");
      
      // Track in Lytics
      trackRecipeSave(recipe.id, recipe.title, data.saved);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleShare = async () => {
    let shareMethod = "clipboard";
    
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description || `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
        shareMethod = "native";
      } catch {
        // User cancelled or share failed, fall back to clipboard
        await navigator.clipboard.writeText(window.location.href);
        addToast("Link copied to clipboard!", "success");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      addToast("Link copied to clipboard!", "success");
    }
    
    // Track in Lytics
    trackRecipeShare(recipe.id, recipe.title, shareMethod);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      addToast("Recipe deleted", "success");
      router.push("/recipes");
    } catch (error) {
      addToast("Failed to delete recipe", "error");
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/recipes/${recipe.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      addToast("Comment added", "success");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      addToast("Comment deleted", "success");
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, ...updated } : c))
      );
      addToast("Comment updated", "success");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/recipes"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Recipes
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {recipe.category && (
              <Badge variant="default" className="mb-3">
                {recipe.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="mt-3 text-lg text-stone-500">{recipe.description}</p>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:bg-red-50 dark:text-red-400"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Author & Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <Link
            href={`/profile/${recipe.profiles?.username}`}
            className="flex items-center gap-3 group"
          >
            <Avatar
              src={recipe.profiles?.avatar_url}
              fallback={recipe.profiles?.full_name || recipe.profiles?.username || "U"}
              size="md"
            />
            <div>
              <p className="font-semibold text-stone-900 group-hover:text-amber-600 dark:text-stone-100">
                {recipe.profiles?.full_name || recipe.profiles?.username}
              </p>
              <p className="text-sm text-stone-500">
                {formatDate(recipe.created_at)}
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            {recipe.cooking_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {recipe.cooking_time} min
              </span>
            )}
            <Badge variant={difficultyColors[recipe.difficulty]}>
              {recipe.difficulty}
            </Badge>
            <span className="flex items-center gap-1">
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
              {likesCount} likes
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            className="gap-2"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            onClick={handleSave}
            className="gap-2"
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Image */}
      {recipe.image_url && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Ingredients */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900 dark:text-stone-100">
              <ChefHat className="h-5 w-5 text-amber-500" />
              Ingredients
            </h2>
            <ul className="mt-4 space-y-3">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-stone-700 dark:text-stone-300"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  <span>
                    <strong>{ingredient.amount}</strong>
                    {ingredient.unit && ` ${ingredient.unit}`} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900 dark:text-stone-100">
              <Users className="h-5 w-5 text-amber-500" />
              Instructions
            </h2>
            <ol className="mt-4 space-y-6">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {index + 1}
                  </span>
                  <p className="mt-1 text-stone-700 dark:text-stone-300">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Link key={tag} href={`/recipes?search=${tag}`}>
              <Badge variant="secondary" className="hover:bg-stone-200 dark:hover:bg-stone-700">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Comments */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="mb-6 text-xl font-bold text-stone-900 dark:text-stone-100">
            Comments ({comments.length})
          </h2>
          <Comments
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
          />
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>
          <ModalTitle>Delete Recipe</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete this recipe? This action cannot be
            undone.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete Recipe
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
