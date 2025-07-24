<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Enhanced Skeleton Loading -->
    <section v-if="loading" class="animate-pulse space-y-6">
      <div class="h-10 md:h-12 bg-violet-100 rounded mx-auto max-w-3xl"></div>
      <div class="h-5 md:h-6 bg-violet-100 rounded mx-auto max-w-2xl"></div>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-2/5 h-48 md:h-64 bg-violet-100 rounded-xl"></div>
        <div class="md:w-3/5 space-y-3 md:space-y-4">
          <div class="h-7 md:h-8 bg-violet-100 rounded"></div>
          <div class="h-3 md:h-4 bg-violet-100 rounded"></div>
          <div class="h-3 md:h-4 bg-violet-100 rounded w-5/6"></div>
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
        <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-3 md:mb-4">
            {{ content.hero_title }}
          </h1>
          <p v-if="content.hero_description" class="text-lg md:text-xl text-violet-700 font-serif italic">
            {{ content.hero_description }}
          </p>
        </div>

        <!-- Image + Text Row -->
        <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <!-- Smart Image Loading -->
          <div v-if="content.hero_image" class="md:w-2/5">
            <picture>
              <!-- Mobile-optimized WebP -->
              <source 
                media="(max-width: 767px)"
                :srcset="`${optimizedHeroImage.mobile.webp} 400w,
                         ${optimizedHeroImage.mobile.webp} 600w`"
                type="image/webp"
              >
              <!-- Desktop WebP -->
              <source
                media="(min-width: 768px)"
                :srcset="`${optimizedHeroImage.desktop.webp} 800w,
                         ${optimizedHeroImage.desktop.webp} 1200w`"
                type="image/webp"
              >
              <!-- Fallback -->
              <img
                :src="optimizedHeroImage.current"
                width="800"
                height="450"
                loading="eager"
                decoding="async"
                class="w-full max-w-[400px] md:max-w-none h-auto rounded-xl shadow-lg object-cover border-4 border-white"
                :class="{ 'opacity-0': !imageLoaded }"
                @load="handleImageLoad"
                @error="handleImageError"
                alt="Hero Image"
              >
            </picture>
          </div>

          <!-- Description -->
          <div class="md:w-3/5 prose prose-sm md:prose-lg text-violet-800">
            <h2 class="text-2xl md:text-4xl font-light text-violet-900 mb-3 md:mb-4">
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
      error: null,
      isMobile: false,
      imageLoaded: false,
      optimizedHeroImage: {
        mobile: {
          webp: '',
          jpg: ''
        },
        desktop: {
          webp: '',
          jpg: ''
        },
        current: ''
      }
    }
  },
  async mounted() {
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);

    try {
      const cacheKey = `page-11-${this.isMobile ? 'mobile' : 'desktop'}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        this.content = JSON.parse(cachedData);
        this.prepareImages();
        this.loading = false;
        return;
      }

      const page = await this.$pageCache.getPage(11);
      if (page?.acf) {
        this.content = page.acf;
        sessionStorage.setItem(cacheKey, JSON.stringify(page.acf));
        this.prepareImages();
      }
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load content. Please refresh the page.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    checkViewport() {
      this.isMobile = window.innerWidth < 768;
      if (this.content?.hero_image) {
        this.updateCurrentImage();
      }
    },
    prepareImages() {
      if (!this.content?.hero_image) return;
      
      const baseUrl = this.content.hero_image;
      
      // Generate all image variants
      this.optimizedHeroImage = {
        mobile: {
          webp: this.generateImageUrl(baseUrl, 600, 'webp'),
          jpg: this.generateImageUrl(baseUrl, 600)
        },
        desktop: {
          webp: this.generateImageUrl(baseUrl, 1200, 'webp'),
          jpg: this.generateImageUrl(baseUrl, 1200)
        },
        current: ''
      };
      
      this.updateCurrentImage();
      this.preloadOptimalImage();
    },
    updateCurrentImage() {
      this.optimizedHeroImage.current = this.isMobile
        ? this.optimizedHeroImage.mobile.jpg
        : this.optimizedHeroImage.desktop.jpg;
    },
    preloadOptimalImage() {
      const img = new Image();
      img.src = this.isMobile
        ? this.optimizedHeroImage.mobile.webp
        : this.optimizedHeroImage.desktop.webp;
    },
    generateImageUrl(url, width, format = 'jpg') {
      if (!url) return '';
      // Example for WordPress (adjust for your CMS):
      return `${url}?w=${width}&format=${format}&quality=80`;
    },
    handleImageLoad() {
      this.imageLoaded = true;
    },
    handleImageError(e) {
      console.warn('Image failed to load, using fallback');
      e.target.src = this.isMobile
        ? '/placeholder-mobile.jpg'
        : '/placeholder-desktop.jpg';
      this.imageLoaded = true;
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport);
  }
}
</script>

<style>
/* Critical CSS */
.hero-title, .hero-description {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}
@keyframes fadeIn { to { opacity: 1; } }

/* Mobile-first font loading */
.font-serif {
  font-family: 'Cormorant Garamond', system-ui, -apple-system, sans-serif;
  font-display: swap;
}
.italic {
  font-family: 'Dancing Script', system-ui, -apple-system, sans-serif;
  font-display: swap;
}

/* Non-critical CSS */
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

/* Image fade-in */
img[class*="opacity-0"] {
  transition: opacity 0.3s ease;
}
</style>