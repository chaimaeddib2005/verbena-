<template>
    <Header />
  <section class="container mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-6 text-center text-violet-600">
      <p>Chargement du contenu…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Blog Content -->
    <div v-else class="space-y-10">
      <!-- Blog Title -->
      <div class="text-center  py-10 px-6 ">
        <h1 class="text-3xl md:text-5xl font-light text-violet-900 mb-4 animate-fade-in">
          {{ content.nom_blog }}
        </h1>

        <img
          v-if="content.blog_image"
          :src="content.blog_image"
          alt="Blog image"
          class="mx-auto max-w-xs w-full h-auto   transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      <!-- Titre + Paragraphes -->
      <div class="space-y-12 max-w-3xl mx-auto text-violet-800">
        <div
          v-for="(titre, index) in titres"
          :key="index"
          class="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300"
        >
          <h2 class="text-2xl font-semibold mb-3 text-violet-900">{{ titre }}</h2>
          <p class="text-lg leading-relaxed">
            {{ paragraphes[index] }}
          </p>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
export default {
  data() {
    return {
      content: null,
      loading: true,
      error: null,
      titres: [],
      paragraphes: []
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

      // Extract titres
      const titreKeys = Object.keys(this.content)
        .filter(k => k.startsWith('titre'))
        .sort();
      this.titres = titreKeys.map(k => this.content[k]);

      // Extract paragraphes
      const paraKeys = Object.keys(this.content)
        .filter(k => k.startsWith('para'))
        .sort();
      this.paragraphes = paraKeys.map(k => this.content[k]);

    } catch (e) {
      console.error(e);
      this.error = 'Erreur lors du chargement du contenu.';
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
