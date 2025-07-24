// ~/server/services/pageCache.js

export class PageCache {
  constructor() {
    this._cache = {};
    this._lastFetch = 0;
    this._cacheDuration = 120 * 60 * 1000; 
  }

  async fetchAllPages() {
    const now = Date.now();

    if (this._cache && now - this._lastFetch < this._cacheDuration) {
      return this._cache;
    }
    
    try {
      const pageIds = [11] // Add more IDs if needed

      const pages = await Promise.all(
        pageIds.map(id =>
          $fetch(`https://verveina.weblinking.fr/wp-json/wp/v2/pages/${id}`)
            .then(res => ({ id, data: res }))
            .catch(error => {
              console.error(`Error fetching page ${id}:`, error);
              return { id, data: null };
            })
        )
      );

      this._cache = pages.reduce((acc, { id, data }) => {
        if (data) acc[id] = data;
        return acc;
      }, {});

      this._lastFetch = now;
      return this._cache;
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  }

  getPage(id) {
    return this._cache?.[id] || null;
  }
}

// ✅ Define AFTER class declaration
export const pageCache = new PageCache();