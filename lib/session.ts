import type { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
  mode?: 'full' | 'readonly';
}

export const sessionOptions: SessionOptions = {
  cookieName: "sculptor_session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};
