<script>
import Loader from '../components/ui/Loader.vue';
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import Container from '../components/ui/Container.vue';
import Button from '../components/ui/Button.vue';
import { register } from '../services/auth';

export default {
    name: "Register",
    components: { MainH1, MainLabel, MainButton, MainInput, Loader, Container, Button },
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
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <Container class="py-20">
            <div class="max-w-md mx-auto">
                <!-- Logo y título -->
                <div class="text-center mb-12">
                    <div class="flex justify-center mb-8">
                        <div class="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg class="w-10 h-10 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                        </div>
                    </div>
                    <MainH1 class="text-3xl font-black text-black dark:text-white mb-2">
                        Únete a RaveHub
                    </MainH1>
                    <p class="text-gray-600 dark:text-gray-300">
                        Crea tu cuenta y descubre los mejores eventos
                    </p>
                </div>

                <!-- Formulario de registro -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <MainLabel for="nombre">Nombre Completo</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="text"
                                    id="nombre"
                                    v-model="user.nombre"
                                    :readonly="loading"
                                    required
                                    placeholder="Tu nombre completo"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="email">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="email"
                                    v-model="user.email"
                                    :readonly="loading"
                                    required
                                    placeholder="tu@email.com"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="password">Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="password"
                                    v-model="user.password"
                                    :readonly="loading"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Mensaje de error -->
                        <div v-if="errorMsg" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMsg }}</p>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                class="w-full"
                                :disabled="loading"
                            >
                                <Loader v-if="loading" />
                                <span v-else>Crear Cuenta</span>
                            </Button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
                            ¿Ya tienes una cuenta?
                            <router-link to="/login" class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                Inicia sesión
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}
</style>