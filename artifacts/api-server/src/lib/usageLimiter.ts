import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const FREE_DAILY_LIMIT = 5;

export async function checkAndIncrementUsage(userId: number): Promise<{ allowed: boolean; usage: number; limit: number }> {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const user = users[0];

  if (!user) {
    return { allowed: false, usage: 0, limit: FREE_DAILY_LIMIT };
  }

  if (user.plan === "pro" || user.plan === "business") {
    await db.update(usersTable)
      .set({ dailyUsage: (user.dailyUsage || 0) + 1 })
      .where(eq(usersTable.id, userId));
    return { allowed: true, usage: user.dailyUsage + 1, limit: -1 };
  }

  const today = new Date().toISOString().split("T")[0];
  const lastDate = user.lastUsageDate;

  let currentUsage = user.dailyUsage || 0;
  if (lastDate !== today) {
    currentUsage = 0;
  }

  if (currentUsage >= FREE_DAILY_LIMIT) {
    return { allowed: false, usage: currentUsage, limit: FREE_DAILY_LIMIT };
  }

  await db.update(usersTable)
    .set({
      dailyUsage: currentUsage + 1,
      lastUsageDate: today,
    })
    .where(eq(usersTable.id, userId));

  return { allowed: true, usage: currentUsage + 1, limit: FREE_DAILY_LIMIT };
}
