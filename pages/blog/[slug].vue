<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'

const route = useRoute()
const { slug } = route.params

// Reactive data
const category = ref(null)
const posts = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const postsPerPage = 9
const totalPosts = ref(0)

// Fetch category details and posts
const fetchCategoryAndPosts = async (page = 1) => {
  try {
    loading.value = true
    error.value = null

    // First, fetch the category by slug to get its ID and details
    const categoryResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/categories', {
      query: {
        slug: slug,
        per_page: 1
      }
    })

    if (!categoryResponse || categoryResponse.length === 0) {
      throw new Error('Catégorie non trouvée')
    }

    category.value = categoryResponse[0]

    // Then fetch posts for this category
    const postsResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
      query: {
        categories: category.value.id,
        per_page: postsPerPage,
        page: page,
        _embed: true,
        order: 'desc',
        orderby: 'date'
      }
    })

    posts.value = postsResponse
    
    // Get total count from headers if available, or estimate
    totalPosts.value = postsResponse.length === postsPerPage ? postsPerPage * page + 1 : postsPerPage * (page - 1) + postsResponse.length

  } catch (err) {
    console.error('Error fetching category posts:', err)
    error.value = err.message || 'Erreur lors du chargement des articles'
  } finally {
    loading.value = false
  }
}

// Computed properties
const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage))

const hasNextPage = computed(() => posts.value.length === postsPerPage)
const hasPrevPage = computed(() => currentPage.value > 1)

// Utility functions
const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html.replace(/<[^>]*>?/gm, '')
  return tmp.textContent || tmp.innerText || ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watch for page changes
watch(currentPage, (newPage) => {
  fetchCategoryAndPosts(newPage)
})

// Navigation methods
const goToNextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

const goToPrevPage = () => {
  if (hasPrevPage.value) {
    currentPage.value--
  }
}

// Initial fetch
fetchCategoryAndPosts()
</script>

<template>
  <Header />
  
  <main class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <section v-if="loading" class="animate-pulse">
      <!-- Category Header Skeleton -->
      <div class="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
        <div class="h-12 md:h-16 bg-gray-200 rounded mb-4 mx-auto max-w-md"></div>
        <div class="h-6 bg-gray-200 rounded mb-2 mx-auto max-w-lg"></div>
        <div class="h-4 bg-gray-200 rounded mx-auto max-w-xs"></div>
      </div>

      <!-- Posts Grid Skeleton -->
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 9" :key="i" class="bg-white rounded-xl shadow overflow-hidden">
          <div class="h-48 w-full bg-gray-200"></div>
          <div class="p-6">
            <div class="h-6 bg-gray-200 rounded mb-3"></div>
            <div class="space-y-2 mb-4">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-4/5"></div>
              <div class="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
        <p class="text-red-600">{{ error }}</p>
        <NuxtLink to="/blog" class="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Retour aux catégories
        </NuxtLink>
      </div>
    </section>

    <!-- Content -->
    <section v-else>
      <!-- Category Header -->
      <div class="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
        <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-4 md:mb-6">
          {{ stripHtml(category.name) }}
        </h1>
        <p v-if="category.description" class="text-lg md:text-xl text-violet-700 font-serif italic mb-4">
          {{ stripHtml(category.description) }}
        </p>
        <div class="flex items-center justify-center text-violet-600">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <span class="font-medium">{{ category.count }} article{{ category.count > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="mb-8">
        <div class="flex items-center text-sm text-violet-600 space-x-2">
          <NuxtLink to="/" class="hover:text-violet-800 transition-colors">Accueil</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <NuxtLink to="/blog" class="hover:text-violet-800 transition-colors">Catégories</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span class="text-violet-800 font-medium">{{ stripHtml(category.name) }}</span>
        </div>
      </nav>

      <!-- No Posts Message -->
      <div v-if="!posts.length" class="text-center py-12">
        <div class="bg-violet-50 rounded-lg p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-violet-800 mb-2">Aucun article</h3>
          <p class="text-violet-600">Cette catégorie ne contient pas encore d'articles.</p>
        </div>
      </div>

      <!-- Posts Grid -->
      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/post/${post.slug}`"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:scale-105 group"
        >
          <!-- Featured Image -->
          <div class="relative overflow-hidden">
            <img
              v-if="post._embedded?.['wp:featuredmedia']"
              :src="post._embedded['wp:featuredmedia'][0].source_url"
              :alt="stripHtml(post.title.rendered)"
              class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div v-else class="h-48 w-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-violet-900 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>

          <!-- Card Content -->
          <div class="p-6 flex-1 flex flex-col">
            <!-- Title -->
            <h2 class="text-xl font-semibold mb-3 line-clamp-2 text-violet-900 group-hover:text-violet-700 transition-colors">
              {{ stripHtml(post.title.rendered) }}
            </h2>

            <!-- Excerpt -->
            <p class="text-sm text-violet-600 mb-4 line-clamp-3 flex-grow">
              {{ stripHtml(post.excerpt.rendered) }}
            </p>

            <!-- Meta Info -->
            <div class="flex items-center justify-between text-xs text-violet-500 mb-4">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(post.date) }}
              </div>
              <div v-if="post._embedded?.author" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ post._embedded.author[0].name }}
              </div>
            </div>

            <!-- Read More Link -->
            <div class="flex items-center text-violet-600 mt-auto text-sm font-medium group-hover:text-violet-700 transition-colors">
              <span>Lire l'article</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="posts.length === postsPerPage || hasPrevPage" class="flex justify-center items-center space-x-4 mb-8">
        <button
          :disabled="!hasPrevPage"
          @click="goToPrevPage"
          class="inline-flex items-center px-4 py-2 bg-white border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Précédent
        </button>
        
        <div class="flex items-center space-x-2">
          <span class="font-medium text-violet-700 bg-violet-100 px-4 py-2 rounded-lg">
            Page {{ currentPage }}
          </span>
        </div>
        
        <button
          :disabled="!hasNextPage"
          @click="goToNextPage"
          class="inline-flex items-center px-4 py-2 bg-white border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
        >
          Suivant
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Back Navigation -->
      <div class="text-center">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center px-6 py-2 bg-transparent border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-medium rounded-lg transition-all duration-300"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Retour aux catégories
        </NuxtLink>
      </div>
    </section>
  </main>

  <Footer />
</template>

<style>
/* Font styles */
.font-serif {
  font-family: 'Cormorant Garamond', system-ui, -apple-system, sans-serif;
  font-display: swap;
}

.italic {
  font-family: 'Dancing Script', system-ui, -apple-system, sans-serif;
  font-display: swap;
}

@media (min-width: 768px) {
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }
  .italic {
    font-family: 'Dancing Script', cursive;
  }
}

/* Line clamp utilities */
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

/* Loading animation */
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

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}
</style>