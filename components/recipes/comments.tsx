"use client";

import { useState } from "react";
import { Send, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { Button, Avatar, Textarea, Dropdown, DropdownItem, Skeleton } from "@/components/ui";
import { formatTimeAgo } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
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

interface CommentsProps {
  comments: Comment[];
  isLoading?: boolean;
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
}

export function Comments({
  comments,
  isLoading,
  onAddComment,
  onDeleteComment,
  onEditComment,
}: CommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await onAddComment(newComment.trim());
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    await onEditComment(commentId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar
            src={null}
            fallback={user.email || "U"}
            size="md"
            className="shrink-0"
          />
          <div className="flex-1 relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px] pr-12"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-3 bottom-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center dark:border-stone-700 dark:bg-stone-900">
          <p className="text-stone-500">
            <a href="/login" className="text-amber-600 font-semibold hover:underline">
              Log in
            </a>{" "}
            to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-stone-400 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar
                src={comment.profiles?.avatar_url}
                fallback={comment.profiles?.full_name || comment.profiles?.username || "U"}
                size="md"
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {comment.profiles?.full_name || comment.profiles?.username}
                  </span>
                  <span className="text-xs text-stone-400">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="text-xs text-stone-400">(edited)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(comment.id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-stone-600 dark:text-stone-400 break-words">
                    {comment.content}
                  </p>
                )}
              </div>

              {user?.id === comment.user_id && editingId !== comment.id && (
                <Dropdown
                  trigger={
                    <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-stone-100 transition-all dark:hover:bg-stone-800">
                      <MoreHorizontal className="h-4 w-4 text-stone-400" />
                    </button>
                  }
                >
                  <DropdownItem onClick={() => startEditing(comment)}>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownItem>
                </Dropdown>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
