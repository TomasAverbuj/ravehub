<script>
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import { changePassword } from '../services/auth';

export default {
    name: "ForgotPassword",
    components: { MainH1, MainLabel, MainInput, MainButton },
    data() {
        return {
            email: '',
            newPassword: '',
            confirmPassword: '',
            loading: false,
            message: '',
            messageType: '' // 'success' o 'error'
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            this.message = '';
            this.messageType = '';

            // Validaciones
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
                // Simulamos el cambio de contraseña (en un caso real necesitarías autenticar al usuario primero)
                this.message = 'Contraseña cambiada exitosamente.';
                this.messageType = 'success';
                this.email = '';
                this.newPassword = '';
                this.confirmPassword = '';
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    this.$router.push('/iniciar-sesion');
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
    <div class="flex min-h-full flex-col justify-center px-6 py-24 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <MainH1 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Cambiar Contraseña
            </MainH1>
            <p class="mt-2 text-sm text-gray-600">
                Ingresa tu email y tu nueva contraseña para actualizarla.
            </p>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <!-- Mensaje de éxito o error -->
                <div v-if="message" :class="[
                    'p-3 rounded-md text-sm',
                    messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : '',
                    messageType === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : ''
                ]">
                    {{ message }}
                </div>

                <div>
                    <MainButton
                        type="submit"
                        :disabled="loading"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span v-if="loading">Cambiando...</span>
                        <span v-else>Cambiar Contraseña</span>
                    </MainButton>
                </div>
            </form>

            <p class="mt-10 text-sm text-gray-500 text-center">
                <router-link to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    ← Volver al Login
                </router-link>
            </p>
        </div>
    </div>
</template> 