<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'PrivateChat',
    components: { MainH1, Loader, MainButton },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            loadingUser: false,

            messages: [],
            loadingMessages: false,

            newMessage: {
                content: '',
            }
        }
    },
    methods: {
        handleSubmit() {

        },

        /**
         * Transforma un objeto Date a un string con formato "DD/MM/AAAA HH:mm".
         * 
         * @param {Date} date 
         * @returns {string}
         */
        formatDate(date) {
            // Vamos a usar la clase Intl para darle formato a la fecha.
            return Intl.DateTimeFormat('es-AR', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', /*second: '2-digit',*/
            }).format(date).replace(',', '');
        },
    },
    async mounted() {
        this.loadingUser = true;
        this.user = await getUserProfileById(this.$route.params.id);
        this.loadingUser = false;
    }
}
</script>

<template>
    <Loader v-if="loadingUser" />
    <template v-else>
        <MainH1>Chat Privado con {{ user.email }}</MainH1>

        <section class="mb-4">
            <h2 class="sr-only">Lista de Mensajes</h2>

            <div class="min-h-[400px] p-4 border border-gray-300 rounded">
                <ul v-if="!loadingMessages">
                    <li 
                        v-for="message in messages"
                        class="mb-2"
                    >
                        <p>
                            <router-link 
                                class="text-blue-600 underline"
                                :to="userRoute(message.userId)"
                            >
                                <b>{{ message.email }}</b>
                            </router-link> 
                            dijo:
                        </p>
                        <p>{{ message.content }}</p>
                        <p>{{ formatDate(message.created_at) }}</p>
                    </li>
                </ul>
                <Loader v-else />
            </div>
        </section>

        <section>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <h2 class="sr-only">Enviar Mensaje</h2>
                <div class="flex gap-4">
                    <textarea
                        id="message"
                        class="w-full p-2 border border-gray-500 rounded"
                        aria-label="Mensaje"
                        v-model="newMessage.content"
                    ></textarea>
                    <MainButton>Enviar</MainButton>
                </div>
            </form>
        </section>
    </template>
</template>