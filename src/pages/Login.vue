<script>
import MainButton from '../components/ui/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/ui/MainInput.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import { login } from '../services/auth';

export default {
    name: "Login",
    components: { MainH1, MainLabel, MainInput, MainButton },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            try {
                await login(this.user.email, this.user.password);
                // Si el login es exitoso, lo mandamos a su perfil.
                this.$router.push({ path: '/perfil' });
            } catch (error) {
                // Manejo de errores, si es necesario
                console.error(error);
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
                Ingresar con tu Cuenta
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
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <MainLabel for="password">Contraseña</MainLabel>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <MainInput
                            type="password"
                            id="password"
                            v-model="user.password"
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
                        Ingresar
                    </MainButton>
                </div>
            </form>

            <p class="mt-10 text-sm text-gray-500">
                ¿No eres miembro?
                <router-link to="/registro" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    ¡Regístrate!
                </router-link>
            </p>

        </div>
    </div>
</template>

