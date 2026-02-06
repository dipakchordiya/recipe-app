import fs from "fs";
import path from "path";

// Database file paths
const DB_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const PROFILES_FILE = path.join(DB_DIR, "profiles.json");
const RECIPES_FILE = path.join(DB_DIR, "recipes.json");
const LIKES_FILE = path.join(DB_DIR, "likes.json");
const SAVES_FILE = path.join(DB_DIR, "saves.json");
const COMMENTS_FILE = path.join(DB_DIR, "comments.json");

// Generate UUID
function generateId(): string {
  return crypto.randomUUID();
}

// Ensure database directory and files exist
function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const files = [
    { path: USERS_FILE, default: [] },
    { path: PROFILES_FILE, default: [] },
    { path: RECIPES_FILE, default: [] },
    { path: LIKES_FILE, default: [] },
    { path: SAVES_FILE, default: [] },
    { path: COMMENTS_FILE, default: [] },
  ];

  files.forEach(({ path: filePath, default: defaultData }) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  });
}

// Read JSON file
function readJson<T>(filePath: string): T[] {
  ensureDbExists();
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write JSON file
function writeJson<T>(filePath: string, data: T[]): void {
  ensureDbExists();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// User types
export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
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
}

export interface Like {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Save {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Database operations
export const db = {
  // Users
  users: {
    getAll: (): User[] => readJson<User>(USERS_FILE),
    getById: (id: string): User | undefined =>
      readJson<User>(USERS_FILE).find((u) => u.id === id),
    getByEmail: (email: string): User | undefined =>
      readJson<User>(USERS_FILE).find((u) => u.email === email),
    create: (data: Omit<User, "id" | "created_at">): User => {
      const users = readJson<User>(USERS_FILE);
      const newUser: User = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      users.push(newUser);
      writeJson(USERS_FILE, users);
      return newUser;
    },
  },

  // Profiles
  profiles: {
    getAll: (): Profile[] => readJson<Profile>(PROFILES_FILE),
    getById: (id: string): Profile | undefined =>
      readJson<Profile>(PROFILES_FILE).find((p) => p.id === id),
    getByUsername: (username: string): Profile | undefined =>
      readJson<Profile>(PROFILES_FILE).find((p) => p.username === username),
    create: (data: Omit<Profile, "created_at" | "updated_at">): Profile => {
      const profiles = readJson<Profile>(PROFILES_FILE);
      const newProfile: Profile = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      profiles.push(newProfile);
      writeJson(PROFILES_FILE, profiles);
      return newProfile;
    },
    update: (id: string, data: Partial<Profile>): Profile | null => {
      const profiles = readJson<Profile>(PROFILES_FILE);
      const index = profiles.findIndex((p) => p.id === id);
      if (index === -1) return null;
      profiles[index] = {
        ...profiles[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      writeJson(PROFILES_FILE, profiles);
      return profiles[index];
    },
  },

  // Recipes
  recipes: {
    getAll: (): Recipe[] => readJson<Recipe>(RECIPES_FILE),
    getById: (id: string): Recipe | undefined =>
      readJson<Recipe>(RECIPES_FILE).find((r) => r.id === id),
    getByUserId: (userId: string): Recipe[] =>
      readJson<Recipe>(RECIPES_FILE).filter((r) => r.user_id === userId),
    getPublished: (): Recipe[] =>
      readJson<Recipe>(RECIPES_FILE).filter((r) => r.is_published),
    create: (data: Omit<Recipe, "id" | "created_at" | "updated_at">): Recipe => {
      const recipes = readJson<Recipe>(RECIPES_FILE);
      const newRecipe: Recipe = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      recipes.push(newRecipe);
      writeJson(RECIPES_FILE, recipes);
      return newRecipe;
    },
    update: (id: string, data: Partial<Recipe>): Recipe | null => {
      const recipes = readJson<Recipe>(RECIPES_FILE);
      const index = recipes.findIndex((r) => r.id === id);
      if (index === -1) return null;
      recipes[index] = {
        ...recipes[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      writeJson(RECIPES_FILE, recipes);
      return recipes[index];
    },
    delete: (id: string): boolean => {
      const recipes = readJson<Recipe>(RECIPES_FILE);
      const filtered = recipes.filter((r) => r.id !== id);
      if (filtered.length === recipes.length) return false;
      writeJson(RECIPES_FILE, filtered);
      // Also delete related likes, saves, comments
      const likes = readJson<Like>(LIKES_FILE).filter((l) => l.recipe_id !== id);
      writeJson(LIKES_FILE, likes);
      const saves = readJson<Save>(SAVES_FILE).filter((s) => s.recipe_id !== id);
      writeJson(SAVES_FILE, saves);
      const comments = readJson<Comment>(COMMENTS_FILE).filter((c) => c.recipe_id !== id);
      writeJson(COMMENTS_FILE, comments);
      return true;
    },
  },

  // Likes
  likes: {
    getAll: (): Like[] => readJson<Like>(LIKES_FILE),
    getByRecipeId: (recipeId: string): Like[] =>
      readJson<Like>(LIKES_FILE).filter((l) => l.recipe_id === recipeId),
    getByUserId: (userId: string): Like[] =>
      readJson<Like>(LIKES_FILE).filter((l) => l.user_id === userId),
    exists: (userId: string, recipeId: string): boolean =>
      readJson<Like>(LIKES_FILE).some(
        (l) => l.user_id === userId && l.recipe_id === recipeId
      ),
    create: (userId: string, recipeId: string): Like => {
      const likes = readJson<Like>(LIKES_FILE);
      const newLike: Like = {
        id: generateId(),
        user_id: userId,
        recipe_id: recipeId,
        created_at: new Date().toISOString(),
      };
      likes.push(newLike);
      writeJson(LIKES_FILE, likes);
      return newLike;
    },
    delete: (userId: string, recipeId: string): boolean => {
      const likes = readJson<Like>(LIKES_FILE);
      const filtered = likes.filter(
        (l) => !(l.user_id === userId && l.recipe_id === recipeId)
      );
      if (filtered.length === likes.length) return false;
      writeJson(LIKES_FILE, filtered);
      return true;
    },
    countByRecipeId: (recipeId: string): number =>
      readJson<Like>(LIKES_FILE).filter((l) => l.recipe_id === recipeId).length,
  },

  // Saves
  saves: {
    getAll: (): Save[] => readJson<Save>(SAVES_FILE),
    getByRecipeId: (recipeId: string): Save[] =>
      readJson<Save>(SAVES_FILE).filter((s) => s.recipe_id === recipeId),
    getByUserId: (userId: string): Save[] =>
      readJson<Save>(SAVES_FILE).filter((s) => s.user_id === userId),
    exists: (userId: string, recipeId: string): boolean =>
      readJson<Save>(SAVES_FILE).some(
        (s) => s.user_id === userId && s.recipe_id === recipeId
      ),
    create: (userId: string, recipeId: string): Save => {
      const saves = readJson<Save>(SAVES_FILE);
      const newSave: Save = {
        id: generateId(),
        user_id: userId,
        recipe_id: recipeId,
        created_at: new Date().toISOString(),
      };
      saves.push(newSave);
      writeJson(SAVES_FILE, saves);
      return newSave;
    },
    delete: (userId: string, recipeId: string): boolean => {
      const saves = readJson<Save>(SAVES_FILE);
      const filtered = saves.filter(
        (s) => !(s.user_id === userId && s.recipe_id === recipeId)
      );
      if (filtered.length === saves.length) return false;
      writeJson(SAVES_FILE, filtered);
      return true;
    },
  },

  // Comments
  comments: {
    getAll: (): Comment[] => readJson<Comment>(COMMENTS_FILE),
    getById: (id: string): Comment | undefined =>
      readJson<Comment>(COMMENTS_FILE).find((c) => c.id === id),
    getByRecipeId: (recipeId: string): Comment[] =>
      readJson<Comment>(COMMENTS_FILE)
        .filter((c) => c.recipe_id === recipeId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    create: (data: Omit<Comment, "id" | "created_at" | "updated_at">): Comment => {
      const comments = readJson<Comment>(COMMENTS_FILE);
      const newComment: Comment = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      comments.push(newComment);
      writeJson(COMMENTS_FILE, comments);
      return newComment;
    },
    update: (id: string, content: string): Comment | null => {
      const comments = readJson<Comment>(COMMENTS_FILE);
      const index = comments.findIndex((c) => c.id === id);
      if (index === -1) return null;
      comments[index] = {
        ...comments[index],
        content,
        updated_at: new Date().toISOString(),
      };
      writeJson(COMMENTS_FILE, comments);
      return comments[index];
    },
    delete: (id: string): boolean => {
      const comments = readJson<Comment>(COMMENTS_FILE);
      const filtered = comments.filter((c) => c.id !== id);
      if (filtered.length === comments.length) return false;
      writeJson(COMMENTS_FILE, filtered);
      return true;
    },
    countByRecipeId: (recipeId: string): number =>
      readJson<Comment>(COMMENTS_FILE).filter((c) => c.recipe_id === recipeId).length,
  },
};

// Initialize database on import
ensureDbExists();
