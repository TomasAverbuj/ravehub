<script>
import MainH1 from '../components/MainH1.vue';
export default {
    name: "Home",
    components: { MainH1 }
}
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="md:order-last">
                    <img src="https://img.freepik.com/premium-vector/electronic-music-abstract-concept-vector-illustration_107173-29590.jpg?w=740" 
                         alt="Vista previa de la aplicación" 
                         class="w-full">
                </div>
                <div>
                    <MainH1>Todo lo que un Clubber Necesita</MainH1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Descubre las mejores fechas de música electrónica cerca de ti, conéctate con otros amantes de la música y vive experiencias inolvidables en la escena local.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="inline-block bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-md text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300">
                            Explorar Eventos
                        </a>
                        <a href="#" class="inline-block border-2 border-black dark:border-white text-black dark:text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                            Crear Cuenta
                        </a>
                    </div>
                </div>
            </div>

            <div class="mt-16">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Descubre lo mejor de RaveHub</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Eventos Exclusivos</h3>
                            <p class="text-gray-600 dark:text-gray-300">Explora una amplia variedad de eventos de música electrónica, desde festivales hasta clubes locales.</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comunidad Activa</h3>
                            <p class="text-gray-600 dark:text-gray-300">Conéctate con otros amantes de la música electrónica, comparte tus experiencias y descubre nuevas pistas y artistas.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">¡Comenta tu evento favorito!</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Descubre tu evento favorito y conéctate con personas con los mismos gustos.</p>
                    <a href="#" class="text-black dark:text-white font-semibold hover:underline">
                        <router-link to="/events">Elige tu favorito</router-link>
                    </a>
                </div>
                <div class="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Explora eventos destacados</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Descubre los eventos más populares y emocionantes de la escena de la música electrónica cerca de ti.</p>
                    <a href="#" class="text-black dark:text-white font-semibold hover:underline">
                        <router-link to="/events">Ver Eventos Destacados</router-link>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    font-family: 'Manrope', sans-serif;
}
</style>