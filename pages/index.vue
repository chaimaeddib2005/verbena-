<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Add v-if to prevent rendering when content isn't loaded -->
    <section v-if="content && content.hero_title">
      <!-- Centered Title & Description -->
      <div class="text-center mb-12 max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-light text-violet-900 mb-4">
          {{ content.hero_title }}
        </h1>
        <p v-if="content.hero_description" class="text-xl text-violet-700 font-serif italic">
          {{ content.hero_description }}
        </p>
      </div>

      <!-- Image + Text Row -->
      <div v-if="content.hero_image || content.description" class="flex flex-col md:flex-row gap-8 items-center">
        <!-- Smaller Left-aligned Image -->
        <div v-if="content.hero_image" class="md:w-2/5">
          <img 
            :src="content.hero_image" 
            alt="Hero Image"
            class="w-full max-w-[400px] h-auto rounded-xl shadow-lg object-cover border-4 border-white"
            @error="handleImageError"
          >
        </div>

        <!-- Middle-aligned Description -->
        <div v-if="content.description" class="md:w-3/5 prose prose-lg text-violet-800 self-center">
          <h1 class="text-4xl md:text-5xl font-light text-violet-900 mb-4">
          {{ content.titre_description }}
        </h1>
          <p class="leading-relaxed">{{ content.description }}</p>
        </div>
      </div>
    </section>

    <!-- Loading state -->
    <div v-else class="text-center py-12">
      <p class="text-violet-600">Loading content...</p>
    </div>
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
      const page = await this.$pageCache.getPage(11);
      if (page?.acf) {
        this.content = page.acf;
      } else {
        throw new Error('Invalid page data structure');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleImageError(e) {
      e.target.style.display = 'none';
      console.warn('Image failed to load');
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500&family=Dancing+Script&display=swap');

.font-serif {
  font-family: 'Cormorant Garamond', serif;
}
.italic {
  font-family: 'Dancing Script', cursive;
}
.prose {
  max-width: 100%;
}

/* Ensure vertical centering */
@media (min-width: 768px) {
  .items-center {
    align-items: center;
  }
}
</style>