import { NextRequest, NextResponse } from "next/server";

// These will be wired to Upstash in Phase 6.
// For now, stub with a graceful fallback.

let memoryStore: string[] = [];

export async function GET() {
  try {
    const { getProgress } = await import("@/lib/progress");
    const ids = await getProgress();
    return NextResponse.json({ completedItemIds: ids });
  } catch {
    return NextResponse.json({ completedItemIds: memoryStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, checked } = body as { id: string; checked: boolean };

    if (!id || typeof checked !== "boolean") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    try {
      const { toggleItem } = await import("@/lib/progress");
      await toggleItem(id, checked);
      const { getProgress } = await import("@/lib/progress");
      const ids = await getProgress();
      return NextResponse.json({ completedItemIds: ids });
    } catch {
      // Fallback to in-memory when Redis not configured
      if (checked) {
        if (!memoryStore.includes(id)) memoryStore = [...memoryStore, id];
      } else {
        memoryStore = memoryStore.filter((x) => x !== id);
      }
      return NextResponse.json({ completedItemIds: memoryStore });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
