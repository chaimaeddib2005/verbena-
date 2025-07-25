<template>
  <div>
    <div class="header-container">
      <nav class="nav-wrapper">
        <div class="flex items-center justify-between w-full">
          <NuxtLink to="/" class="logo-container flex items-center space-x-3">
  <img 
    src="/favicon.ico" 
    alt="Logo"
    class="logo-image hover:scale-105 transition-transform"
  />
  <span class="brand-name">Verbena</span>
</NuxtLink>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              @click="toggleMenu"
              class="text-violet-700 hover:text-violet-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
                />
              </svg>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <ul class="hidden md:flex items-center gap-8 ml-auto">
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

        <!-- Mobile Navigation -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <ul 
            v-show="isMenuOpen"
            class="md:hidden mt-4 space-y-2 pb-4"
          >
            <li v-for="link in links" :key="link.path">
              <NuxtLink 
                :to="link.path" 
                class="block px-4 py-3 text-lg text-violet-900 hover:bg-violet-100/50 rounded-md"
                active-class="active-link-mobile"
                @click="isMenuOpen = false"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const links = [
  { path: '/', label: 'Accueil' },
  { path: '/about', label: 'Á propos' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' }
];
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

.active-link-mobile {
  @apply text-violet-700 font-semibold;
  @apply bg-violet-50/80;
}
</style>