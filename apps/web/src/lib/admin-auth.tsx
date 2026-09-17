import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "superadmin" | "admin" | "support";
export type StaffSession = { name: string; email: string; role: Role };

export const SESSION_KEY = "thift_staff_session_v1";

export const DEMO_STAFF: Record<string, { name: string; role: Role }> = {
  "owner@thift.ke": { name: "Amina Otieno", role: "superadmin" },
  "manager@thift.ke": { name: "Brian Kimani", role: "admin" },
  "support@thift.ke": { name: "Njeri Wanjiku", role: "support" },
};
export const DEMO_PASSWORD = "password123";

export const readSession = (): StaffSession | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StaffSession) : null;
  } catch {
    return null;
  }
};
export const writeSession = (session: StaffSession) =>
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
export const clearSession = () => window.localStorage.removeItem(SESSION_KEY);

export const atLeast = (role: Role, min: Role) => {
  const rank: Record<Role, number> = { support: 1, admin: 2, superadmin: 3 };
  return rank[role] >= rank[min];
};

type Ctx = { session: StaffSession; viewAs: (role: Role) => void; signOut: () => void };
const StaffContext = createContext<Ctx | undefined>(undefined);

export function StaffProvider({ session, children, onChange, onSignOut }: {
  session: StaffSession; children: ReactNode; onChange: (s: StaffSession) => void; onSignOut: () => void;
}) {
  const value = useMemo<Ctx>(() => ({
    session,
    viewAs: (role) => { const next = { ...session, role }; writeSession(next); onChange(next); },
    signOut: onSignOut,
  }), [session, onChange, onSignOut]);
  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const value = useContext(StaffContext);
  if (!value) throw new Error("useStaff must be used inside the staff app");
  return value;
}

/** Client-only persisted state helper for the mock staff data layer. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = window.localStorage.getItem(key); if (raw) setValue(JSON.parse(raw) as T); } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) window.localStorage.setItem(key, JSON.stringify(value)); }, [key, ready, value]);
  return [value, setValue, ready] as const;
}
