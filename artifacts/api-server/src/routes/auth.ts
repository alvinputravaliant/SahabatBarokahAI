import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type AuthRequest } from "../lib/auth.js";

const router: IRouter = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      plan: "free",
      role: "user",
      dailyUsage: 0,
    }).returning();

    const token = signToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        createdAt: user.createdAt,
        dailyUsage: user.dailyUsage,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (users.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        createdAt: user.createdAt,
        dailyUsage: user.dailyUsage,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (users.length === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const user = users[0];
    const today = new Date().toISOString().split("T")[0];
    const dailyUsage = user.lastUsageDate === today ? user.dailyUsage : 0;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      createdAt: user.createdAt,
      dailyUsage,
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
