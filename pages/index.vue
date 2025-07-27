<template>
  <Header />
  <main class="container mx-auto px-4 py-8">
    <!-- Skeleton -->
    <section v-if="loading" class="animate-pulse space-y-6">
      <!-- Hero Title Skeleton -->
      <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
        <div class="h-12 md:h-16 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <!-- Hero Content Skeleton -->
      <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-16">
        <div class="md:w-2/5">
          <div class="aspect-[16/9] bg-gray-200 rounded-xl w-full max-w-[400px] md:max-w-none mx-auto"></div>
        </div>
        <div class="md:w-3/5 space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
      
      <!-- Categories Skeleton -->
      <div class="mb-20">
        <div class="h-16 bg-gray-200 rounded-lg mb-6"></div>
        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="aspect-[4/3] w-full bg-gray-200"></div>
            <div class="p-4 space-y-3">
              <div class="h-6 w-3/4 bg-gray-200 rounded"></div>
              <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div class="h-3 w-2/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Blog Posts Skeleton -->
      <div class="mb-20">
        <div class="h-16 bg-gray-200 rounded-lg mb-6"></div>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow overflow-hidden h-80">
            <div class="aspect-[4/3] w-full bg-gray-200"></div>
            <div class="p-5 space-y-3">
              <div class="h-6 w-3/4 bg-gray-200 rounded"></div>
              <div class="h-4 w-full bg-gray-200 rounded"></div>
              <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div class="h-4 w-1/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500 min-h-[400px] flex items-center justify-center">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <section v-if="content" class="mb-16">
        <!-- Hero Title Section -->
        <div class="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-3 md:mb-4 hero-title">
            {{ content.hero_title }}
          </h1>
          <p v-if="content.hero_description" class="text-lg md:text-xl text-violet-700 font-serif italic hero-description">
            {{ content.hero_description }}
          </p>
        </div>

        <!-- Hero Image + Text -->
        <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div v-if="content.hero_image" class="md:w-2/5">
            <!-- Reserved space container with aspect ratio -->
            <div class="relative w-full max-w-[400px] md:max-w-none mx-auto aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <picture>
                <source media="(max-width: 767px)" :srcset="`${optimizedHeroImage.mobile.webp} 400w, ${optimizedHeroImage.mobile.webp} 600w`" type="image/webp" />
                <source media="(min-width: 768px)" :srcset="`${optimizedHeroImage.desktop.webp} 800w, ${optimizedHeroImage.desktop.webp} 1200w`" type="image/webp" />
                <img
                  :src="optimizedHeroImage.current"
                  width="800"
                  height="450"
                  loading="eager"
                  decoding="async"
                  class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  :class="{ 'opacity-0': !imageLoaded }"
                  @load="handleImageLoad"
                  @error="handleImageError"
                  alt="Hero Image"
                />
              </picture>
              
              <!-- Loading placeholder -->
              <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                <div class="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div class="md:w-3/5 prose prose-sm md:prose-lg text-violet-800">
            <h2 class="text-2xl md:text-4xl font-light text-violet-900 mb-3 md:mb-4">
              {{ content.titre_description }}
            </h2>
            <p class="leading-relaxed">{{ content.description }}</p>
          </div>
        </div>
      </section>

      <!-- Categories Grid - Fixed Layout Shift -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-6 text-center bg-purple-100 py-10 px-6 rounded-lg shadow">
          Les catégories les plus populaires
        </h2>
        
        <!-- Fixed height container to prevent layout shift -->
        <div class="min-h-[800px] md:min-h-[600px]">
          <!-- Categories Loading with proper spacing -->
          <div v-if="categoriesLoading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden">
              <!-- Fixed aspect ratio for image placeholder -->
              <div class="aspect-[4/3] w-full bg-gray-200 animate-pulse"></div>
              <div class="p-4 space-y-3">
                <div class="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Categories Error -->
          <div v-else-if="categoriesError" class="text-center text-red-600 py-8 min-h-[400px] flex items-center justify-center">
            {{ categoriesError }}
          </div>

          <!-- Categories Content with reserved space -->
          <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <NuxtLink
              v-for="category in topCategories"
              :key="category.id"
              :to="`/blog/${category.slug}`"
              class="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <!-- Fixed aspect ratio container for images -->
              <div class="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  :src="category.featuredImage"
                  class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  :class="{ 'opacity-0': !category.imageLoaded }"
                  :alt="category.name"
                  loading="lazy"
                  @load="() => handleCategoryImageLoad(category)"
                  @error="(e) => handleCategoryImageError(e, category)"
                />
                
                <!-- Loading state for individual images -->
                <div v-if="!category.imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                  <div class="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
                
                <!-- Post count badge -->
                <div class="absolute top-4 right-4 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {{ category.postCount }} article{{ category.postCount > 1 ? 's' : '' }}
                </div>
              </div>
              
              <!-- Fixed height content area -->
              <div class="p-4 h-32 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-violet-900 mb-2 line-clamp-2">
                    {{ processWordPressContent(category.name) }}
                  </h3>
                  <p v-if="category.description" class="text-sm text-gray-600 line-clamp-2">
                    {{ processWordPressContent(category.description) }}
                  </p>
                </div>
                <div v-if="category.latestPost" class="text-xs text-violet-500 mt-2 line-clamp-1">
                  Dernier: "{{ processWordPressContent(category.latestPost.title.rendered).substring(0, 40) }}..."
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Blog Categories Navigation Button -->
        <div class="text-center mt-8">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Voir toutes les catégories
          </NuxtLink>
        </div>
      </section>

      <!-- Latest Blog Posts Section with Fixed Layout -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-6 text-center bg-purple-100 py-10 px-6 rounded-lg shadow">
          Nos derniers articles
        </h2>
        
        <!-- Fixed minimum height to prevent layout shift -->
        <div class="min-h-[600px]">
          <!-- Blog Posts Loading -->
          <div v-if="blogLoading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow overflow-hidden flex flex-col h-80">
              <!-- Fixed aspect ratio for image -->
              <div class="aspect-[4/3] w-full bg-gray-200 animate-pulse"></div>
              <div class="p-5 flex-1 flex flex-col space-y-3">
                <div class="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div class="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Blog Posts Error -->
          <div v-else-if="blogError" class="text-center text-red-600 py-8 min-h-[400px] flex items-center justify-center">
            {{ blogError }}
          </div>

          <!-- Blog Posts Content with consistent heights -->
          <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <NuxtLink
              v-for="post in latestPosts"
              :key="post.id"
              :to="`/blog/post/${post.slug}`"
              class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:scale-105 h-80"
            >
              <!-- Fixed aspect ratio image container -->
              <div class="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  v-if="post._embedded?.['wp:featuredmedia']"
                  :src="post._embedded['wp:featuredmedia'][0].source_url"
                  alt="image"
                  class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  :class="{ 'opacity-0': !post.imageLoaded }"
                  loading="lazy"
                  @load="() => handlePostImageLoad(post)"
                  @error="(e) => handlePostImageError(e, post)"
                />
                
                <!-- Loading placeholder for post images -->
                <div v-if="!post.imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                  <div class="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <!-- Fixed height content area -->
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-violet-900" v-html="processWordPressContent(post.title.rendered, true)"></h3>
                  <div class="text-sm text-gray-600 mb-4 line-clamp-3 flex-1" v-html="processWordPressContent(post.excerpt.rendered, true)"></div>
                </div>
                <span class="text-violet-600 text-sm font-medium hover:underline">
                  Lire l'article →
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- View All Blog Posts Button -->
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
      isMobile: false,
      imageLoaded: false,
      categories: [], // Keep for backward compatibility if needed
      optimizedHeroImage: {
        mobile: { webp: '', jpg: '' },
        desktop: { webp: '', jpg: '' },
        current: ''
      },
      // Blog posts data
      latestPosts: [],
      blogLoading: true,
      blogError: null,
      // Dynamic categories data
      topCategories: [],
      categoriesLoading: true,
      categoriesError: null,
      // WordPress shortcode patterns
      shortcodePatterns: {
        // Common WordPress shortcodes
        gallery: /\[gallery[^\]]*\]/gi,
        caption: /\[caption[^\]]*\](.*?)\[\/caption\]/gi,
        video: /\[video[^\]]*\]/gi,
        audio: /\[audio[^\]]*\]/gi,
        embed: /\[embed[^\]]*\](.*?)\[\/embed\]/gi,
        youtube: /\[youtube[^\]]*\]/gi,
        vimeo: /\[vimeo[^\]]*\]/gi,
        contact: /\[contact-form[^\]]*\]/gi,
        button: /\[button[^\]]*\](.*?)\[\/button\]/gi,
        columns: /\[(?:one_half|one_third|two_third|one_fourth|three_fourth)[^\]]*\](.*?)\[\/(?:one_half|one_third|two_third|one_fourth|three_fourth)\]/gi,
        // Generic shortcode pattern for any remaining shortcodes
        generic: /\[[^\]]+\]/g
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
        this.extractCategories(); // Keep for backward compatibility
        this.loading = false;
      } else {
        const page = await this.$pageCache.getPage(11);
        if (page?.acf) {
          this.content = page.acf;
          sessionStorage.setItem(cacheKey, JSON.stringify(page.acf));
          this.prepareImages();
          this.extractCategories(); // Keep for backward compatibility
        }
        this.loading = false;
      }
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load content. Please refresh the page.';
      this.loading = false;
    }

    // Fetch latest blog posts and top categories
    this.fetchLatestPosts();
    this.fetchTopCategories();
  },
  methods: {
    /**
     * Process WordPress content by handling shortcodes and HTML
     * @param {string} content - The raw WordPress content
     * @param {boolean} allowHtml - Whether to allow safe HTML tags
     * @returns {string} - Processed content
     */
    processWordPressContent(content, allowHtml = false) {
      if (!content) return '';
      
      let processedContent = content;
      
      // Handle specific shortcodes with custom processing
      processedContent = this.processSpecificShortcodes(processedContent);
      
      // Remove remaining shortcodes
      processedContent = this.removeShortcodes(processedContent);
      
      if (allowHtml) {
        // Keep safe HTML tags and remove only dangerous ones
        processedContent = this.sanitizeHtml(processedContent);
      } else {
        // Strip all HTML tags
        processedContent = this.stripHtml(processedContent);
      }
      
      // Clean up extra whitespace
      processedContent = processedContent.replace(/\s+/g, ' ').trim();
      
      return processedContent;
    },

    /**
     * Process specific WordPress shortcodes with custom logic
     * @param {string} content - Content with shortcodes
     * @returns {string} - Content with processed shortcodes
     */
    processSpecificShortcodes(content) {
      let processed = content;
      
      // Process [caption] shortcodes - extract the caption text
      processed = processed.replace(this.shortcodePatterns.caption, (match, captionContent) => {
        // Extract just the caption text, removing any img tags
        const captionText = captionContent.replace(/<img[^>]*>/gi, '').trim();
        return captionText ? `(${captionText})` : '';
      });
      
      // Process [gallery] shortcodes - replace with a placeholder text
      processed = processed.replace(this.shortcodePatterns.gallery, () => {
        return '[Galerie d\'images]';
      });
      
      // Process [video] shortcodes - replace with placeholder
      processed = processed.replace(this.shortcodePatterns.video, () => {
        return '[Vidéo]';
      });
      
      // Process [audio] shortcodes - replace with placeholder
      processed = processed.replace(this.shortcodePatterns.audio, () => {
        return '[Audio]';
      });
      
      // Process [embed] shortcodes - extract URL or replace with placeholder
      processed = processed.replace(this.shortcodePatterns.embed, (match, embedContent) => {
        // If there's content between the shortcode tags, it might be a URL
        const url = embedContent.trim();
        if (url && (url.startsWith('http') || url.startsWith('www'))) {
          return `[Contenu intégré: ${url}]`;
        }
        return '[Contenu intégré]';
      });
      
      // Process [button] shortcodes - extract button text
      processed = processed.replace(this.shortcodePatterns.button, (match, buttonText) => {
        return buttonText.trim() || '[Bouton]';
      });
      
      // Process column shortcodes - extract content and add spacing
      processed = processed.replace(this.shortcodePatterns.columns, (match, columnContent) => {
        return columnContent.trim() + ' ';
      });
      
      return processed;
    },

    /**
     * Remove WordPress shortcodes from content
     * @param {string} content - Content with shortcodes
     * @returns {string} - Content without shortcodes
     */
    removeShortcodes(content) {
      let processed = content;
      
      // Remove any remaining shortcodes using the generic pattern
      processed = processed.replace(this.shortcodePatterns.generic, '');
      
      return processed;
    },

    /**
     * Sanitize HTML content - keep safe tags, remove dangerous ones
     * @param {string} html - HTML content
     * @returns {string} - Sanitized HTML
     */
    sanitizeHtml(html) {
      // Create a temporary element to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // List of allowed tags for excerpts and titles
      const allowedTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'span'];
      
      // Remove script and style elements completely
      const scripts = temp.querySelectorAll('script, style');
      scripts.forEach(el => el.remove());
      
      // Process all elements
      const allElements = temp.querySelectorAll('*');
      allElements.forEach(el => {
        if (!allowedTags.includes(el.tagName.toLowerCase())) {
          // Replace disallowed tags with their text content
          const textNode = document.createTextNode(el.textContent || '');
          el.parentNode?.replaceChild(textNode, el);
        }
      });
      
      return temp.innerHTML;
    },

    /**
     * Strip all HTML tags from content
     * @param {string} html - HTML content
     * @returns {string} - Plain text content
     */
    stripHtml(html) {
      if (!html) return '';
      
      // Create temporary element to extract text content
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      
      // Remove script and style content
      const scripts = tmp.querySelectorAll('script, style');
      scripts.forEach(el => el.remove());
      
      return tmp.textContent || tmp.innerText || '';
    },

    checkViewport() {
      this.isMobile = window.innerWidth < 768;
      if (this.content?.hero_image) {
        this.updateCurrentImage();
      }
    },
    prepareImages() {
      if (!this.content?.hero_image) return;
      const baseUrl = this.content.hero_image;
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
    },
    handleCategoryImageLoad(category) {
      // Set imageLoaded flag for specific category (Vue 3 way)
      category.imageLoaded = true;
    },
    handleCategoryImageError(event, category) {
      // Fallback to placeholder image if category image fails to load
      event.target.src = '/placeholder-category.jpg';
      category.imageLoaded = true;
    },
    handlePostImageLoad(post) {
      // Set imageLoaded flag for specific post (Vue 3 way)
      post.imageLoaded = true;
    },
    handlePostImageError(event, post) {
      // Fallback to placeholder image if post image fails to load
      event.target.src = '/placeholder-post.jpg';
      post.imageLoaded = true;
    },
    extractCategories() {
      // Keep existing method for backward compatibility
      const raw = this.content;
      const keys = Object.keys(raw).filter(k => /^categorie(_copier\d*|$)/.test(k));
      keys.sort((a, b) => {
        const extractNum = key => key === 'categorie' ? 0 : parseInt(key.match(/\d+/)?.[0] || 1);
        return extractNum(a) - extractNum(b);
      });

      this.categories = keys.map(k => {
        const cat = raw[k];
        const baseUrl = cat.image_categorie;
        return {
          ...cat,
          optimized: {
            webp: this.generateImageUrl(baseUrl, 600, 'webp'),
            jpg: this.generateImageUrl(baseUrl, 600)
          }
        };
      });
    },
    async fetchTopCategories() {
      try {
        this.categoriesLoading = true;
        this.categoriesError = null;

        // First, fetch all categories
        const categoriesResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/categories', {
          params: {
            per_page: 20, // Get more than 6 to sort by popularity
            hide_empty: true,
            orderby: 'count',
            order: 'desc'
          }
        });

        // For each of the top categories, fetch one post to get an image
        const categoriesWithPosts = await Promise.all(
          categoriesResponse.slice(0, 10).map(async (category) => { // Process top 10 to have options
            try {
              // Fetch the latest post from this category
              const postsResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
                params: {
                  categories: category.id,
                  per_page: 1,
                  _embed: true
                }
              });

              const post = postsResponse[0];
              const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              return {
                ...category,
                featuredImage: featuredImage || '/placeholder-category.jpg',
                postCount: category.count,
                latestPost: post,
                imageLoaded: false // Initialize loading state
              };
            } catch (err) {
              console.warn(`Error fetching posts for category ${category.slug}:`, err);
              return {
                ...category,
                featuredImage: '/placeholder-category.jpg',
                postCount: category.count,
                latestPost: null,
                imageLoaded: false // Initialize loading state
              };
            }
          })
        );

        // Take only the top 6 categories with valid images for display
        this.topCategories = categoriesWithPosts
          .filter(cat => cat.count > 0)
          .slice(0, 6);

      } catch (error) {
        console.error('Error fetching top categories:', error);
        this.categoriesError = 'Erreur lors du chargement des catégories.';
      } finally {
        this.categoriesLoading = false;
      }
    },
    async fetchLatestPosts() {
      try {
        this.blogLoading = true;
        this.blogError = null;

        const response = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
          params: {
            per_page: 4,
            _embed: true,
            order: 'desc',
            orderby: 'date'
          }
        });

        // Initialize imageLoaded state for each post
        this.latestPosts = response.map(post => ({
          ...post,
          imageLoaded: false
        }));

      } catch (error) {
        console.error('Error fetching blog posts:', error);
        this.blogError = 'Erreur lors du chargement des articles.';
      } finally {
        this.blogLoading = false;
      }
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

/* Line clamp utilities for blog posts and categories */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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

/* Ensure processed content displays properly */
.processed-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Aspect ratio utilities for consistent layouts */
.aspect-\[16\/9\] {
  aspect-ratio: 16 / 9;
}

.aspect-\[4\/3\] {
  aspect-ratio: 4 / 3;
}

/* Prevent layout shift during image loading */
.aspect-\[16\/9\], .aspect-\[4\/3\] {
  position: relative;
  overflow: hidden;
}

/* Smooth transitions for hover effects */
.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Loading animation for skeletons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fixed height utilities to prevent layout shift */
.min-h-\[400px\] {
  min-height: 400px;
}

.min-h-\[600px\] {
  min-height: 600px;
}

.min-h-\[800px\] {
  min-height: 800px;
}

.h-80 {
  height: 20rem;
}

.h-32 {
  height: 8rem;
}

/* Ensure consistent card heights */
@media (min-width: 768px) {
  .min-h-\[800px\] {
    min-height: 600px;
  }
}
</style>