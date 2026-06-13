import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body as { password: string };

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const stored = process.env.SITE_PASSWORD;
    if (!stored) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    const match = a.length === b.length && timingSafeEqual(a, b);

    if (!match) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.isLoggedIn = true;
    session.mode = "full";
    await session.save();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
