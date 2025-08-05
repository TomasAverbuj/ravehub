<script>
export default {
  name: 'FeaturesSection'
}
</script>

<template>
  <div class="w-full py-24 bg-white dark:bg-neutral-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Todo lo que necesitas para
          <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            vivir la música
          </span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Una plataforma completa diseñada para conectar amantes de la música electrónica
        </p>
      </div>

      <!-- Grid de características -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Característica 1: Eventos -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 h-full border border-purple-100 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Eventos Exclusivos</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Descubre los mejores eventos de música electrónica con información detallada, ubicaciones y precios.
            </p>
          </div>
        </div>

        <!-- Característica 2: Chat en tiempo real -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 h-full border border-green-100 dark:border-green-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chat en Tiempo Real</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Conecta con otros fans, comparte experiencias y mantén conversaciones privadas con la comunidad.
            </p>
          </div>
        </div>

        <!-- Característica 3: Gestión de entradas -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 h-full border border-orange-100 dark:border-orange-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gestión de Entradas</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Compra, gestiona y almacena todas tus entradas en un solo lugar con acceso rápido.
            </p>
          </div>
        </div>

        <!-- Característica 4: Suscripción Premium -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-8 h-full border border-yellow-100 dark:border-yellow-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Suscripción Premium</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Acceso anticipado a eventos, descuentos exclusivos y funcionalidades avanzadas.
            </p>
          </div>
        </div>

        <!-- Característica 5: Perfiles personalizados -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 h-full border border-indigo-100 dark:border-indigo-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Perfiles Personalizados</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Crea tu perfil único, comparte tus gustos musicales y conecta con personas afines.
            </p>
          </div>
        </div>

        <!-- Característica 6: Notificaciones inteligentes -->
        <div class="group relative">
          <div class="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-8 h-full border border-pink-100 dark:border-pink-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notificaciones Inteligentes</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              Recibe alertas personalizadas sobre nuevos eventos y actualizaciones importantes.
            </p>
          </div>
        </div>
      </div>

                    <!-- CTA Section -->
       <div class="mt-20 text-center">
         <div class="bg-gray-50 dark:bg-neutral-900 rounded-3xl p-12">
           <h3 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
             ¿Listo para vivir la experiencia?
           </h3>
           <p class="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
             Únete a miles de amantes de la música electrónica y descubre tu próxima aventura musical
           </p>
           <div class="flex flex-col sm:flex-row gap-4 justify-center">
             <router-link 
               to="/registro" 
               class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
             >
               Crear cuenta gratis
             </router-link>
             <router-link 
               to="/eventos" 
               class="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
             >
               Explorar eventos
             </router-link>
           </div>
         </div>
       </div>
    </div>
  </div>
</template> 