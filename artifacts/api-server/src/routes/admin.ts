import { Router, type IRouter } from "express";
import { db, usersTable, generationsTable } from "@workspace/db";
import { eq, count, desc, gte, sql } from "drizzle-orm";
import { requireAdmin, type AuthRequest } from "../lib/auth.js";

const router: IRouter = Router();

router.get("/stats", requireAdmin as any, async (_req, res) => {
  try {
    const [usersResult] = await db.select({ count: count() }).from(usersTable);
    const [generationsResult] = await db.select({ count: count() }).from(generationsTable);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayResult] = await db
      .select({ count: count() })
      .from(generationsTable)
      .where(gte(generationsTable.createdAt, today));

    const planCounts = await db
      .select({ plan: usersTable.plan, count: count() })
      .from(usersTable)
      .groupBy(usersTable.plan);

    const plans: Record<string, number> = { free: 0, pro: 0, business: 0 };
    for (const p of planCounts) {
      plans[p.plan] = Number(p.count);
    }

    res.json({
      totalUsers: Number(usersResult.count),
      totalGenerations: Number(generationsResult.count),
      todayGenerations: Number(todayResult.count),
      freeUsers: plans.free,
      proUsers: plans.pro,
      businessUsers: plans.business,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAdmin as any, async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

    const genCounts = await db
      .select({ userId: generationsTable.userId, count: count() })
      .from(generationsTable)
      .groupBy(generationsTable.userId);

    const countMap: Record<number, number> = {};
    for (const g of genCounts) {
      countMap[g.userId] = Number(g.count);
    }

    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      plan: u.plan,
      role: u.role,
      createdAt: u.createdAt,
      totalGenerations: countMap[u.id] || 0,
    })));
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/plan", requireAdmin as any, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { plan } = req.body;

    if (!["free", "pro", "business"].includes(plan)) {
      res.status(400).json({ error: "Invalid plan" });
      return;
    }

    const updated = await db
      .update(usersTable)
      .set({ plan })
      .where(eq(usersTable.id, id))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "Plan updated successfully" });
  } catch (err) {
    console.error("Update plan error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics", requireAdmin as any, async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsageRaw = await db
      .select({
        date: sql<string>`DATE(${generationsTable.createdAt})::text`,
        count: count(),
      })
      .from(generationsTable)
      .where(gte(generationsTable.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${generationsTable.createdAt})`)
      .orderBy(sql`DATE(${generationsTable.createdAt})`);

    const toolUsageRaw = await db
      .select({ tool: generationsTable.tool, count: count() })
      .from(generationsTable)
      .groupBy(generationsTable.tool);

    const userGrowthRaw = await db
      .select({
        date: sql<string>`DATE(${usersTable.createdAt})::text`,
        count: count(),
      })
      .from(usersTable)
      .where(gte(usersTable.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${usersTable.createdAt})`)
      .orderBy(sql`DATE(${usersTable.createdAt})`);

    res.json({
      dailyUsage: dailyUsageRaw.map(d => ({ date: d.date, count: Number(d.count) })),
      toolUsage: toolUsageRaw.map(t => ({
        tool: t.tool,
        count: Number(t.count),
      })),
      userGrowth: userGrowthRaw.map(u => ({ date: u.date, count: Number(u.count) })),
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
