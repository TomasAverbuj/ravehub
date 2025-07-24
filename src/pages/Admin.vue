<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { eventsService } from '../services/events';
import { subscribeToAuth } from '../services/auth.js';

export default {
  name: 'Admin',
  setup() {
    const users = ref([]);
    const eventsCount = ref(0);
    const authUser = ref({ role: null });

    const fetchUsers = async () => {
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const fetchEventsCount = async () => {
      const events = await eventsService.getEvents();
      eventsCount.value = events.length;
    };

    const changeUserRole = async (user) => {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { role: user.role });
      // Opcional: recargar usuarios para reflejar cambios
      await fetchUsers();
    };

    onMounted(() => {
      subscribeToAuth(newUserData => authUser.value = newUserData);
      fetchUsers();
      fetchEventsCount();
    });

    return { users, eventsCount, authUser, changeUserRole };
  }
};
</script>

<template>
  <div class="container mx-auto py-16 px-4">
    <div v-if="authUser.role === 'admin'">
      <h1 class="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span class="text-lg font-semibold">Total de eventos registrados:</span>
          <span class="text-2xl text-indigo-700 font-bold">{{ eventsCount }}</span>
        </div>
      </div>
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Usuarios registrados</h2>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Nombre</th>
              <th class="px-4 py-2 text-left">Rol</th>
              <th class="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b dark:border-neutral-800">
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">{{ user.nombre }}</td>
              <td class="px-4 py-2">{{ user.role }}</td>
              <td class="px-4 py-2">
                <select v-model="user.role" @change="changeUserRole(user)" class="border rounded px-2 py-1">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Eventos registrados</h2>
        <router-link to="/eventos-tabla" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition mb-4 inline-block">
          Ver Tabla de Eventos
        </router-link>
      </div>
    </div>
    <div v-else class="text-center text-xl text-gray-600 py-32">
      Acceso denegado. Solo los administradores pueden ver esta sección.
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
}
</style>

