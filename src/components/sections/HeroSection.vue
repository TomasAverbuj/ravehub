<script>
import MainH1 from '../MainH1.vue';
import Button from '../ui/Button.vue';
import Container from '../ui/Container.vue';

export default {
  name: 'HeroSection',
  components: { MainH1, Button, Container }
}
</script>

<template>
  <div class="relative w-full min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
    <Container class="py-20">
      <!-- Contenido principal centrado -->
      <div class="text-center max-w-4xl mx-auto">
        <!-- Logo y título principal -->
        <div class="mb-12">
          <div class="flex justify-center mb-8">
            <div class="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-12 h-12 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </div>
          <MainH1 class="text-5xl md:text-7xl font-black text-black dark:text-white mb-6 tracking-tight">
            RaveHub
          </MainH1>
          <h2 class="text-2xl md:text-3xl font-medium text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Tu plataforma para descubrir los mejores eventos de música electrónica
          </h2>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <router-link to="/eventos">
            <Button variant="primary" size="lg">
              Explorar Eventos
            </Button>
          </router-link>
          <router-link to="/registro">
            <Button variant="outline" size="lg">
              Crear Cuenta
            </Button>
          </router-link>
        </div>

        <!-- Características principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-black dark:text-white mb-2">Eventos Exclusivos</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Descubre los mejores eventos de música electrónica cerca de ti</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-black dark:text-white mb-2">Comunidad Activa</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Conéctate con otros amantes de la música electrónica</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-black dark:text-white mb-2">Chat en Tiempo Real</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Comparte experiencias y descubre nueva música</p>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template> 