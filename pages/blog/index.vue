<script setup>
import { ref, computed, watch } from 'vue'

const currentPage = ref(1)
const postsPerPage = 6
const keyword = ref('')
const selectedDate = ref('')

const allPosts = ref([])
const error = ref(null)

// Fetch all posts once
const fetchAllPosts = async () => {
  try {
    const response = await $fetch('https://web.weblinking.fr/wp-json/wp/v2/posts', {
      params: {
        per_page: 100,
        _embed: true
      }
    })
    allPosts.value = response
  } catch (err) {
    error.value = 'Erreur lors du chargement des articles.'
    console.error(err)
  }
}

fetchAllPosts()

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html.replace(/<[^>]*>?/gm, '')
  return tmp.textContent || tmp.innerText || ''
}

// Extract available month-year values
const availableDates = computed(() => {
  const unique = new Set()
  allPosts.value.forEach(post => {
    const date = new Date(post.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    unique.add(key)
  })
  return Array.from(unique).sort().reverse()
})

// Filtered posts (date + keyword)
const filteredPosts = computed(() => {
  return allPosts.value.filter(post => {
    const matchesKeyword =
      post.title.rendered.toLowerCase().includes(keyword.value.toLowerCase()) ||
      post.excerpt.rendered.toLowerCase().includes(keyword.value.toLowerCase())

    const matchesDate = selectedDate.value
      ? post.date.startsWith(selectedDate.value)
      : true

    return matchesKeyword && matchesDate
  })
})

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / postsPerPage)
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return filteredPosts.value.slice(start, start + postsPerPage)
})

// Reset to page 1 if filter changes
watch([selectedDate, keyword], () => {
  currentPage.value = 1
})
</script>

<template>
  <Header />

  <section class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-6 text-center">Notre Blog</h1>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
      <!-- Date filter -->
      <div>
        <label for="date-filter" class="block text-sm font-medium mb-1">Filtrer par date :</label>
        <select v-model="selectedDate" id="date-filter" class="border px-3 py-2 rounded w-48">
          <option value="">Toutes les dates</option>
          <option v-for="date in availableDates" :key="date" :value="date">
            {{ new Date(date + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }}
          </option>
        </select>
      </div>

      <!-- Keyword filter -->
      <div>
        <label for="keyword" class="block text-sm font-medium mb-1">Recherche par mot-clé :</label>
        <input
          id="keyword"
          type="text"
          v-model="keyword"
          placeholder="Ex: sécurité, SEO, design..."
          class="border px-3 py-2 rounded w-64"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-600 text-center">{{ error }}</div>

    <!-- Loading Placeholders -->
    <div v-else-if="!allPosts.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-10">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow overflow-hidden flex flex-col">
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

    <!-- Posts -->
    <div v-else>
      <div v-if="!filteredPosts.length" class="text-center text-gray-600 mb-10">
        Aucun article trouvé pour ces critères.
      </div>

      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <NuxtLink
          v-for="post in paginatedPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
        >
          <img
            v-if="post._embedded?.['wp:featuredmedia']"
            :src="post._embedded['wp:featuredmedia'][0].source_url"
            alt="image"
            class="h-48 w-full object-cover"
          />
          <div class="p-5 flex-1 flex flex-col">
            <h2 class="text-xl font-semibold mb-2 line-clamp-2" v-html="post.title.rendered"></h2>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">
              {{ stripHtml(post.excerpt.rendered) }}
            </p>
            <span class="text-blue-600 mt-auto text-sm font-medium hover:underline">
              Lire l'article →
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center space-x-4">
        <button
          :disabled="currentPage <= 1"
          @click="currentPage--"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Précédent
        </button>
        <span class="font-medium text-gray-700">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  </section>

  <Footer />
</template>

<style scoped>
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
</style>