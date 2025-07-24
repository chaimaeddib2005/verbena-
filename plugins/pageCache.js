// ~/plugins/pageCache.js

import { pageCache } from '~/server/services/pageCache';

export default defineNuxtPlugin(async () => {
  await pageCache.fetchAllPages();

  return {
    provide: {
      pageCache
    }
  };
});
