<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Skeleton -->
    <section v-if="loading" class="animate-pulse space-y-6">
      <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
        <div class="h-12 bg-gray-200 rounded mb-4"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
      <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
        <div class="md:w-2/5 h-64 bg-gray-200 rounded-xl"></div>
        <div class="md:w-3/5 space-y-4">
          <div class="h-8 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Hero Section -->
      <section v-if="content" class="mb-16">
        <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-3 md:mb-4">
            {{ content.hero_title }}
          </h1>
          <p v-if="content.hero_description" class="text-lg md:text-xl text-violet-700 font-serif italic">
            {{ content.hero_description }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div v-if="content.hero_image" class="md:w-2/5">
            <img
              :src="optimizeImage(content.hero_image, 800)"
              width="800"
              height="450"
              loading="eager"
              decoding="async"
              class="w-full max-w-[400px] md:max-w-none h-auto rounded-xl shadow-lg object-cover border-4 border-white"
              alt="Hero Image"
              @error="handleImageError"
            />
          </div>
          <div class="md:w-3/5 prose prose-sm md:prose-lg text-violet-800">
            <h2 class="text-2xl md:text-4xl font-light text-violet-900 mb-3 md:mb-4">
              {{ content.titre_description }}
            </h2>
            <p class="leading-relaxed">{{ content.description }}</p>
          </div>
        </div>
      </section>

      <!-- Categories Grid -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-6 text-center bg-purple-100 py-10 px-6 rounded-lg shadow">
          Les catégories les plus populaires
        </h2>
        
        <!-- Categories Loading -->
        <div v-if="categoriesLoading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="h-48 w-full bg-gray-200 animate-pulse"></div>
            <div class="p-4">
              <div class="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Categories Error -->
        <div v-else-if="categoriesError" class="text-center text-red-600 py-8">
          {{ categoriesError }}
        </div>

        <!-- Categories Content -->
        <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <NuxtLink
            v-for="category in topCategories"
            :key="category.id"
            :to="`/blog/${category.slug}`"
            class="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl transform hover:scale-105 cursor-pointer"
          >
            <div class="relative">
              <img
                :src="optimizeImage(category.featuredImage, 400)"
                class="w-full h-48 object-cover"
                :alt="category.name"
                width="400"
                height="192"
                loading="lazy"
                decoding="async"
                @error="handleCategoryImageError"
              />
              <div class="absolute top-4 right-4 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ category.postCount }} article{{ category.postCount > 1 ? 's' : '' }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-violet-900 mb-2">
                {{ cleanText(category.name) }}
              </h3>
              <p v-if="category.description" class="text-sm text-gray-600 line-clamp-2">
                {{ cleanText(category.description) }}
              </p>
              <div v-if="category.latestPost" class="text-xs text-violet-500 mt-2">
                Dernier: "{{ cleanText(category.latestPost.title.rendered).substring(0, 40) }}..."
              </div>
            </div>
          </NuxtLink>
        </div>
        
        <div class="text-center mt-8">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Voir toutes les catégories
          </NuxtLink>
        </div>
      </section>

      <!-- Latest Blog Posts Section -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-6 text-center bg-purple-100 py-10 px-6 rounded-lg shadow">
          Nos derniers articles
        </h2>
        
        <!-- Blog Posts Loading -->
        <div v-if="blogLoading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <div class="h-48 w-full bg-gray-200 animate-pulse"></div>
            <div class="p-5 flex-1 flex flex-col">
              <div class="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div class="h-4 w-1/3 bg-gray-200 rounded mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Blog Posts Error -->
        <div v-else-if="blogError" class="text-center text-red-600 py-8">
          {{ blogError }}
        </div>

        <!-- Blog Posts Content -->
        <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="post in latestPosts"
            :key="post.id"
            :to="`/blog/post/${post.slug}`"
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:scale-105"
          >
            <img
              v-if="post._embedded?.['wp:featuredmedia']"
              :src="optimizeImage(post._embedded['wp:featuredmedia'][0].source_url, 400)"
              :alt="cleanText(post.title.rendered)"
              class="h-48 w-full object-cover"
              width="400"
              height="192"
              loading="lazy"
              decoding="async"
            />
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-violet-900">
                {{ cleanText(post.title.rendered) }}
              </h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                {{ cleanText(post.excerpt.rendered) }}
              </p>
              <span class="text-violet-600 mt-auto text-sm font-medium hover:underline">
                Lire l'article →
              </span>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-8">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center px-6 py-2 bg-transparent border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-medium rounded-lg transition-all duration-300"
          >
            Voir tous les articles
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
        </div>
      </section>
    </template>
  </main>
  <Footer />
</template>

<script>
export default {
  data() {
    return {
      content: null,
      loading: true,
      error: null,
      latestPosts: [],
      blogLoading: true,
      blogError: null,
      topCategories: [],
      categoriesLoading: true,
      categoriesError: null,
      cache: new Map()
    }
  },
  async mounted() {
    await this.loadAllData();
  },
  methods: {
    async loadAllData() {
      try {
        // Load all data in parallel
        const [content, posts, categories] = await Promise.all([
          this.loadContent(),
          this.loadLatestPosts(),
          this.loadTopCategories()
        ]);

        this.content = content;
        this.latestPosts = posts || [];
        this.topCategories = categories || [];

      } catch (error) {
        console.error('Error loading data:', error);
        this.error = 'Failed to load content. Please refresh the page.';
      } finally {
        this.loading = false;
        this.blogLoading = false;
        this.categoriesLoading = false;
      }
    },

    async loadContent() {
      const cacheKey = 'page-11-content';
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const content = JSON.parse(cachedData);
        this.cache.set(cacheKey, content);
        return content;
      }

      const page = await this.$pageCache.getPage(11);
      if (page?.acf) {
        sessionStorage.setItem(cacheKey, JSON.stringify(page.acf));
        this.cache.set(cacheKey, page.acf);
        return page.acf;
      }
      return null;
    },

    async loadLatestPosts() {
      const cacheKey = 'latest-posts';
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      try {
        const response = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
          params: {
            per_page: 4,
            _embed: true,
            order: 'desc',
            orderby: 'date'
          }
        });

        this.cache.set(cacheKey, response);
        return response;
      } catch (error) {
        this.blogError = 'Erreur lors du chargement des articles.';
        return [];
      }
    },

    async loadTopCategories() {
      const cacheKey = 'top-categories';
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      try {
        // Get categories and posts in one optimized call
        const [categoriesResponse, postsResponse] = await Promise.all([
          $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/categories', {
            params: {
              per_page: 6,
              hide_empty: true,
              orderby: 'count',
              order: 'desc'
            }
          }),
          $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
            params: {
              per_page: 20,
              _embed: true,
              order: 'desc',
              orderby: 'date'
            }
          })
        ]);

        // Map categories with their featured images from posts
        const categoriesWithImages = categoriesResponse.map(category => {
          const categoryPost = postsResponse.find(post => 
            post.categories.includes(category.id) && 
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url
          );

          const latestPost = postsResponse.find(post => post.categories.includes(category.id));

          return {
            ...category,
            featuredImage: categoryPost?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-category.jpg',
            postCount: category.count,
            latestPost: latestPost
          };
        });

        this.cache.set(cacheKey, categoriesWithImages);
        return categoriesWithImages;

      } catch (error) {
        this.categoriesError = 'Erreur lors du chargement des catégories.';
        return [];
      }
    },

    optimizeImage(url, width = 800) {
      if (!url || url.includes('placeholder')) return url;
      return `${url}?w=${width}&format=webp&quality=80`;
    },

    cleanText(html) {
      if (!html) return '';
      // Simple regex to remove HTML tags - much faster than DOM manipulation
      return html.replace(/<[^>]*>/g, '').trim();
    },

    handleImageError(event) {
      event.target.src = '/placeholder-image.jpg';
    },

    handleCategoryImageError(event) {
      event.target.src = '/placeholder-category.jpg';
    }
  }
}
</script>

<style scoped>
/* Critical CSS only */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.font-serif {
  font-family: 'Cormorant Garamond', serif;
  font-display: swap;
}

.italic {
  font-family: 'Dancing Script', cursive;
  font-display: swap;
}
</style>