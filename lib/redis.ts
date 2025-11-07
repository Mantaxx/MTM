import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.on('error', err => console.error('Redis Client Error', err));
if (!redis.isOpen) redis.connect();

/**
 * Helper function to get and parse JSON data from Redis
 * @param key - The Redis key to retrieve
 * @returns Parsed JSON data or null if the key doesn't exist or contains invalid JSON
 */
export async function getJson<T>(key: string): Promise<T | null> {
  const val = await redis.get(key);
  if (!val) return null;
  
  try {
    const stringVal = typeof val === 'string' ? val : val.toString();
    return JSON.parse(stringVal) as T;
  } catch (error) {
    console.error(`Failed to parse JSON from Redis key "${key}":`, error);
    return null;
  }
}
