import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    const hash = process.env.SITE_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const match = bcrypt.compareSync(password, hash);
    if (!match) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
