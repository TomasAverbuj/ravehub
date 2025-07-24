<template>
  <aside class="w-72 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 h-screen flex flex-col">
    <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
      <input v-model="search" type="text" placeholder="Buscar usuario..." class="w-full p-2 rounded border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-black dark:text-white" />
      <div v-if="filteredUsers.length" class="mt-2 bg-white dark:bg-neutral-900 rounded shadow max-h-40 overflow-y-auto">
        <div v-for="user in filteredUsers" :key="user.id" class="px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer" @click="startChatWith(user)">
          {{ user.email }}
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <h2 class="p-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Tus chats privados</h2>
      <ul>
        <li v-for="chat in chats" :key="chat.id" class="px-4 py-3 border-b border-gray-100 dark:border-neutral-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center justify-between" @click="$emit('open-chat', chat)">
          <div>
            <div class="font-bold text-indigo-700 dark:text-indigo-300">{{ getOtherUserEmail(chat) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ chat.lastMessage?.content || 'Sin mensajes' }}</div>
          </div>
          <span v-if="unreadCounts[chat.id] > 0" class="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">{{ unreadCounts[chat.id] }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { collection, getDocs, query, where, setDoc, doc, serverTimestamp, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { subscribeToAuth } from '../services/auth.js';

export default {
  name: 'SidebarChats',
  emits: ['open-chat', 'notify'],
  setup(_, { emit, expose }) {
    const authUser = ref({ id: null, email: null });
    const users = ref([]);
    const chats = ref([]);
    const search = ref('');
    const unreadCounts = ref({}); // { chatId: count }
    let activeChatId = null;

    // Cargar usuarios (excepto el actual)
    const fetchUsers = async () => {
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      users.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== authUser.value.id);
    };

    // Cargar chats privados del usuario actual y escuchar mensajes nuevos
    const fetchChats = async () => {
      if (!authUser.value.id) return;
      const chatsCol = collection(db, 'message');
      const q = query(chatsCol, where(`users.${authUser.value.id}`, '==', true));
      const snapshot = await getDocs(q);
      chats.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Escuchar mensajes nuevos en cada chat
      chats.value.forEach(chat => listenForUnread(chat.id));
    };

    // Escuchar mensajes no leídos en cada chat
    const listenForUnread = (chatId) => {
      if (!authUser.value.id) return;
      const messagesCol = collection(db, 'message', chatId, 'message');
      const q = query(messagesCol);
      onSnapshot(q, snapshot => {
        let count = 0;
        snapshot.docs.forEach(docSnap => {
          const msg = docSnap.data();
          if (msg.senderId !== authUser.value.id && !msg.readBy?.[authUser.value.id]) {
            count++;
          }
        });
        unreadCounts.value[chatId] = count;
        // Notificar si hay mensajes nuevos y el chat no está abierto
        if (count > 0 && chatId !== activeChatId) {
          const lastMsg = snapshot.docs[snapshot.docs.length - 1]?.data();
          if (lastMsg && lastMsg.senderId !== authUser.value.id) {
            emit('notify', lastMsg.content, chatId, lastMsg.email);
          }
        }
      });
    };

    // Buscar usuarios por email
    const filteredUsers = computed(() => {
      if (!search.value) return [];
      return users.value.filter(u => u.email.toLowerCase().includes(search.value.toLowerCase()));
    });

    // Obtener el email del otro usuario en el chat
    const getOtherUserEmail = (chat) => {
      const ids = Object.keys(chat.users || {});
      const otherId = ids.find(id => id !== authUser.value.id);
      const other = users.value.find(u => u.id === otherId);
      return other ? other.email : 'Usuario';
    };

    // Iniciar o abrir chat privado
    const startChatWith = async (user) => {
      const ids = [authUser.value.id, user.id].sort();
      const chatId = ids.join('_');
      const chatRef = doc(db, 'message', chatId);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          users: {
            [authUser.value.id]: true,
            [user.id]: true
          },
          lastMessage: {},
        });
      }
      await fetchChats();
      const chat = chats.value.find(c => c.id === chatId) || (await getDoc(chatRef)).data();
      activeChatId = chatId;
      clearUnread(chatId);
      emit('open-chat', { id: chatId, ...chat });
      search.value = '';
    };

    // Limpiar mensajes no leídos al abrir el chat
    const clearUnread = async (chatId) => {
      unreadCounts.value[chatId] = 0;
      // Marcar como leído en Firestore (opcional, para multi-dispositivo)
      const messagesCol = collection(db, 'message', chatId, 'message');
      const q = query(messagesCol);
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async docSnap => {
        const msg = docSnap.data();
        if (msg.senderId !== authUser.value.id && !msg.readBy?.[authUser.value.id]) {
          const msgRef = doc(db, 'message', chatId, 'message', docSnap.id);
          await updateDoc(msgRef, { [`readBy.${authUser.value.id}`]: true });
        }
      });
    };

    // Exponer clearUnread para App.vue
    expose({ clearUnread });

    onMounted(() => {
      subscribeToAuth(newUserData => {
        authUser.value = newUserData;
        fetchUsers();
        fetchChats();
      });
    });

    watch(() => authUser.value.id, () => {
      fetchUsers();
      fetchChats();
    });

    return { users, chats, search, filteredUsers, getOtherUserEmail, startChatWith, unreadCounts };
  }
};
</script>

<style scoped>
aside {
  min-width: 18rem;
  max-width: 18rem;
}
</style> 