import { getRedis } from "@/lib/redis";

const REDIS_KEY = "sculptor:progress";

type ProgressPayload = { completedItemIds: string[] };

export async function getProgress(): Promise<string[]> {
  const redis = getRedis();
  const raw = await redis.get<ProgressPayload>(REDIS_KEY);
  if (!raw) return [];
  if (typeof raw === "string") {
    // Handle legacy string-encoded JSON
    try {
      const parsed = JSON.parse(raw) as ProgressPayload;
      return parsed.completedItemIds ?? [];
    } catch {
      return [];
    }
  }
  return raw.completedItemIds ?? [];
}

export async function toggleItem(id: string, checked: boolean): Promise<string[]> {
  const redis = getRedis();
  const ids = await getProgress();

  let updated: string[];
  if (checked) {
    updated = ids.includes(id) ? ids : [...ids, id];
  } else {
    updated = ids.filter((x) => x !== id);
  }

  await redis.set(REDIS_KEY, { completedItemIds: updated });
  return updated;
}
