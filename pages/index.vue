<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Skeleton Loading (now with proper placeholder sizing) -->
    <section v-if="loading" class="animate-pulse space-y-6">
      <div class="h-12 bg-violet-100 rounded mx-auto max-w-3xl"></div>
      <div class="h-6 bg-violet-100 rounded mx-auto max-w-2xl"></div>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-2/5 h-64 bg-violet-100 rounded-xl"></div>
        <div class="md:w-3/5 space-y-4">
          <div class="h-8 bg-violet-100 rounded"></div>
          <div class="h-4 bg-violet-100 rounded"></div>
          <div class="h-4 bg-violet-100 rounded w-5/6"></div>
        </div>
      </div>
    </section>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <section v-if="content" class="mb-16">
        <!-- Title Section -->
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-light text-violet-900 mb-4">
            {{ content.hero_title }}
          </h1>
          <p v-if="content.hero_description" class="text-xl text-violet-700 font-serif italic">
            {{ content.hero_description }}
          </p>
        </div>

        <!-- Image + Text Row -->
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <!-- Optimized Image with WebP + Art Direction -->
          <div v-if="content.hero_image" class="md:w-2/5">
            <picture>
              <source 
                :srcset="`${generateImageUrl(content.hero_image, 400, 'webp')} 400w,
                         ${generateImageUrl(content.hero_image, 800, 'webp')} 800w`" 
                type="image/webp"
              >
              <source
                :srcset="`${generateImageUrl(content.hero_image, 400)} 400w,
                         ${generateImageUrl(content.hero_image, 800)} 800w`"
                type="image/jpeg"
              >
              <img 
                :src="generateImageUrl(content.hero_image, 800)"
                width="400"
                height="300"
                loading="lazy"
                class="w-full max-w-[400px] h-auto rounded-xl shadow-lg object-cover border-4 border-white"
                alt="Hero Image"
                @error="handleImageError"
              >
            </picture>
          </div>

          <!-- Description -->
          <div class="md:w-3/5 prose prose-lg text-violet-800">
            <h2 class="text-3xl md:text-4xl font-light text-violet-900 mb-4">
              {{ content.titre_description }}
            </h2>
            <p class="leading-relaxed">{{ content.description }}</p>
          </div>
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
      error: null
    }
  },
  async mounted() {
    try {
      const cacheKey = 'cachedPage-11';
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheExpiry = localStorage.getItem(`${cacheKey}-expiry`);
      
      // Use cached data if not expired (1 hour cache)
      if (cachedData && cacheExpiry && Date.now() < cacheExpiry) {
        this.content = JSON.parse(cachedData);
        this.loading = false;
        return;
      }

      // Fetch fresh data
      const page = await this.$pageCache.getPage(11);
      if (page?.acf) {
        this.content = page.acf;
        sessionStorage.setItem(cacheKey, JSON.stringify(page.acf));
        localStorage.setItem(`${cacheKey}-expiry`, Date.now() + 3600000); // 1 hour expiry
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load content. Please try again later.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleImageError(e) {
      // Fallback to placeholder
      e.target.src = '/placeholder.webp';
      e.target.srcset = '';
    },
    generateImageUrl(originalUrl, width = 800, format = 'jpg') {
      if (!originalUrl) return '';
      // Replace with your actual image CDN/service parameters
      return `${originalUrl}?width=${width}&format=${format}&quality=80`;
    }
  }
}
</script>

<style>
/* Critical CSS - Inlined */
.hero-title, .hero-description {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}
@keyframes fadeIn { to { opacity: 1; } }

.font-serif {
  font-family: 'Cormorant Garamond', serif;
  font-display: swap;
}
.italic {
  font-family: 'Dancing Script', cursive;
  font-display: swap;
}

/* Non-critical CSS (loaded async) */
@media (min-width: 768px) {
  .items-center {
    align-items: center;
  }
}
</style>