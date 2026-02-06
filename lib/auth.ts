import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "recipe_hub_session";

export interface Session {
  userId: string;
  email: string;
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  return Buffer.from(password).toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Create session token
export function createSessionToken(userId: string, email: string): string {
  const session = { userId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

// Parse session token
export function parseSessionToken(token: string): Session | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    if (decoded.exp < Date.now()) return null;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

// Get current session from cookies (server-side)
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return parseSessionToken(token);
}

// Get current user with profile (server-side)
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const profile = db.profiles.getById(session.userId);
  return profile
    ? { id: session.userId, email: session.email, profile }
    : null;
}
