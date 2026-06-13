import { getRedis } from "@/lib/redis";

const REDIS_KEY = "sculptor:progress";

type ProgressPayload = { completedItemIds: string[] };

export async function getProgress(): Promise<string[]> {
  const redis = getRedis();
  const raw = await redis.get<ProgressPayload>(REDIS_KEY);
  if (!raw) return [];
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

  await redis.set(REDIS_KEY, JSON.stringify({ completedItemIds: updated }));
  return updated;
}
