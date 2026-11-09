import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const STAFF_ROLES = ['superadmin', 'admin', 'support'] as const;
export type Role = (typeof STAFF_ROLES)[number];
export type StaffSession = {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null | undefined;
};

export const atLeast = (role: Role, min: Role) => {
  const rank: Record<Role, number> = { support: 1, admin: 2, superadmin: 3 };
  return rank[role] >= rank[min];
};

type Ctx = { session: StaffSession; signOut: () => Promise<void> };
const StaffContext = createContext<Ctx | undefined>(undefined);

export function StaffProvider({
  session,
  children,
  onSignOut,
}: {
  session: StaffSession;
  children: ReactNode;
  onSignOut: () => Promise<void>;
}) {
  const value = useMemo<Ctx>(
    () => ({ session, signOut: onSignOut }),
    [session, onSignOut],
  );
  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export function useStaff() {
  const value = useContext(StaffContext);
  if (!value) throw new Error('useStaff must be used inside the staff app');
  return value;
}

/** Client-only persisted state helper for the mock staff data layer. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      window.localStorage.removeItem(key);
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);
  return [value, setValue, ready] as const;
}
