<script>
import Loader from '../components/ui/Loader.vue';
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import Container from '../components/ui/Container.vue';
import { register } from '../services/auth';

export default {
    name: "Register",
    components: { MainH1, MainLabel, MainButton, MainInput, Loader, Container },
    data() {
        return {
            user: {
                email: '',
                password: '',
                nombre: '',
            },
            loading: false,
            errorMsg: '',
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            this.errorMsg = '';

            // Validación simple
            if (!this.user.email || !this.user.password || !this.user.nombre) {
                this.errorMsg = 'Todos los campos son obligatorios.';
                this.loading = false;
                return;
            }

            try {
                console.log('Datos enviados al registro:', this.user);
                await register(this.user.email, this.user.password, this.user.nombre);
                this.$router.push({ path: '/perfil' });
            } catch (error) {
                console.error(error);
                this.errorMsg = error?.message || 'Error al registrar usuario.';
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <div class="relative w-full min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <Container class="py-20">
            <div class="text-center max-w-md mx-auto">
                <!-- Logo y título principal -->
                <div class="mb-12">
                    <div class="flex justify-center mb-8">
                        <div class="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg class="w-12 h-12 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                        </div>
                    </div>
                    <MainH1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-6 tracking-tight">
                        Crear Cuenta
                    </MainH1>
                    <h2 class="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Únete a la comunidad de RaveHub
                    </h2>
                </div>

                <!-- Formulario de Registro -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <MainLabel for="email" class="text-black dark:text-white">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="email"
                                    v-model="user.email"
                                    :readonly="loading"
                                    required
                                    placeholder="tu@email.com"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="nombre" class="text-black dark:text-white">Nombre</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="text"
                                    id="nombre"
                                    v-model="user.nombre"
                                    :readonly="loading"
                                    required
                                    placeholder="Tu nombre completo"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="password" class="text-black dark:text-white">Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="password"
                                    v-model="user.password"
                                    :readonly="loading"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <MainButton
                                type="submit"
                                :disabled="loading"
                                class="w-full justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-semibold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Loader v-if="loading" />
                                <template v-else>Crear Cuenta</template>
                            </MainButton>
                        </div>
                    </form>

                    <div v-if="errorMsg" class="mt-4 p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                        {{ errorMsg }}
                    </div>

                    <p class="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                        ¿Ya tienes una cuenta?
                        <router-link to="/login" class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            Inicia sesión
                        </router-link>
                    </p>
                </div>
            </div>
        </Container>
    </div>
</template>