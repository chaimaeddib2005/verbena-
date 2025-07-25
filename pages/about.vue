<template>
  <div>
    <Header />
    <section class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12 text-violet-600">
        <p>Chargement du contenu…</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12 text-red-500">
        {{ error }}
      </div>

      <!-- Blog Content -->
      <div v-else class="space-y-10">
        <!-- Blog Title -->
        <div class="text-center py-10 px-6">
          <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-4 animate-fade-in">
            {{ content.nom_blog }}
          </h1>

          <!-- Image with quality preservation -->
          <img
            v-if="content.blog_image"
            :src="content.blog_image"
            :alt="content.nom_blog + ' image'"
            class="mx-auto max-w-xs w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        <!-- Titre + Paragraphes - Fixed alignment -->
        <div class="space-y-6 max-w-3xl mx-auto text-violet-800">
          <article
            v-for="(item, index) in pairedContent"
            :key="'article-'+index"
            class="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300"
          >
            <h2 class="text-2xl font-semibold mb-3 text-violet-900">{{ item.titre }}</h2>
            <p class="text-lg leading-relaxed">
              {{ item.paragraph }}
            </p>
          </article>
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