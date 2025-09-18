interface CacheEntry {
  notes: any[];
  totalPages: number;
  timestamp: number;
}

class NotesCache {
  private cache = new Map<number, CacheEntry>();
  private maxCacheSize = 5;
  private cacheExpiryMs = 5 * 60 * 1000; // 5 minutes

  public get(page: number): CacheEntry | null {
    const entry = this.cache.get(page);
    if (!entry) return null;

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > this.cacheExpiryMs) {
      this.cache.delete(page);
      return null;
    }

    return entry;
  }

  public set(page: number, notes: any[], totalPages: number): void {
    const entry: CacheEntry = {
      notes,
      totalPages,
      timestamp: Date.now(),
    };

    this.cache.set(page, entry);

    // Clean up old entries if cache is too large
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
  }

  public preloadPages(currentPage: number, totalPages: number): number[] {
    // Get the pages that would be visible in the pagination bar (same logic as Pagination component)
    const getVisiblePages = () => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage < 3) {
        return [1, 2, 3, 4, 5];
      }

      if (currentPage > totalPages - 2) {
        return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
      }

      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    };

    const visiblePages = getVisiblePages();
    const pagesToCache: number[] = [];

    // Only return pages that are visible in pagination bar but not cached
    for (const page of visiblePages) {
      if (!this.get(page)) {
        pagesToCache.push(page);
      }
    }

    return pagesToCache;
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const notesCache = new NotesCache();
