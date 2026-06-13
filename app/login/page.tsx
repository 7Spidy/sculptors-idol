"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0E0D0B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#1A1815",
          border: "1px solid #2A2724",
          borderRadius: "8px",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Noto Serif JP', serif)",
              fontSize: "1.5rem",
              fontWeight: 500,
              color: "#C9A227",
              letterSpacing: "0.05em",
              marginBottom: "0.25rem",
            }}
          >
            Sculptor&#39;s Idol
          </h1>
          <p
            style={{
              color: "#9B9488",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Rest. Remember. Resurrect.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.75rem",
                color: "#9B9488",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
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
            <p style={{ color: "#B23A2E", fontSize: "0.8rem", marginTop: "-0.25rem" }}>
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
              transition: "background 0.15s, opacity 0.15s",
              minHeight: "44px",
            }}
          >
            {loading ? "Entering..." : "Enter Ashina →"}
          </button>
        </form>
      </div>
    </main>
  );
}
