<template>
  <div>
    <div class="header-container">
      <nav class="nav-wrapper">
        <div class="flex items-center justify-between w-full">
          <div class="logo-container flex items-center space-x-3">
            <img 
              src="/favicon.ico" 
              alt="Logo"
              class="logo-image hover:scale-105 transition-transform"
            />
            <span class="brand-name">Verbena</span>
          </div>
          <ul class="nav-list">
            <li v-for="link in links" :key="link.path">
              <NuxtLink 
                :to="link.path" 
                class="nav-link"
                active-class="active-link"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
const links = [
  { path: '/', label: 'Accueil' },
  { path: '/about', label: 'Á propos' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' }
]
</script>

<style scoped>
.header-container {
  @apply bg-gradient-to-r from-violet-50 to-violet-100;
  @apply shadow-sm;
  @apply border-b border-violet-200;
}

.nav-wrapper {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.logo-container {
  @apply flex-shrink-0;
}

.logo-image {
  @apply h-14 w-auto;
  filter: drop-shadow(0 2px 1px rgba(138, 43, 226, 0.15));
  @apply transition-all duration-200;
}

.brand-name {
  @apply text-2xl font-light italic;
  @apply text-violet-800;
  font-family: 'Dancing Script', cursive, system-ui, -apple-system;
  @apply tracking-tight;
  text-shadow: 1px 1px 2px rgba(138, 43, 226, 0.1);
}

.nav-list {
  @apply flex items-center gap-8;
  @apply ml-auto;
}

.nav-link {
  @apply text-violet-900/90 hover:text-violet-700;
  @apply font-medium tracking-wide;
  @apply transition-colors duration-200;
  @apply px-3 py-2 rounded-md;
  @apply hover:bg-violet-100/50;
  position: relative;
  font-family: 'Cormorant Garamond', serif, system-ui;
}

.nav-link::after {
  @apply content-[''] absolute bottom-0 left-1/2;
  @apply w-0 h-0.5 bg-violet-300;
  @apply transition-all duration-300 ease-out;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  @apply w-full;
}

.active-link {
  @apply text-violet-700 font-semibold;
  @apply bg-violet-50/80;
}
</style>