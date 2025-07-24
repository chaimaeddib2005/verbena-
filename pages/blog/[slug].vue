<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const { slug } = route.params

// Fetch the single post by slug, with embedded media for featured image
const { data: posts, error } = await useFetch(
  'https://www.weblinking.ma/wp-json/wp/v2/posts',
  {
    query: {
      slug,
      _embed: true
    }
  }
)

const post = computed(() => posts?.value?.[0] || null)
</script>

<template>
    <Header />
    <h1 style="text-align: center; font-weight: bolder;font-size: 4vw;">Blog</h1>
  <section class="post-container">
    <div v-if="error" class="error-message">
      Erreur lors du chargement de l'article.
    </div>

    <div v-else-if="!post" class="loading-message">
      Chargement de l'article...
    </div>

    <div v-else class="post-content">
      <!-- Title: bold and large, aligned left -->
      <h1 
        class="post-title"
        v-html="post.title.rendered"
      ></h1>

      <!-- Featured image: full width -->
      <img
        v-if="post._embedded?.['wp:featuredmedia']"
        :src="post._embedded['wp:featuredmedia'][0].source_url"
        alt="featured image"
        class="featured-image"
      />

      <!-- Content: preserve original WP formatting, left aligned -->
      <article
        class="post-article"
        v-html="post.content.rendered"
      ></article>
    </div>
  </section>
  <Footer />
</template>

<style scoped>
/* Container */
.post-container {
  max-width: 56rem; /* ~896px, equivalent to max-w-4xl */
  margin: 0 auto;
  padding: 3rem 1rem; /* py-12 px-4 */
}

/* Error and loading states */
.error-message {
  color: #dc2626; /* red-600 */
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem;
}

.loading-message {
  color: #6b7280; /* gray-500 */
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem;
}

/* Post content */
.post-content {
  /* Container for the post content */
}

/* Post title */
.post-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold - keep bold for main title */
  margin-bottom: 1.5rem; /* mb-6 */
  color: #111827; /* text-gray-900 */
  line-height: 1.2;
}

/* Responsive title sizing */
@media (min-width: 768px) {
  .post-title {
    font-size: 2.25rem; /* md:text-4xl */
  }
}

/* Featured image */
.featured-image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem; /* rounded */
  margin-bottom: 2rem; /* mb-8 */
  display: block;
}

/* Article content - prose styling */
.post-article {
  font-size: 1.125rem; /* prose-lg */
  line-height: 1.7;
  color: #374151; /* gray-700 */
  max-width: none;
  font-weight: 400; /* normal weight for all content */
}

/* Prose-like styling for content */
.post-article :deep(h1),
.post-article :deep(h2),
.post-article :deep(h3),
.post-article :deep(h4),
.post-article :deep(h5),
.post-article :deep(h6) {
  margin-top: 1.5rem; /* prose-headings:mt-6 */
  font-weight: 700; /* bold for headers only */
  color: #111827;
  line-height: 1.3;
}

.post-article :deep(h1) {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.post-article :deep(h2) {
  font-size: 1.5rem;
  margin-bottom: 0.875rem;
}

.post-article :deep(h3) {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.post-article :deep(h4) {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.post-article :deep(p) {
  margin-bottom: 1rem;
  font-weight: 400; /* normal weight for paragraphs */
}

.post-article :deep(ul),
.post-article :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  font-weight: 400; /* normal weight for lists */
}

.post-article :deep(li) {
  margin-bottom: 0.5rem;
  font-weight: 400; /* normal weight for list items */
}

.post-article :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.post-article :deep(img) {
  border-radius: 0.5rem; /* prose-img:rounded */
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.post-article :deep(a) {
  color: #2563eb; /* blue-600 */
  text-decoration: underline;
}

.post-article :deep(a:hover) {
  color: #1d4ed8; /* blue-700 */
}

.post-article :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
}

.post-article :deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.post-article :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.post-article :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.post-article :deep(th),
.post-article :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.post-article :deep(th) {
  background-color: #f9fafb;
  font-weight: 700; /* bold for table headers */
}

.post-article :deep(td) {
  font-weight: 400; /* normal weight for table cells */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .post-container {
    padding: 2rem 1rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-article {
    font-size: 1rem;
  }
}
</style>