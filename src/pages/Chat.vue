<script>
import Loader from '../components/ui/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import Avatar from '../components/ui/Avatar.vue';
import { subscribeToAuth } from '../services/auth.js';
import { saveChatMessage, subscribeToChatMessages } from '../services/chat';

export default {
    name: "Chat",
    components: { MainH1, Loader, Avatar },
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
  <div class="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 min-h-screen">
    <div class="max-w-4xl mx-auto">
             <!-- Header -->
       <div class="text-center py-16">
         <div class="flex justify-center mb-8">
           <div class="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
             <svg class="w-10 h-10 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
           </div>
         </div>
         <h1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
           Chat Público
         </h1>
         <p class="text-xl text-gray-600 dark:text-gray-300">
           Conecta con otros usuarios de RaveHub
         </p>
       </div>

       <!-- Contenedor del Chat -->
       <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">
         <!-- Header del Chat -->
         <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-black dark:bg-white rounded-t-2xl">
           <div class="flex items-center justify-between">
             <div class="flex items-center space-x-3">
               <div class="w-12 h-12 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center">
                 <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                 </svg>
               </div>
               <div>
                 <h2 class="text-xl font-bold text-white dark:text-black">Chat Público</h2>
                 <p class="text-gray-300 dark:text-gray-600 text-sm">{{ messages.length }} mensajes</p>
               </div>
             </div>
             <div v-if="loadingMessages" class="flex items-center space-x-2">
               <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-black"></div>
               <span class="text-white dark:text-black text-sm">Cargando...</span>
             </div>
           </div>
         </div>

                 <!-- Mensajes -->
         <div
           class="h-[500px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800"
           ref="messagesContainer"
           style="scroll-behavior: smooth;"
         >
          <div v-if="loadingMessages" class="flex justify-center items-center py-8">
            <Loader />
          </div>
          
          <div v-else-if="messages.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">¡Sé el primero en escribir!</h3>
            <p class="text-gray-600 dark:text-gray-400">Inicia la conversación con otros usuarios</p>
          </div>

          <div
            v-else
            v-for="(message, index) in messages.slice(-7)"
            :key="message.id"
            class="w-full flex animate-fade-in"
            :class="message.userId === authUser.id ? 'justify-end' : 'justify-start'"
            :style="{ animationDelay: index * 0.1 + 's' }"
          >
            <div class="flex items-end max-w-full" :class="message.userId === authUser.id ? 'flex-row-reverse' : ''">
                             <!-- Avatar -->
               <div class="flex-shrink-0 mb-1"
                    :class="message.userId === authUser.id ? 'ml-3' : 'mr-3'">
                 <Avatar 
                   :userId="message.userId" 
                   :email="message.email"
                   size="md"
                 />
               </div>
               <!-- Burbuja -->
               <div
                 :class="[
                   'p-4 rounded-2xl shadow-lg transition-all duration-200 break-words max-w-xs md:max-w-md',
                   message.userId === authUser.id
                     ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-none ml-0 mr-2 self-end'
                     : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none ml-2 self-end border border-gray-200 dark:border-gray-600'
                 ]"
               >
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="font-bold text-sm">
                    {{ message.email }}
                  </span>
                  <span class="text-xs opacity-75 ml-2">
                    {{ formatDate(message.created_at) }}
                  </span>
                </div>
                <div class="text-sm break-words leading-relaxed">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de envío -->
        <form
          class="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl"
          @submit.prevent="sendMessage"
        >
          <div class="flex gap-3">
            <textarea
              v-model="newMessage.content"
              placeholder="Escribe tu mensaje..."
              class="flex-1 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm transition-all duration-200"
              rows="2"
            ></textarea>
                         <button
               type="submit"
               class="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
               :disabled="!newMessage.content.trim()"
             >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Animaciones */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Efectos hover */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .max-w-3xl {
    margin: 0 1rem;
  }
  
  .h-96 {
    height: 24rem;
  }
}
</style>

