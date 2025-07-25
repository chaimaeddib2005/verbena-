<script setup>
import { ref, computed, watch } from 'vue'

const currentPage = ref(1)
const categoriesPerPage = 6
const keyword = ref('')

const allCategories = ref([])
const error = ref(null)
const loading = ref(true)

// Fetch all categories with their posts
const fetchCategoriesWithPosts = async () => {
  try {
    loading.value = true
    
    // First, fetch all categories
    const categoriesResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/categories', {
      params: {
        per_page: 100,
        hide_empty: true // Only get categories that have posts
      }
    })

    // For each category, fetch one post to get an image
    const categoriesWithPosts = await Promise.all(
      categoriesResponse.map(async (category) => {
        try {
          // Fetch the latest post from this category
          const postsResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
            params: {
              categories: category.id,
              per_page: 1,
              _embed: true
            }
          })

          const post = postsResponse[0]
          const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url

          return {
            ...category,
            featuredImage: featuredImage || '/placeholder-category.jpg',
            postCount: category.count,
            latestPost: post
          }
        } catch (err) {
          console.warn(`Error fetching posts for category ${category.slug}:`, err)
          return {
            ...category,
            featuredImage: '/placeholder-category.jpg',
            postCount: category.count,
            latestPost: null
          }
        }
      })
    )

    allCategories.value = categoriesWithPosts.filter(cat => cat.count > 0)
  } catch (err) {
    error.value = 'Erreur lors du chargement des catégories.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

fetchCategoriesWithPosts()

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html.replace(/<[^>]*>?/gm, '')
  return tmp.textContent || tmp.innerText || ''
}

// Filtered categories (keyword only)
const filteredCategories = computed(() => {
  if (!keyword.value) return allCategories.value
  
  return allCategories.value.filter(category => {
    const matchesKeyword = 
      stripHtml(category.name).toLowerCase().includes(keyword.value.toLowerCase()) ||
      (category.description && stripHtml(category.description).toLowerCase().includes(keyword.value.toLowerCase()))
    
    return matchesKeyword
  })
})

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredCategories.value.length / categoriesPerPage)
)

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * categoriesPerPage
  return filteredCategories.value.slice(start, start + categoriesPerPage)
})

// Reset to page 1 if filter changes
watch([keyword], () => {
  currentPage.value = 1
})
</script>

<template>
  <Header />

  <main class="container mx-auto px-4 py-8">
    <!-- Page Header Section -->
    <section class="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-4 md:mb-6">
        Catégories du Blog
      </h1>
      <p class="text-lg md:text-xl text-violet-700 font-serif italic mb-8">
        Découvrez nos articles organisés par thématiques
      </p>

      <!-- Search Section with Purple Background -->
      <div class="bg-purple-100 py-8 px-6 rounded-lg shadow mb-8">
        <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div class="w-full md:w-auto">
            <label for="keyword" class="block text-sm font-medium mb-2 text-violet-900">
              Recherche par catégorie :
            </label>
            <div class="relative">
              <input
                id="keyword"
                type="text"
                v-model="keyword"
                placeholder="Ex: portraits de fleurs, symbolique et langue de fleur..."
                class="border-2 border-violet-200 focus:border-violet-500 px-4 py-3 rounded-lg w-full md:w-80 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <svg class="absolute right-3 top-3.5 w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <div v-if="error" class="text-center py-12 text-red-500 bg-red-50 rounded-lg mb-8">
      <svg class="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      {{ error }}
    </div>

    <!-- Loading Placeholders -->
    <div v-else-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-10">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div class="h-48 w-full bg-gray-200"></div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
          <div class="space-y-2 mb-4">
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>
          <div class="h-4 w-1/3 bg-gray-200 rounded mt-auto"></div>
        </div>
      </div>
    </div>

    <!-- Categories Content -->
    <section v-else>
      <!-- No Results Message -->
      <div v-if="!filteredCategories.length" class="text-center text-violet-600 py-12 bg-violet-50 rounded-lg mb-10">
        <svg class="w-16 h-16 mx-auto mb-4 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold mb-2">Aucune catégorie trouvée</h3>
        <p class="text-violet-500">Essayez avec d'autres mots-clés</p>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-12">
        <NuxtLink
          v-for="category in paginatedCategories"
          :key="category.id"
          :to="`/blog/${category.slug}`"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:scale-105 group"
        >
          <div class="relative overflow-hidden">
            <img
              :src="category.featuredImage"
              :alt="category.name"
              class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
              @error="handleImageError"
              loading="lazy"
            />
            <!-- Category badge -->
            <div class="absolute top-4 right-4 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {{ category.postCount }} article{{ category.postCount > 1 ? 's' : '' }}
            </div>
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-violet-900 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
          
          <div class="p-5 flex-1 flex flex-col">
            <h2 class="text-xl font-semibold mb-3 line-clamp-2 text-violet-900 group-hover:text-violet-700 transition-colors">
              {{ stripHtml(category.name) }}
            </h2>
            
            <p v-if="category.description" class="text-sm text-violet-600 mb-4 line-clamp-3 flex-grow">
              {{ stripHtml(category.description) }}
            </p>
            
            <!-- Latest post preview if available -->
            <div v-if="category.latestPost" class="text-xs text-violet-500 mb-4 p-2 bg-violet-50 rounded">
              <span class="font-medium">Dernier article :</span><br>
              "{{ stripHtml(category.latestPost.title.rendered).substring(0, 60) }}{{ stripHtml(category.latestPost.title.rendered).length > 60 ? '...' : '' }}"
            </div>
            
            <div class="flex items-center text-violet-600 mt-auto text-sm font-medium group-hover:text-violet-700 transition-colors">
              <span>Voir les articles</span>
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-12">
        <button
          :disabled="currentPage <= 1"
          @click="currentPage--"
          class="inline-flex items-center px-4 py-2 bg-white border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Précédent
        </button>
        
        <div class="flex items-center space-x-2">
          <span class="font-medium text-violet-700 bg-violet-100 px-4 py-2 rounded-lg">
            Page {{ currentPage }} sur {{ totalPages }}
          </span>
        </div>
        
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="inline-flex items-center px-4 py-2 bg-white border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
        >
          Suivant
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Back to Homepage Button -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Retour à l'accueil
        </NuxtLink>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script>
export default {
  methods: {
    handleImageError(event) {
      // Fallback to placeholder image if category image fails to load
      event.target.src = '/placeholder-category.jpg'
    }
  }
}
</script>

<style>
/* Font styles matching the homepage */
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

/* Smooth transitions for interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
</style>