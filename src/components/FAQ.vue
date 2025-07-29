<script>
export default {
  name: 'FAQ',
  data() {
    return {
      activeIndex: null,
      faqs: [
        {
          question: "¿Qué es RaveHub?",
          answer: "RaveHub es una plataforma diseñada para conectar a los amantes de la música electrónica. Aquí puedes descubrir eventos, conectar con otros clubbers y compartir tus experiencias en la escena local."
        },
        {
          question: "¿Cómo puedo encontrar eventos cerca de mí?",
          answer: "Simplemente navega a la sección 'Eventos' donde encontrarás una lista completa de eventos de música electrónica. Puedes filtrar por ubicación, fecha y género musical."
        },
        {
          question: "¿Es gratis usar RaveHub?",
          answer: "Sí, RaveHub es completamente gratuito. Puedes registrarte, explorar eventos, participar en el chat público y conectar con otros usuarios sin costo alguno."
        },
        {
          question: "¿Cómo puedo crear una cuenta?",
          answer: "Haz clic en 'Registrarse' en la barra de navegación. Solo necesitas un email y contraseña para comenzar a usar todas las funciones de la plataforma."
        },
        {
          question: "¿Puedo comentar en los eventos?",
          answer: "¡Absolutamente! Una vez que te registres, podrás comentar en cualquier evento, compartir tus experiencias y conectar con otros asistentes."
        },
        {
          question: "¿Cómo funciona el chat público?",
          answer: "El chat público te permite conversar en tiempo real con otros usuarios de RaveHub. Es un espacio para compartir música, experiencias y conectar con la comunidad."
        },
        {
          question: "¿Puedo subir fotos de eventos?",
          answer: "Actualmente estamos trabajando en esta función. Pronto podrás subir y compartir fotos de los eventos que asistas."
        },
        {
          question: "¿Cómo reporto un problema?",
          answer: "Si encuentras algún problema o tienes sugerencias, puedes contactarnos a través de los enlaces en el footer o enviarnos un email directamente."
        }
      ]
    }
  },
  methods: {
    toggleFAQ(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }
}
</script>

<template>
  <div class="w-full py-20 bg-white dark:bg-neutral-950">
    <div class="w-full max-w-4xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
          Preguntas frecuentes
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Resolvemos las dudas más comunes sobre RaveHub
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="rounded-lg overflow-hidden"
        >
          <!-- Question -->
          <button 
            @click="toggleFAQ(index)"
            class="w-full px-8 py-6 text-left bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200 flex items-center justify-between"
          >
            <h3 class="text-lg font-semibold text-black dark:text-white pr-4">
              {{ faq.question }}
            </h3>
            <svg 
              class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0"
              :class="{ 'rotate-180': activeIndex === index }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Answer -->
          <div 
            v-show="activeIndex === index"
            class="px-8 pb-6 bg-gray-50 dark:bg-neutral-800"
          >
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed pt-4">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="text-center mt-12">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          ¿No encontraste lo que buscabas?
        </p>
        <a 
          href="mailto:nico.siciliano@hotmail.com" 
          class="inline-flex items-center text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Contáctanos
          <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-transform {
  transition: transform 0.2s ease-in-out;
}
</style> 