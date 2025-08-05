<script>
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import Container from '../components/ui/Container.vue';
import Button from '../components/ui/Button.vue';
import { changePassword } from '../services/auth';

export default {
    name: "ForgotPassword",
    components: { MainH1, MainLabel, MainInput, MainButton, Container, Button },
    data() {
        return {
            email: '',
            newPassword: '',
            confirmPassword: '',
            loading: false,
            message: '',
            messageType: ''
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            this.message = '';
            this.messageType = '';

            if (!this.email || !this.newPassword || !this.confirmPassword) {
                this.message = 'Por favor completa todos los campos.';
                this.messageType = 'error';
                this.loading = false;
                return;
            }

            if (this.newPassword !== this.confirmPassword) {
                this.message = 'Las contraseñas no coinciden.';
                this.messageType = 'error';
                this.loading = false;
                return;
            }

            if (this.newPassword.length < 6) {
                this.message = 'La contraseña debe tener al menos 6 caracteres.';
                this.messageType = 'error';
                this.loading = false;
                return;
            }

            try {
                this.message = 'Contraseña cambiada exitosamente.';
                this.messageType = 'success';
                this.email = '';
                this.newPassword = '';
                this.confirmPassword = '';
                
                setTimeout(() => {
                    this.$router.push('/login');
                }, 2000);
            } catch (error) {
                console.error('Error al cambiar contraseña:', error);
                this.message = 'Error al cambiar la contraseña. Verifica que el email esté registrado.';
                this.messageType = 'error';
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
                <div class="text-center mb-12">
                    <div class="flex justify-center mb-8">
                        <div class="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg class="w-10 h-10 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                        </div>
                    </div>
                    <MainH1 class="text-3xl font-black text-black dark:text-white mb-2">
                        Recuperar Contraseña
                    </MainH1>
                    <p class="text-gray-600 dark:text-gray-300">
                        Ingresa tu email y tu nueva contraseña
                    </p>
                </div>

                <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-800">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <MainLabel for="email">Email</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="email"
                                    id="email"
                                    v-model="email"
                                    required
                                    placeholder="tu@email.com"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="newPassword">Nueva Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="newPassword"
                                    v-model="newPassword"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <MainLabel for="confirmPassword">Confirmar Contraseña</MainLabel>
                            <div class="mt-2">
                                <MainInput
                                    type="password"
                                    id="confirmPassword"
                                    v-model="confirmPassword"
                                    required
                                    placeholder="Repite tu nueva contraseña"
                                    class="w-full"
                                />
                            </div>
                        </div>

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
                                :disabled="loading"
                            >
                                <span v-if="loading">Cambiando...</span>
                                <span v-else>Cambiar Contraseña</span>
                            </Button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
                            <router-link to="/login" class="font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                ← Volver al Login
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