import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.on('error', err => console.error('Redis Client Error', err));
if (!redis.isOpen) redis.connect();

/**
 * Helper function to get and parse JSON data from Redis
 * @param key - The Redis key to retrieve
 * @returns Parsed JSON data or null if the key doesn't exist
 */
export async function getJson<T>(key: string): Promise<T | null> {
  const val = await redis.get(key);
  return val ? (JSON.parse(val) as T) : null;
}
