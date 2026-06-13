"use client";

import { createContext, useContext } from "react";

type Mode = "full" | "readonly";

const SessionContext = createContext<Mode>("full");

export function SessionProvider({
  mode,
  children,
}: {
  mode: Mode;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={mode}>{children}</SessionContext.Provider>
  );
}

export function useSessionMode(): Mode {
  return useContext(SessionContext);
}
