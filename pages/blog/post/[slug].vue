<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const { slug } = route.params

// Reactive data
const post = ref(null)
const relatedPosts = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch single post and related posts
const fetchPost = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch the post by slug
    const postsResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
      query: {
        slug: slug,
        _embed: true
      }
    })

    if (!postsResponse || postsResponse.length === 0) {
      throw new Error('Article non trouvé')
    }

    post.value = postsResponse[0]

    // Fetch related posts from the same categories
    if (post.value.categories && post.value.categories.length > 0) {
      const relatedResponse = await $fetch('https://verveina.weblinking.fr/wp-json/wp/v2/posts', {
        query: {
          categories: post.value.categories.join(','),
          exclude: post.value.id,
          per_page: 3,
          _embed: true
        }
      })
      relatedPosts.value = relatedResponse
    }

  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = err.message || 'Erreur lors du chargement de l\'article'
  } finally {
    loading.value = false
  }
}

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

const estimateReadingTime = (content) => {
  const wordsPerMinute = 200
  const words = stripHtml(content).split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Computed properties
const postCategories = computed(() => {
  return post.value?._embedded?.['wp:term']?.[0] || []
})

const postAuthor = computed(() => {
  return post.value?._embedded?.author?.[0]
})

const featuredImage = computed(() => {
  return post.value?._embedded?.['wp:featuredmedia']?.[0]
})

// SEO Meta
useHead(() => ({
  title: post.value ? stripHtml(post.value.title.rendered) : 'Article',
  meta: [
    {
      name: 'description',
      content: post.value ? stripHtml(post.value.excerpt.rendered) : ''
    },
    {
      property: 'og:title',
      content: post.value ? stripHtml(post.value.title.rendered) : ''
    },
    {
      property: 'og:description',
      content: post.value ? stripHtml(post.value.excerpt.rendered) : ''
    },
    {
      property: 'og:image',
      content: featuredImage.value?.source_url || ''
    }
  ]
}))

// Initialize
onMounted(() => {
  fetchPost()
})
</script>

<template>
  <Header />
  
  <main class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <section v-if="loading" class="animate-pulse max-w-4xl mx-auto">
      <!-- Breadcrumb Skeleton -->
      <div class="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
      
      <!-- Title Skeleton -->
      <div class="h-12 bg-gray-200 rounded mb-6"></div>
      
      <!-- Meta Skeleton -->
      <div class="flex items-center space-x-4 mb-8">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
        <div class="h-4 bg-gray-200 rounded w-20"></div>
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      
      <!-- Image Skeleton -->
      <div class="h-64 md:h-96 bg-gray-200 rounded-xl mb-8"></div>
      
      <!-- Content Skeleton -->
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/5"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="text-center py-12 max-w-md mx-auto">
      <div class="bg-red-50 rounded-lg p-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Article non trouvé</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <NuxtLink to="/blog" class="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Retour au blog
        </NuxtLink>
      </div>
    </section>

    <!-- Article Content -->
    <article v-else class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <div class="flex items-center text-sm text-violet-600 space-x-2">
          <NuxtLink to="/" class="hover:text-violet-800 transition-colors">Accueil</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <NuxtLink to="/blog" class="hover:text-violet-800 transition-colors">Blog</NuxtLink>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span class="text-violet-800 font-medium">{{ stripHtml(post.title.rendered) }}</span>
        </div>
      </nav>

      <!-- Article Header -->
      <header class="mb-8">
        <!-- Title -->
        <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-6 leading-tight">
          {{ stripHtml(post.title.rendered) }}
        </h1>

        <!-- Meta Information -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-violet-600 mb-6">
          <!-- Date -->
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(post.date) }}
          </div>

          <!-- Author -->
          <div v-if="postAuthor" class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            {{ postAuthor.name }}
          </div>

          <!-- Reading Time -->
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ estimateReadingTime(post.content.rendered) }} min de lecture
          </div>
        </div>

        <!-- Categories -->
        <div v-if="postCategories.length" class="flex flex-wrap gap-2 mb-8">
          <NuxtLink
            v-for="category in postCategories"
            :key="category.id"
            :to="`/blog/${category.slug}`"
            class="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium hover:bg-violet-200 transition-colors"
          >
            {{ stripHtml(category.name) }}
          </NuxtLink>
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none mb-12" v-html="post.content.rendered"></div>

      <!-- Article Footer -->
      <footer class="border-t border-violet-100 pt-8">
        <!-- Share Buttons -->
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-lg font-semibold text-violet-900">Partager cet article</h3>
          <div class="flex space-x-3">
            <button @click="shareOnFacebook" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button @click="shareOnTwitter" class="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button @click="copyLink" class="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </article>

    <!-- Related Posts -->
    <section v-if="relatedPosts.length" class="max-w-6xl mx-auto mt-16">
      <h2 class="text-2xl md:text-3xl font-light text-violet-900 mb-8 text-center">
        Articles similaires
      </h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="relatedPost in relatedPosts"
          :key="relatedPost.id"
          :to="`/blog/post/${relatedPost.slug}`"
          class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:scale-105 group"
        >
          <div class="relative overflow-hidden">
            <img
              v-if="relatedPost._embedded?.['wp:featuredmedia']"
              :src="relatedPost._embedded['wp:featuredmedia'][0].source_url"
              :alt="stripHtml(relatedPost.title.rendered)"
              class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div v-else class="h-48 w-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-violet-900 group-hover:text-violet-700 transition-colors">
              {{ stripHtml(relatedPost.title.rendered) }}
            </h3>
            <p class="text-sm text-violet-600 mb-4 line-clamp-2 flex-grow">
              {{ stripHtml(relatedPost.excerpt.rendered) }}
            </p>
            <div class="text-xs text-violet-500">
              {{ formatDate(relatedPost.date) }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Back Navigation -->
    <div class="text-center mt-12">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center px-6 py-2 bg-transparent border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-medium rounded-lg transition-all duration-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Retour au blog
      </NuxtLink>
    </div>
  </main>

  <Footer />
</template>

<script>
export default {
  methods: {
    shareOnFacebook() {
      const url = encodeURIComponent(window.location.href)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    },
    shareOnTwitter() {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(this.stripHtml(this.post?.title?.rendered || ''))
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
        alert('Lien copié!')
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    },
    stripHtml(html) {
      if (!html) return ''
      const tmp = document.createElement('div')
      tmp.innerHTML = html.replace(/<[^>]*>?/gm, '')
      return tmp.textContent || tmp.innerText || ''
    }
  }
}
</script>

<style>
/* Font styles */
.font-serif {
  font-family: 'Cormorant Garamond', system-ui, -apple-system, sans-serif;
  font-display: swap;
}

@media (min-width: 768px) {
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }
}

/* Enhanced prose styling for article content */
.prose {
  color: #374151;
  max-width: none;
  font-size: 1.125rem;
  line-height: 1.7;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: #581c87;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.prose :deep(h1) { font-size: 2rem; }
.prose :deep(h2) { font-size: 1.5rem; }
.prose :deep(h3) { font-size: 1.25rem; }
.prose :deep(h4) { font-size: 1.125rem; }

.prose :deep(p) {
  margin-bottom: 1.25rem;
  font-weight: 400;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(blockquote) {
  border-left: 4px solid #8b5cf6;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
}

.prose :deep(img) {
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.prose :deep(a) {
  color: #8b5cf6;
  text-decoration: underline;
  font-weight: 500;
}

.prose :deep(a:hover) {
  color: #7c3aed;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  color: #be185d;
}

.prose :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.prose :deep(th),
.prose :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.prose :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
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
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>