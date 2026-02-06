import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("recipe_hub_session");
  return NextResponse.json({ success: true });
}
