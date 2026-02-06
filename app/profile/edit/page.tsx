"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Textarea,
  Label,
  Card,
  CardContent,
  useToast,
  Skeleton,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  full_name: z.string().max(50, "Name must be at most 50 characters").optional(),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
      });
      setAvatarPreview(profile.avatar_url);
      setIsLoading(false);
    }
  }, [profile, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profiles/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          avatar_url: avatarPreview,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      await refreshProfile();
      addToast("Profile updated!", "success");
      router.push(`/profile/${data.username}`);
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Failed to update profile", "error");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-48 mb-8" />
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/profile/${profile?.username}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Edit Profile
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Label className="mb-4">Profile Photo</Label>
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg dark:border-stone-800"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <label className="mt-4 cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-xs text-stone-400">
                Note: Avatar URLs are stored. For production, use a file storage service.
              </p>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username" required>
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...register("username")}
                error={errors.username?.message}
                className="mt-2"
              />
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                {...register("full_name")}
                error={errors.full_name?.message}
                className="mt-2"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                {...register("bio")}
                error={errors.bio?.message}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-stone-400">
                Max 160 characters
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Link href={`/profile/${profile?.username}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
