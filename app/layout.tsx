import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { SessionProvider } from "@/lib/SessionContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sekiro — Sculptor's Idol",
  description: "Rest. Remember. Resurrect. — A Sekiro: Shadows Die Twice companion for Pam.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  const mode = session.mode ?? "full";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider mode={mode}>
          {children}
          <footer style={{
            borderTop: "1px solid #2A2724",
            padding: "1rem 1.25rem",
            textAlign: "center",
            color: "#9B9488",
            fontSize: "0.7rem",
            letterSpacing: "0.04em",
            fontFamily: "Inter, sans-serif",
          }}>
            Made with ♥️ by Avi &nbsp;·&nbsp; Sekiro: Shadows Die Twice
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
