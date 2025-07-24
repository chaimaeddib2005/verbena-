<template>
  <footer class="faq-footer p-8 bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800 rounded-t-3xl shadow-lg">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-8 text-violet-900 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline-block mr-2 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        FAQ – Questions Fréquentes
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <details class="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <summary class="cursor-pointer font-medium text-violet-800 hover:text-violet-600 flex items-center">
              <span class="flex-1">{{ faq.question }}</span>
              <svg class="w-5 h-5 ml-2 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 text-gray-700 pl-2 border-l-2 border-violet-200">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const faqs = [
  {
    question: "Quel est le but de ce blog ?",
    answer: "Ce blog a pour objectif de partager des connaissances, des découvertes et des curiosités autour du monde des fleurs, de manière simple et accessible à tous."
  },
  {
    question: "Qui écrit les articles ?",
    answer: "Les articles sont rédigés par des passionnés de la nature et de la botanique. Certains contenus peuvent également être proposés par des lecteurs."
  },
  {
    question: "À quelle fréquence publiez-vous des articles ?",
    answer: "Nous essayons de publier de nouveaux articles régulièrement, en fonction de l’inspiration et des suggestions reçues."
  },
  {
    question: "Puis-je proposer un sujet ou un article ?",
    answer: "Oui ! Vous pouvez nous envoyer vos idées ou propositions via le formulaire de contact. Nous serons ravis de les lire."
  },
  {
    question: "Comment puis-je vous contacter ?",
    answer: "Vous pouvez utiliser le formulaire de contact disponible sur le site pour nous faire part de vos remarques, idées ou questions."
  },
  {
    question: "Pourquoi les fleurs ont-elles une signification particulière ?",
    answer: "Depuis toujours, les fleurs sont chargées de symboles dans différentes cultures. Elles expriment des émotions, des messages ou des traditions."
  },
  {
    question: "Couvrez-vous aussi des fleurs médicinales ou comestibles ?",
    answer: "Oui, certains articles abordent les usages médicinaux ou culinaires de certaines fleurs, toujours à but informatif."
  },
  {
    question: "Puis-je utiliser vos contenus pour un projet scolaire ?",
    answer: "Oui, tant que la source est mentionnée. Le contenu du blog est à disposition pour des usages non commerciaux et éducatifs."
  },
  {
    question: "Répondez-vous aux messages envoyés via le formulaire ?",
    answer: "Nous faisons de notre mieux pour répondre aux messages, surtout ceux contenant des questions ou des suggestions utiles."
  },
  {
    question: "Y a-t-il une newsletter pour rester informé(e) ?",
    answer: "Pas encore, mais nous y pensons ! D’ici là, vous pouvez consulter le blog régulièrement ou nous suivre sur nos canaux."
  }
]
</script>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}

details[open] svg {
  transform: rotate(180deg);
}
</style>