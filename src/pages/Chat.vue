<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import { subscribeToAuth } from '../services/auth.js';
import { saveChatMessage, subscribeToChatMessages } from '../services/chat';

export default {
    name: "Chat",
    components: { MainH1, Loader, MainLabel, MainButton, MainInput },
    data: () => {
        return {
            messages: [],
            loadingMessages: true,
            unsubscribeFromChat: () => {},

            newMessage: {
                content: '',
            },

            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        sendMessage() {
            saveChatMessage({
                userId: this.authUser.id,
                email: this.authUser.email,
                content: this.newMessage.content,
            });
            // this.messages.push({
            //     email: this.newMessage.email,
            //     content: this.newMessage.content,
            // });
            this.newMessage.content = '';
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

        userRoute(id) {
            return id !== this.authUser.id ?
                `/usuario/${id}` :
                '/perfil';
        }
    },
    mounted() {
        this.unsubscribeFromChat = subscribeToChatMessages(newMessages => {
            this.messages = newMessages;
            this.loadingMessages = false;
        });
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {
        this.unsubscribeFromAuth();
        this.unsubscribeFromChat();
    }
}
</script>

<template>
    <div class="py-32">
        <MainH1>Chat Global</MainH1>
    
        <div class="flex gap-4">
            <section class="w-3/4">
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
                    <!-- <div v-else class="flex justify-center items-center h-full"> -->
                    <Loader v-else />
                    <!-- </div> -->
                </div>
            </section> 
            <section class="w-1/4">
                <h2 class="mb-4">Enviar un Mensaje</h2>
    
                <form 
                    action="#"
                    @submit.prevent="sendMessage"
                >
                    <div class="mb-3">
                        <span class="block mb-2">Email</span>
                        <span>{{ authUser.email }}</span>
                    </div>
                    <div class="mb-3">
                        <MainLabel for="message">Mensaje</MainLabel>
                        <!-- TODO: Adapten el textarea a un componente MainTextarea. -->
                        <textarea
                            id="message"
                            class="w-full p-2 border border-gray-500 rounded"
                            v-model="newMessage.content"
                        ></textarea>
                    </div>
                    <MainButton 
                        type="submit"
                    />
                </form>
            </section>
        </div>
    </div>
</template>

