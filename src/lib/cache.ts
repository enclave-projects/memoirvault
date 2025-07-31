import { useState, useEffect } from 'react';

// Simple in-memory cache for frequently accessed data
class SimpleCache {
    private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

    set(key: string, data: any, ttlSeconds: number = 300) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000
        });
    }

    get(key: string) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    delete(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    // Cache keys for different data types
    static keys = {
        profile: (userId: string) => `profile:${userId}`,
        followStatus: (userId: string, targetUserId: string) => `follow:${userId}:${targetUserId}`,
        profileCounts: (userId: string) => `counts:${userId}`,
        entries: (userId: string) => `entries:${userId}`,
        publicEntries: (userId: string) => `public_entries:${userId}`,
    };
}

export const cache = new SimpleCache();

// Cache utilities
export const cacheUtils = {
    // Profile caching
    getProfile: (userId: string) => cache.get(SimpleCache.keys.profile(userId)),
    setProfile: (userId: string, profile: any) => cache.set(SimpleCache.keys.profile(userId), profile, 600), // 10 minutes
    
    // Follow status caching
    getFollowStatus: (userId: string, targetUserId: string) => 
        cache.get(SimpleCache.keys.followStatus(userId, targetUserId)),
    setFollowStatus: (userId: string, targetUserId: string, isFollowing: boolean) => 
        cache.set(SimpleCache.keys.followStatus(userId, targetUserId), isFollowing, 300), // 5 minutes
    
    // Profile counts caching
    getProfileCounts: (userId: string) => cache.get(SimpleCache.keys.profileCounts(userId)),
    setProfileCounts: (userId: string, counts: any) => 
        cache.set(SimpleCache.keys.profileCounts(userId), counts, 180), // 3 minutes
    
    // Invalidate related caches when data changes
    invalidateProfile: (userId: string) => {
        cache.delete(SimpleCache.keys.profile(userId));
        cache.delete(SimpleCache.keys.profileCounts(userId));
        cache.delete(SimpleCache.keys.entries(userId));
        cache.delete(SimpleCache.keys.publicEntries(userId));
    },
    
    invalidateFollowStatus: (userId: string, targetUserId: string) => {
        cache.delete(SimpleCache.keys.followStatus(userId, targetUserId));
        cache.delete(SimpleCache.keys.followStatus(targetUserId, userId));
        cache.delete(SimpleCache.keys.profileCounts(userId));
        cache.delete(SimpleCache.keys.profileCounts(targetUserId));
    }
};

// React hook for cached data
export function useCachedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlSeconds: number = 300
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            const cached = cache.get(key);
            if (cached) {
                setData(cached);
                setLoading(false);
                return;
            }

            // Fetch from source
            try {
                setLoading(true);
                const result = await fetcher();
                cache.set(key, result, ttlSeconds);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key, ttlSeconds]);

    return { data, loading, error, refetch: () => {
        cache.delete(key);
        setLoading(true);
        // Trigger re-fetch by updating a dependency
    }};
}