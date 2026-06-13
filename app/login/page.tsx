"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [readonlyLoading, setReadonlyLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password.");
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReadOnly() {
    setReadonlyLoading(true);
    try {
      await fetch("/api/auth/readonly", { method: "POST" });
      router.replace("/");
      router.refresh();
    } finally {
      setReadonlyLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0C0E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image as <img> — more reliable than CSS background-image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-bg.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Dark overlay so text stays readable */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,12,14,0.45)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Game title block */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#9B9488",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Shadows Die Twice
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "clamp(2rem, 8vw, 2.75rem)",
              fontWeight: 400,
              color: "#C9A227",
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            Sekiro
          </h1>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(201,162,39,0.4)",
              margin: "0.625rem auto",
            }}
          />
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "0.9rem",
              fontWeight: 400,
              color: "#C8C2B4",
              letterSpacing: "0.05em",
              marginBottom: "0.25rem",
            }}
          >
            Sculptor&#39;s Idol
          </p>
          <p
            style={{
              color: "#9B9488",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Rest. Remember. Resurrect.
          </p>
        </div>

        {/* Login card */}
        <div
          style={{
            width: "100%",
            background: "#1A1815",
            border: "1px solid #2A2724",
            borderRadius: "8px",
            padding: "2rem 1.75rem",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  color: "#9B9488",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Enter Ashina
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                placeholder="Password"
                style={{
                  width: "100%",
                  background: "#0E0D0B",
                  border: "1px solid #2A2724",
                  borderRadius: "4px",
                  color: "#E8E2D4",
                  fontSize: "1rem",
                  padding: "0.625rem 0.75rem",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A227")}
                onBlur={(e) => (e.target.style.borderColor = "#2A2724")}
              />
            </div>

            {error && (
              <p style={{ color: "#B23A2E", fontSize: "0.8rem" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#2A2724" : "#C9A227",
                color: loading ? "#9B9488" : "#0E0D0B",
                border: "none",
                borderRadius: "4px",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                minHeight: "44px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {loading ? "Entering…" : "Enter Ashina →"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleReadOnly}
            disabled={readonlyLoading}
            style={{
              marginTop: "0.75rem",
              width: "100%",
              background: "transparent",
              color: "#9B9488",
              border: "1px solid #9B9488",
              borderRadius: "4px",
              padding: "0.625rem 1rem",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              cursor: readonlyLoading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
              opacity: readonlyLoading ? 0.5 : 1,
              minHeight: "40px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {readonlyLoading ? "Entering…" : "Enter Read-Only Mode →"}
          </button>
        </div>
      </div>
    </main>
  );
}
