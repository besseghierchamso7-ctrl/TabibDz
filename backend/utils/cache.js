/**
 * Caching Utility
 * Simple in-memory caching for performance optimization
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Get value from cache
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    return this.cache.get(key);
  }

  /**
   * Set value in cache with optional TTL
   */
  set(key, value, ttl = null) {
    this.cache.set(key, value);

    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set new timer if TTL provided
    if (ttl) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  /**
   * Delete value from cache
   */
  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Check if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get or compute value
   */
  async getOrCompute(key, computeFn, ttl = null) {
    if (this.has(key)) {
      return this.get(key);
    }

    const value = await computeFn();
    this.set(key, value, ttl);
    return value;
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

/**
 * Cache middleware for GET requests
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data) {
      cacheManager.set(cacheKey, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  CacheManager,
  cacheManager,
  cacheMiddleware
};
