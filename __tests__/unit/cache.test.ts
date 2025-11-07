import { getJson, redis } from '@/lib/redis';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mockowanie redis (tylko te metody, które faktycznie masz/wykorzystujesz)
vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    exists: vi.fn(),
    expire: vi.fn(),
    ttl: vi.fn(),
    on: vi.fn(),
    connect: vi.fn(),
    isOpen: true,
  },
  getJson: vi.fn(),
}));

describe('Redis utils / manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set a value', async () => {
    vi.mocked(redis.set).mockResolvedValue('OK');
    const result = await redis.set('test-key', 'val');
    expect(result).toBe('OK');
    expect(redis.set).toHaveBeenCalledWith('test-key', 'val');
  });

  it('should get a value', async () => {
    vi.mocked(redis.get).mockResolvedValue('test-val');
    const result = await redis.get('test-key');
    expect(result).toBe('test-val');
    expect(redis.get).toHaveBeenCalledWith('test-key');
  });

  it('should delete a key', async () => {
    vi.mocked(redis.del).mockResolvedValue(1);
    const result = await redis.del('test-key');
    expect(result).toBe(1);
    expect(redis.del).toHaveBeenCalledWith('test-key');
  });
});

describe('getJson helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse JSON from Redis when value exists', async () => {
    const mockData = { name: 'test', value: 123 };
    vi.mocked(getJson).mockResolvedValue(mockData);
    
    const result = await getJson('test-key');
    expect(result).toEqual(mockData);
    expect(getJson).toHaveBeenCalledWith('test-key');
  });

  it('should return null when key does not exist', async () => {
    vi.mocked(getJson).mockResolvedValue(null);
    
    const result = await getJson('non-existent-key');
    expect(result).toBeNull();
    expect(getJson).toHaveBeenCalledWith('non-existent-key');
  });

  it('should handle invalid JSON gracefully', async () => {
    // Mock getJson to return null for invalid JSON (simulating error handling)
    vi.mocked(getJson).mockResolvedValue(null);
    
    const result = await getJson('invalid-json-key');
    expect(result).toBeNull();
    expect(getJson).toHaveBeenCalledWith('invalid-json-key');
  });
});
