import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/lib/session";
import { getProgress, toggleItem } from "@/lib/progress";

export async function GET() {
  try {
    const ids = await getProgress();
    return NextResponse.json({ completedItemIds: ids });
  } catch (err) {
    // Redis not configured — return empty array, don't 404
    console.warn("Progress GET failed (Redis may not be configured):", err);
    return NextResponse.json({ completedItemIds: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (session.mode === "readonly") {
      return NextResponse.json({ error: "Read-only mode" }, { status: 405 });
    }

    const body = await req.json();
    const { id, checked } = body as { id: string; checked: boolean };

    if (!id || typeof checked !== "boolean") {
      return NextResponse.json({ error: "Invalid body: requires { id: string, checked: boolean }" }, { status: 400 });
    }

    const updated = await toggleItem(id, checked);
    return NextResponse.json({ completedItemIds: updated });
  } catch (err) {
    console.warn("Progress POST failed (Redis may not be configured):", err);
    // Return current state (empty) rather than error
    return NextResponse.json({ completedItemIds: [] });
  }
}
