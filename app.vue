<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (title) => title ? `${title} | Verbena` : 'Verbena - tous ce que vous devez savoir sur les fleurs',
  
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    }
  ]
})
</script>

