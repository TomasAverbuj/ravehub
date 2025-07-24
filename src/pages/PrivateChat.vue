<script>
import { ref, watch, nextTick } from 'vue';
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { subscribeToAuth } from '../services/auth.js';
import { getUserProfileById } from '../services/user-profile.js';

export default {
  name: 'PrivateChat',
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

    const getInitial = (email) => email ? email.charAt(0).toUpperCase() : '?';

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

    return { authUser, messages, newMessage, sendMessage, formatDate, getInitial, otherUserEmail, messagesContainer };
  }
};
</script>

<template>
  <transition name="slide">
    <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-gray-200 dark:border-neutral-800">
      <header class="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center gap-4 justify-between">
        <h1 class="text-xl font-bold text-indigo-700 dark:text-indigo-300">Chat Privado con {{ otherUserEmail || 'Usuario' }}</h1>
        <button @click="$emit('close')" class="text-gray-500 hover:text-indigo-600 text-2xl font-bold">&times;</button>
      </header>
      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent">
        <div v-for="msg in messages" :key="msg.id" class="w-full flex" :class="msg.senderId === authUser.id ? 'justify-end' : 'justify-start'">
          <div class="flex items-end max-w-full" :class="msg.senderId === authUser.id ? 'flex-row-reverse' : ''">
            <div class="flex-shrink-0 mb-1" :class="msg.senderId === authUser.id ? 'ml-2' : 'mr-2'">
              <div class="w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-700 flex items-center justify-center text-white font-bold text-base border-2 border-white dark:border-neutral-900 shadow">
                {{ getInitial(msg.email) }}
              </div>
            </div>
            <div :class="['p-3 rounded-2xl shadow transition break-words', msg.senderId === authUser.id ? 'bg-indigo-600 text-white rounded-br-none ml-0 mr-2 self-end' : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-bl-none ml-2 self-end border border-gray-200 dark:border-neutral-800']" style="max-width: 80%; min-width: 120px;">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="font-bold text-xs">{{ msg.email }}</span>
                <span class="text-xs text-gray-400 ml-2">{{ formatDate(msg.created_at) }}</span>
              </div>
              <div class="text-base break-words">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <form class="flex gap-3 p-4 border-t border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky bottom-0 z-10" @submit.prevent="sendMessage">
        <textarea v-model="newMessage" placeholder="Escribe tu mensaje..." class="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 shadow-sm" rows="2"></textarea>
        <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Enviar</button>
      </form>
    </div>
  </transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.3s, opacity 0.2s; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); opacity: 0; }
.slide-enter-to, .slide-leave-from { transform: translateX(0); opacity: 1; }
</style>