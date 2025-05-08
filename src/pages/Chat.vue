<script>
import Loader from '../components/Loader.vue';
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
  <div class="flex flex-col min-h-screen bg-[#313338]">
    <header class="py-8 px-6">
      <h1 class="text-3xl font-bold text-white">Chat Global</h1>
    </header>
    <main class="flex-1 flex flex-col max-w-3xl mx-auto w-full">
      <!-- Mensajes -->
      <div
        class="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        ref="messagesContainer"
        style="scroll-behavior: smooth;"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex gap-3 items-start',
            message.userId === authUser.id ? 'justify-end' : 'justify-start'
          ]"
        >
          <!-- Avatar -->
          <div v-if="message.userId !== authUser.id" class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-lg">
              {{ message.email ? message.email.charAt(0).toUpperCase() : '?' }}
            </div>
          </div>
          <!-- Burbuja -->
          <div
            :class="[
              'p-4 rounded-lg max-w-lg shadow',
              message.userId === authUser.id
                ? 'bg-[#5865F2] text-white rounded-br-none'
                : 'bg-[#2B2D31] text-gray-100 rounded-bl-none'
            ]"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm">
                {{ message.email }}
              </span>
              <span class="text-xs text-gray-400 ml-2">
                {{ formatDate(message.created_at) }}
              </span>
            </div>
            <div class="text-base">{{ message.content }}</div>
          </div>
          <!-- Avatar propio -->
          <div v-if="message.userId === authUser.id" class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-lg">
              {{ message.email ? message.email.charAt(0).toUpperCase() : '?' }}
            </div>
          </div>
        </div>
      </div>
      <!-- Barra de envío -->
      <form
        class="flex gap-3 p-4 border-t border-[#232428] bg-[#313338]"
        @submit.prevent="sendMessage"
      >
        <textarea
          v-model="newMessage.content"
          placeholder="Escribe tu mensaje..."
          class="flex-1 p-3 rounded-lg bg-[#383A40] text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
          rows="2"
        ></textarea>
        <button
          type="submit"
          class="bg-[#5865F2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4752C4] transition"
        >
          Enviar
        </button>
      </form>
    </main>
  </div>
</template>

