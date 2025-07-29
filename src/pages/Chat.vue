<script>
import Loader from '../components/ui/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import { subscribeToAuth } from '../services/auth.js';
import { saveChatMessage, subscribeToChatMessages } from '../services/chat';

export default {
    name: "Chat",
    components: { MainH1, Loader },
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
            if (!this.newMessage.content.trim()) return;
            saveChatMessage({
                userId: this.authUser.id,
                email: this.authUser.email,
                content: this.newMessage.content,
            });
            this.newMessage.content = '';
            this.$nextTick(() => this.scrollToBottom());
        },
        formatDate(date) {
            return Intl.DateTimeFormat('es-AR', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
            }).format(new Date(date)).replace(',', '');
        },
        scrollToBottom() {
            const container = this.$refs.messagesContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    },
    mounted() {
        this.unsubscribeFromChat = subscribeToChatMessages(newMessages => {
            this.messages = newMessages;
            this.loadingMessages = false;
            this.$nextTick(() => this.scrollToBottom());
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
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-100 to-indigo-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-indigo-950">
    <header class="py-8 px-6 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm">
      <h1 class="text-3xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">Chat Público</h1>
    </header>
    <main class="flex-1 flex flex-col max-w-2xl mx-auto w-full">
      <!-- Mensajes -->
      <div
        class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent"
        ref="messagesContainer"
        style="scroll-behavior: smooth;"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="w-full flex"
          :class="message.userId === authUser.id ? 'justify-end' : 'justify-start'"
        >
          <div class="flex items-end max-w-full" :class="message.userId === authUser.id ? 'flex-row-reverse' : ''">
            <!-- Avatar -->
            <div class="flex-shrink-0 mb-1"
                 :class="message.userId === authUser.id ? 'ml-2' : 'mr-2'">
              <div class="w-10 h-10 rounded-full bg-indigo-500 dark:bg-indigo-700 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-neutral-900 shadow">
                {{ message.email ? message.email.charAt(0).toUpperCase() : '?' }}
              </div>
            </div>
            <!-- Burbuja -->
            <div
              :class="[
                'p-4 rounded-2xl shadow transition break-words',
                message.userId === authUser.id
                  ? 'bg-indigo-600 text-white rounded-br-none ml-0 mr-2 self-end'
                  : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-none ml-2 self-end border border-gray-200 dark:border-neutral-800'
              ]"
              style="max-width: 80%; min-width: 200px;"
            >
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="font-bold text-sm">
                  {{ message.email }}
                </span>
                <span class="text-xs text-gray-400 ml-2">
                  {{ formatDate(message.created_at) }}
                </span>
              </div>
              <div class="text-base break-words">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Barra de envío -->
      <form
        class="flex gap-3 p-4 border-t border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky bottom-0 z-10"
        @submit.prevent="sendMessage"
      >
        <textarea
          v-model="newMessage.content"
          placeholder="Escribe tu mensaje..."
          class="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 shadow-sm"
          rows="2"
        ></textarea>
        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          Enviar
        </button>
      </form>
    </main>
  </div>
</template>

