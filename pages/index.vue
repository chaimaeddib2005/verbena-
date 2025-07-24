<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Skeleton Loading -->
    <section v-if="loading" class="animate-pulse space-y-6">
      <div class="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div class="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-2/5 h-64 bg-gray-200 rounded-xl"></div>
        <div class="md:w-3/5 space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <section v-if="content" class="mb-16">
        <!-- Hero Title Section -->
        <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-3 md:mb-4">
            {{ content.hero_title }}
          </h1>
          <p v-if="content.hero_description" class="text-lg md:text-xl text-violet-700 font-serif italic">
            {{ content.hero_description }}
          </p>
        </div>

        <!-- Hero Image + Text -->
        <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div v-if="content.hero_image" class="md:w-2/5">
            <picture>
              <source 
                :srcset="optimizedHeroImage.webp" 
                type="image/webp"
              >
              <img
                :src="optimizedHeroImage.jpg"
                width="800"
                height="450"
                loading="eager"
                class="w-full max-w-[400px] md:max-w-none h-auto rounded-xl shadow-lg object-cover border-4 border-white"
                :alt="content.hero_alt || 'Hero image'"
                @load="imageLoaded = true"
                @error="handleImageError"
                :class="{ 'opacity-0': !imageLoaded }"
              />
            </picture>
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
      <section v-if="categories.length" class="mb-20">
        <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-6 text-center bg-purple-100 py-10 px-6 rounded-lg shadow">
          Les catégories les plus populaires
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="(cat, index) in categories"
            :key="index"
            class="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl"
          >
            <picture>
              <source :srcset="cat.optimized.webp" type="image/webp">
              <img
                :src="cat.optimized.jpg"
                class="w-full h-48 object-cover"
                :alt="cat.categorie_nom"
                loading="lazy"
              />
            </picture>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-violet-900">
                {{ cat.categorie_nom }}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </template>
  </main>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(true);
const error = ref(null);
const imageLoaded = ref(false);
const content = ref(null);
const categories = ref([]);

const optimizedHeroImage = computed(() => {
  if (!content.value?.hero_image) return { webp: '', jpg: '' };
  const baseUrl = content.value.hero_image;
  return {
    webp: `${baseUrl}?w=1200&format=webp&quality=80`,
    jpg: `${baseUrl}?w=1200&quality=80`
  };
});

const prepareCategories = () => {
  const raw = content.value;
  const categoryKeys = Object.keys(raw).filter(k => k.startsWith('categorie'));
  
  categories.value = categoryKeys.map(key => {
    const category = raw[key];
    const baseUrl = category.image_categorie;
    return {
      ...category,
      optimized: {
        webp: `${baseUrl}?w=600&format=webp&quality=80`,
        jpg: `${baseUrl}?w=600&quality=80`,
        alt: category.image_alt || category.categorie_nom
      }
    };
  });
};

const handleImageError = (e) => {
  console.warn('Image failed to load, using fallback');
  e.target.src = '/placeholder.jpg';
  imageLoaded.value = true;
};

onMounted(async () => {
  try {
    // Replace with your actual data fetching method
    const page = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/pages/11');
    
    if (page?.acf) {
      content.value = page.acf;
      prepareCategories();
      
      // Preload hero image
      if (content.value.hero_image) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = optimizedHeroImage.value.webp;
        document.head.appendChild(link);
      }
    }
  } catch (err) {
    console.error('Error:', err);
    error.value = 'Failed to load content. Please refresh the page.';
  } finally {
    loading.value = false;
  }
});
</script>

<style>
/* Critical CSS */
.hero-title, .hero-description {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}
@keyframes fadeIn { to { opacity: 1; } }

/* Font loading */
.font-serif {
  font-family: 'Cormorant Garamond', system-ui, -apple-system, sans-serif;
  font-display: swap;
}
.italic {
  font-family: 'Dancing Script', system-ui, -apple-system, sans-serif;
  font-display: swap;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .items-center {
    align-items: center;
  }
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }
  .italic {
    font-family: 'Dancing Script', cursive;
  }
}

/* Image transitions */
img[class*="opacity-0"] {
  transition: opacity 0.3s ease;
}

/* Performance optimizations */
img {
  content-visibility: auto;
}
</style>