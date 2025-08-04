<script>
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import Container from '../components/ui/Container.vue';
import { login, changePassword } from '../services/auth';

export default {
    name: "Login",
    components: { MainH1, MainLabel, MainInput, MainButton, Container },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
            showForgotPassword: false,
            forgotPasswordData: {
                email: '',
                newPassword: '',
                confirmPassword: '',
            },
            forgotPasswordLoading: false,
            message: '',
            messageType: '', // 'success' o 'error'
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            try {
                await login(this.user.email, this.user.password);
                // Si el login es exitoso, lo mandamos a la página Home.
                this.$router.push({ path: '/' });
            } catch (error) {
                // Manejo de errores, si es necesario
                console.error(error);
            }

            this.loading = false;
        },
        
        toggleForgotPassword() {
            this.showForgotPassword = !this.showForgotPassword;
            this.message = '';
            this.messageType = '';
        },
        
        async handleForgotPassword() {
            this.forgotPasswordLoading = true;
            this.message = '';
            this.messageType = '';

            // Validaciones
            if (!this.forgotPasswordData.email || !this.forgotPasswordData.newPassword || !this.forgotPasswordData.confirmPassword) {
                this.message = 'Por favor completa todos los campos.';
                this.messageType = 'error';
                this.forgotPasswordLoading = false;
                return;
            }

            if (this.forgotPasswordData.newPassword !== this.forgotPasswordData.confirmPassword) {
                this.message = 'Las contraseñas no coinciden.';
                this.messageType = 'error';
                this.forgotPasswordLoading = false;
                return;
            }

            if (this.forgotPasswordData.newPassword.length < 6) {
                this.message = 'La contraseña debe tener al menos 6 caracteres.';
                this.messageType = 'error';
                this.forgotPasswordLoading = false;
                return;
            }

            try {
                // Simulamos el cambio de contraseña
                this.message = 'Contraseña cambiada exitosamente.';
                this.messageType = 'success';
                this.forgotPasswordData = {
                    email: '',
                    newPassword: '',
                    confirmPassword: '',
                };
                
                // Ocultar el formulario después de 2 segundos
                setTimeout(() => {
                    this.showForgotPassword = false;
                    this.message = '';
                }, 2000);
            } catch (error) {
                console.error('Error al cambiar contraseña:', error);
                this.message = 'Error al cambiar la contraseña. Verifica que el email esté registrado.';
                this.messageType = 'error';
            }

            this.forgotPasswordLoading = false;
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
                        {{ showForgotPassword ? 'Cambiar Contraseña' : 'Iniciar Sesión' }}
                    </MainH1>
                    <h2 class="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {{ showForgotPassword ? 'Ingresa tu email y nueva contraseña' : 'Accede a tu cuenta de RaveHub' }}
                    </h2>
                </div>

                <!-- Formulario de Login -->
                <div v-if="!showForgotPassword" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <div class="flex items-center justify-between">
                                <MainLabel for="email" class="text-black dark:text-white">Email</MainLabel>
                            </div>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="email"
                                    v-model="user.email"
                                    required
                                    placeholder="tu@email.com"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <MainLabel for="password" class="text-black dark:text-white">Contraseña</MainLabel>
                                <div class="text-sm">
                                    <button 
                                        type="button" 
                                        @click="toggleForgotPassword"
                                        class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="password"
                                    v-model="user.password"
                                    required
                                    placeholder="Tu contraseña"
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
                                <span v-if="loading">Iniciando...</span>
                                <span v-else>Iniciar Sesión</span>
                            </MainButton>
                        </div>
                    </form>

                    <!-- Mensaje de éxito o error para el login -->
                    <div v-if="message" :class="[
                        'mt-4 p-3 rounded-lg text-sm',
                        messageType === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' : '',
                        messageType === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800' : ''
                    ]">
                        {{ message }}
                    </div>

                    <p class="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                        ¿No eres miembro?
                        <router-link to="/registro" class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            ¡Regístrate!
                        </router-link>
                    </p>
                </div>

                <!-- Formulario de Cambio de Contraseña -->
                <div v-if="showForgotPassword" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleForgotPassword">
                        <div>
                            <MainLabel for="forgot-email" class="text-black dark:text-white">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="forgot-email"
                                    v-model="forgotPasswordData.email"
                                    required
                                    placeholder="tu@email.com"
                                    class="block w-full rounded-lg border-0 py-3 px-4  text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="new-password" class="text-black dark:text-white">Nueva Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="new-password"
                                    v-model="forgotPasswordData.newPassword"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="confirm-password" class="text-black dark:text-white">Confirmar Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="confirm-password"
                                    v-model="forgotPasswordData.confirmPassword"
                                    required
                                    placeholder="Repite tu nueva contraseña"
                                    class="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <!-- Mensaje de éxito o error -->
                        <div v-if="message" :class="[
                            'p-3 rounded-lg text-sm',
                            messageType === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' : '',
                            messageType === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800' : ''
                        ]">
                            {{ message }}
                        </div>

                        <div>
                            <MainButton
                                type="submit"
                                :disabled="forgotPasswordLoading"
                                class="w-full justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-semibold shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="forgotPasswordLoading">Cambiando...</span>
                                <span v-else>Cambiar Contraseña</span>
                            </MainButton>
                        </div>
                    </form>

                    <p class="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <button 
                            @click="toggleForgotPassword"
                            class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            ← Volver al Login
                        </button>
                    </p>
                </div>
            </div>
        </Container>
    </div>
</template>

