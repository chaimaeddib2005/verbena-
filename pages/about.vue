<template>
  <div>
    <Header />
    <section class="container mx-auto px-4 py-8">
      <!-- Fixed height container to prevent layout shift -->
      <div class="min-h-[600px]">
        <!-- Blog Content with skeleton loading -->
        <div class="space-y-10">
          <!-- Blog Title Section -->
          <div class="text-center py-10 px-6">
            <div v-if="loading" class="animate-pulse">
              <div class="h-12 bg-gray-200 rounded mx-auto mb-4 w-3/4"></div>
              <div class="mx-auto max-w-xs aspect-square bg-gray-100 rounded-lg"></div>
            </div>
            
            <div v-else-if="error" class="text-red-500">
              {{ error }}
            </div>
            
            <div v-else>
              <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-4">
                {{ content.nom_blog }}
              </h1>
              
              <!-- Reserved space for image -->
              <div class="mx-auto max-w-xs aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  v-if="content.blog_image"
                  :src="content.blog_image"
                  :alt="content.nom_blog + ' image'"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <!-- Articles Section -->
          <div class="space-y-6 max-w-3xl mx-auto">
            <!-- Skeleton loading -->
            <template v-if="loading">
              <div v-for="n in 3" :key="n" class="bg-gray-100 p-6 rounded-xl animate-pulse">
                <div class="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </template>
            
            <!-- Actual content -->
            <article
              v-else
              v-for="(item, index) in pairedContent"
              :key="'article-'+index"
              class="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-300"
            >
              <h2 class="text-2xl font-semibold mb-3 text-violet-900">{{ item.titre }}</h2>
              <p class="text-lg leading-relaxed text-violet-800">
                {{ item.paragraph }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: null,
      loading: true,
      error: null,
      pairedContent: [] // Stores paired titles and paragraphs
    };
  },
  async mounted() {
    try {
      const page = await this.$pageCache.getPage(59);
      if (!page?.acf) {
        this.error = 'Contenu introuvable. Veuillez actualiser la page.';
        return;
      }

      this.content = page.acf;

      // Pair titles and paragraphs correctly
      this.pairedContent = this.pairTitlesAndParagraphs();
      
    } catch (e) {
      console.error(e);
      this.error = 'Erreur lors du chargement du contenu.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    pairTitlesAndParagraphs() {
      const result = [];
      const contentKeys = Object.keys(this.content);
      
      // Get all titre keys and sort them numerically
      const titreKeys = contentKeys
        .filter(k => k.startsWith('titre'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('titre', ''));
          const numB = parseInt(b.replace('titre', ''));
          return numA - numB;
        });

      // Pair each titre with its corresponding paragraph
      titreKeys.forEach(titreKey => {
        const num = titreKey.replace('titre', '');
        const paraKey = `para${num}`;
        
        if (this.content[paraKey]) {
          result.push({
            titre: this.content[titreKey],
            paragraph: this.content[paraKey]
          });
        }
      });

      return result;
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.4s ease-out forwards;
}

@keyframes fade-in {
  to { opacity: 1; }
}

/* Prevent image compression */
img {
  object-fit: contain;
  max-height: 400px;
}

/* Ensure last paragraph is visible */
article:last-child {
  margin-bottom: 0;
}
</style>