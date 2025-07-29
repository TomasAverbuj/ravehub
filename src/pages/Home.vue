<script>
import HeroSection from '../components/sections/HeroSection.vue';
import HighlightsSection from '../components/sections/HighlightsSection.vue';
import FAQ from '../components/FAQ.vue';
import Footer from '../components/layout/Footer.vue';

export default {
  name: 'Home',
  components: { HeroSection, HighlightsSection, FAQ, Footer }
}
</script>

<template>
  <div class="w-full bg-white dark:bg-neutral-950">
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Highlights Section -->
    <HighlightsSection />
    
    <!-- FAQ Section -->
    <FAQ />
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>