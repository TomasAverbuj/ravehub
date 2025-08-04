<script>
import { ref, watch, nextTick } from 'vue';
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { subscribeToAuth } from '../services/auth.js';
import { getUserProfileById } from '../services/user-profile.js';
import Avatar from '../components/ui/Avatar.vue';

export default {
  name: 'PrivateChat',
  components: { Avatar },
  props: {
    chatId: { type: String, required: true },
    otherUserId: { type: String, required: true },
    visible: { type: Boolean, default: false }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const authUser = ref({ id: null, email: null });
    const messages = ref([]);
    const newMessage = ref('');
    const otherUserEmail = ref('');
    const messagesContainer = ref(null);

    // Cargar email del otro usuario
    const loadOtherUser = async () => {
      try {
        const profile = await getUserProfileById(props.otherUserId);
        otherUserEmail.value = profile.email;
      } catch {}
    };

    // Asegurarse de que el chat existe
    const ensureChatExists = async () => {
      const chatRef = doc(db, 'message', props.chatId);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          users: {
            [authUser.value.id]: true,
            [props.otherUserId]: true
          },
          lastMessage: {},
        });
      }
    };

    // Suscribirse a los mensajes del chat
    const subscribeToMessages = () => {
      if (!props.chatId) return;
      const messagesCol = collection(db, 'message', props.chatId, 'message');
      const q = query(messagesCol, orderBy('created_at'));
      onSnapshot(q, snapshot => {
        messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          }
        });
      });
    };

    // Enviar mensaje
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !props.chatId) return;
      const messagesCol = collection(db, 'message', props.chatId, 'message');
      await addDoc(messagesCol, {
        senderId: authUser.value.id,
        email: authUser.value.email,
        content: newMessage.value,
        created_at: serverTimestamp(),
      });
      // Actualizar lastMessage en el chat
      const chatRef = doc(db, 'message', props.chatId);
      await setDoc(chatRef, {
        lastMessage: {
          content: newMessage.value,
          created_at: new Date(),
          senderId: authUser.value.id
        }
      }, { merge: true });
      newMessage.value = '';
    };

    const formatDate = (date) => {
      if (!date) return '';
      try {
        return new Intl.DateTimeFormat('es-AR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(date.seconds ? date.seconds * 1000 : date)).replace(',', '');
      } catch {
        return '';
      }
    };

    watch(() => props.visible, async (val) => {
      if (val && props.chatId && props.otherUserId) {
        subscribeToAuth(newUserData => {
          authUser.value = newUserData;
        });
        await loadOtherUser();
        await ensureChatExists();
        subscribeToMessages();
      }
    }, { immediate: true });

    return { 
      authUser, 
      messages, 
      newMessage, 
      sendMessage, 
      formatDate, 
      otherUserEmail, 
      messagesContainer
    };
  }
};
</script>

<template>
  <transition name="slide">
    <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-md z-[99999] bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-700">
      <!-- Header del Chat -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-black dark:bg-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white dark:text-black">Chat Privado</h2>
              <p class="text-gray-300 dark:text-gray-600 text-sm">{{ otherUserEmail || 'Usuario' }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-500 text-2xl font-bold transition-colors">&times;</button>
        </div>
      </div>

      <!-- Mensajes -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        <div v-if="messages.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">¡Inicia la conversación!</h3>
          <p class="text-gray-600 dark:text-gray-400">Envía el primer mensaje</p>
        </div>

        <div 
          v-for="(msg, index) in messages.slice(-7)" 
          :key="msg.id" 
          class="w-full flex animate-fade-in"
          :class="msg.senderId === authUser.id ? 'justify-end' : 'justify-start'"
          :style="{ animationDelay: index * 0.1 + 's' }"
        >
          <div class="flex items-end max-w-full" :class="msg.senderId === authUser.id ? 'flex-row-reverse' : ''">
            <div class="flex-shrink-0 mb-1" :class="msg.senderId === authUser.id ? 'ml-3' : 'mr-3'">
              <Avatar 
                :userId="msg.senderId" 
                :email="msg.email"
                size="md"
              />
            </div>
            <div 
              :class="[
                'p-4 rounded-2xl shadow-lg transition-all duration-200 break-words max-w-xs',
                msg.senderId === authUser.id 
                  ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-none ml-0 mr-2 self-end' 
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none ml-2 self-end border border-gray-200 dark:border-gray-600'
              ]"
            >
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="font-bold text-sm">{{ msg.email }}</span>
                <span class="text-xs opacity-75 ml-2">{{ formatDate(msg.created_at) }}</span>
              </div>
              <div class="text-sm break-words leading-relaxed">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de envío -->
      <form class="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" @submit.prevent="sendMessage">
        <div class="flex gap-3">
          <textarea 
            v-model="newMessage" 
            placeholder="Escribe tu mensaje..." 
            class="flex-1 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm transition-all duration-200" 
            rows="2"
          ></textarea>
          <button 
            type="submit" 
            class="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            :disabled="!newMessage.trim()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Enviar</span>
          </button>
        </div>
      </form>
    </div>
  </transition>
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

/* Slide transition */
.slide-enter-active, .slide-leave-active { 
  transition: transform 0.3s, opacity 0.2s; 
}

.slide-enter-from, .slide-leave-to { 
  transform: translateX(100%); 
  opacity: 0; 
}

.slide-enter-to, .slide-leave-from { 
  transform: translateX(0); 
  opacity: 1; 
}
</style>