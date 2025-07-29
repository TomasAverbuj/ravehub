<script>
import Loader from '../components/ui/Loader.vue';
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import { register } from '../services/auth';

export default {
    name: "Register",
    components: { MainH1, MainLabel, MainButton, MainInput, Loader },
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
    <div class="flex min-h-full flex-col justify-center px-6 py-24 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">

            <MainH1 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Crear una Cuenta
            </MainH1>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <div>
                    <MainLabel for="email">Email</MainLabel>
                    <div class="mt-2">
                        <MainInput
                            type="email"
                            id="email"
                            v-model="user.email"
                            :readonly="loading"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <MainLabel for="nombre">Nombre</MainLabel>
                    <div class="mt-2">
                        <MainInput
                            type="text"
                            id="nombre"
                            v-model="user.nombre"
                            :readonly="loading"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <MainButton
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Loader v-if="loading" />
                        <template v-else>Crear Cuenta</template>
                    </MainButton>
                </div>
            </form>

            <p v-if="errorMsg" class="mt-4 text-red-600">{{ errorMsg }}</p>

            <p class="mt-10 text-sm text-gray-500">
                ¿Ya tienes una cuenta?
                <a href="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Inicia sesión</a>
            </p>
        </div>
    </div>
</template>