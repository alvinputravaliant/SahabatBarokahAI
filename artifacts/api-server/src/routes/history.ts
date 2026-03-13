import { Router, type IRouter } from "express";
import { db, generationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth.js";

const router: IRouter = Router();

router.get("/", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const generations = await db
      .select()
      .from(generationsTable)
      .where(eq(generationsTable.userId, req.userId!))
      .orderBy(desc(generationsTable.createdAt));

    res.json(generations.map(g => ({
      id: g.id,
      tool: g.tool,
      input: g.input,
      result: g.result,
      createdAt: g.createdAt,
    })));
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const deleted = await db
      .delete(generationsTable)
      .where(and(
        eq(generationsTable.id, id),
        eq(generationsTable.userId, req.userId!)
      ))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "History entry not found" });
      return;
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
