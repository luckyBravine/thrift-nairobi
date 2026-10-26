import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth";

export type StaffRole = "superadmin" | "admin" | "support";

export function requireSession() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as Request & { session: typeof session }).session = session;
    next();
  };
}

export function requireRoles(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const role = (session.user as { role?: string }).role ?? "customer";
    const userRoles = role.split(",").map((r) => r.trim());
    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    (req as Request & { session: typeof session }).session = session;
    next();
  };
}

export const requireStaff = requireRoles(["superadmin", "admin", "support"]);
export const requireAdmin = requireRoles(["superadmin", "admin"]);
export const requireCustomer = requireRoles(["customer"]);