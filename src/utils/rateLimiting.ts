
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 5) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Create rate limiters for different operations
export const formSubmissionLimiter = new RateLimiter(60000, 3); // 3 submissions per minute
export const fileUploadLimiter = new RateLimiter(300000, 10); // 10 uploads per 5 minutes

// Cleanup old entries every 5 minutes
setInterval(() => {
  formSubmissionLimiter.cleanup();
  fileUploadLimiter.cleanup();
}, 300000);

export function getRateLimitIdentifier(ip?: string, email?: string): string {
  // Use IP if available, otherwise use email as fallback
  return ip || email || 'unknown';
}
