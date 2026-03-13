import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "sahabat-barokah-secret-key-2024";

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export function signToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  let token: string | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.userId = payload.userId;
  next();
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user[0] || user[0].role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    req.userRole = "admin";
    next();
  });
}
