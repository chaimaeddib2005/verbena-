<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Skeleton Loading -->
    <section v-if="loading" class="animate-pulse">
      <!-- Skeleton content here -->
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
          <!-- Optimized Image -->
          <div v-if="content.hero_image" class="md:w-2/5">
            <img 
              :src="content.hero_image"
              :srcset="generateSrcSet(content.hero_image)"
              alt="Hero Image"
              width="400"
              height="300"
              loading="lazy"
              class="w-full max-w-[400px] h-auto rounded-xl shadow-lg object-cover border-4 border-white"
              @error="handleImageError"
            >
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
      const cachedData = sessionStorage.getItem('pageContent');
      
      if (cachedData) {
        this.content = JSON.parse(cachedData);
        this.loading = false;
        return;
      }

      const page = await this.$pageCache.getPage(11);
      if (page?.acf) {
        this.content = page.acf;
        sessionStorage.setItem('pageContent', JSON.stringify(page.acf));
      }
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load content';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    generateSrcSet(originalUrl) {
      return `${originalUrl}?w=400 400w, ${originalUrl}?w=800 800w`;
    }
  }
}
</script>

<style>
/* Preload fonts */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500&family=Dancing+Script&display=swap">
<style>
/* Critical CSS first */
.font-serif {
  font-family: 'Cormorant Garamond', serif;
  font-display: swap;
}
.italic {
  font-family: 'Dancing Script', cursive;
  font-display: swap;
}

/* Non-critical styles */
@media (min-width: 768px) {
  .items-center {
    align-items: center;
  }
}
</style>