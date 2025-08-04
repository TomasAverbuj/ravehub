<script>
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import Container from '../components/ui/Container.vue';
import Button from '../components/ui/Button.vue';
import { login, changePassword } from '../services/auth';

export default {
    name: "Login",
    components: { MainH1, MainLabel, MainInput, MainButton, Container, Button },
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
            this.message = '';
            this.messageType = '';

            try {
                await login(this.user.email, this.user.password);
                this.$router.push({ path: '/' });
            } catch (error) {
                console.error(error);
                this.message = 'Credenciales incorrectas. Intenta nuevamente.';
                this.messageType = 'error';
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
                        {{ showForgotPassword ? 'Cambiar Contraseña' : 'Bienvenido de Vuelta' }}
                    </MainH1>
                    <p class="text-gray-600 dark:text-gray-300">
                        {{ showForgotPassword ? 'Ingresa tu email y nueva contraseña' : 'Ingresa tus credenciales para continuar' }}
                    </p>
                </div>

                <!-- Formulario de Login -->
                <div v-if="!showForgotPassword" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <MainLabel for="email">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="email"
                                    v-model="user.email"
                                    required
                                    placeholder="tu@email.com"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <MainLabel for="password">Contraseña</MainLabel>
                                <button 
                                    type="button" 
                                    @click="toggleForgotPassword"
                                    class="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="password"
                                    v-model="user.password"
                                    required
                                    placeholder="Tu contraseña"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Mensaje de error -->
                        <div v-if="message && messageType === 'error'" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p class="text-sm text-red-800 dark:text-red-200">{{ message }}</p>
                        </div>

                        <div>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="lg" 
                                class="w-full"
                                :disabled="loading"
                            >
                                <span v-if="loading">Ingresando...</span>
                                <span v-else>Ingresar</span>
                            </Button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
                            ¿No tienes una cuenta?
                            <router-link to="/registro" class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                Crear cuenta
                            </router-link>
                        </p>
                    </div>
                </div>

                <!-- Formulario de Cambio de Contraseña -->
                <div v-if="showForgotPassword" class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleForgotPassword">
                        <div>
                            <MainLabel for="forgot-email">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="forgot-email"
                                    v-model="forgotPasswordData.email"
                                    required
                                    placeholder="tu@email.com"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="new-password">Nueva Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="new-password"
                                    v-model="forgotPasswordData.newPassword"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="confirm-password">Confirmar Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="confirm-password"
                                    v-model="forgotPasswordData.confirmPassword"
                                    required
                                    placeholder="Repite tu nueva contraseña"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Mensaje de éxito o error -->
                        <div v-if="message" :class="[
                            'p-4 rounded-lg text-sm',
                            messageType === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' : '',
                            messageType === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' : ''
                        ]">
                            {{ message }}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                class="w-full"
                                :disabled="forgotPasswordLoading"
                            >
                                <span v-if="forgotPasswordLoading">Cambiando...</span>
                                <span v-else>Cambiar Contraseña</span>
                            </Button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
                            <button 
                                @click="toggleForgotPassword"
                                class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                ← Volver al Login
                            </button>
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

