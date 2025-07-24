<template>
  <div class="container mx-auto py-32 p-5 mt-5 mb-5">
    <template v-if="authUser.role === 'admin'">
      <h1 class="text-3xl font-bold mb-6 main-title">Administrar Eventos</h1>

      <div v-if="loading" class="flex justify-center items-center">
        <Loader />
      </div>
      
      <div class="flex justify-end mb-4">
        <button @click="showAddEventForm = true" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Agregar Evento</button>
      </div>

      <table class="table-auto w-full mb-8 bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2">Imagen</th>
            <th class="px-4 py-2">Título</th>
            <th class="px-4 py-2">Descripción</th>
            <th class="px-4 py-2">Fecha</th>
            <th class="px-4 py-2">Locación</th>
            <th class="px-4 py-2">Capacidad</th>
            <th class="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id" class="hover:bg-gray-100">
            <td class="border px-4 py-2">
              <img :src="event.img" alt="Imagen del evento" class="w-16 h-16 object-cover rounded-full"/>
            </td>
            <td class="border px-4 py-2">{{ event.title }}</td>
            <td class="border px-4 py-2">{{ event.description }}</td>
            <td class="border px-4 py-2">{{ event.date }}</td>
            <td class="border px-4 py-2">{{ event.location }}</td>
            <td class="border px-4 py-2">{{ parseCapacity(event.capacity) }}</td>
            <td class="flex px-4 py-2">
              <button @click="goToEventDetail(event.id)" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 mx-1 rounded">Detalle</button>
              <button @click="editEvent(event)" class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 mx-1 rounded">Editar</button>
              <button @click="deleteEvent(event.id)" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 mx-1 rounded">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="showAddEventForm || showEditEventForm" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-lg">
          <h2 v-if="showAddEventForm" class="text-xl mb-4">Agregar Evento</h2>
          <h2 v-else class="text-xl mb-4">Editar Evento</h2>
          <form @submit.prevent="showAddEventForm ? addEvent() : updateEvent()">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
              <input v-model="eventForm.title" type="text" id="title" name="title" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model="eventForm.description" id="description" name="description" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
            </div>
            <div class="mb-4">
              <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
              <input v-model="eventForm.date" type="date" id="date" name="date" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="mb-4">
              <label for="location" class="block text-sm font-medium text-gray-700">Locación</label>
              <input v-model="eventForm.location" type="text" id="location" name="location" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="mb-4">
              <label for="capacity" class="block text-sm font-medium text-gray-700">Capacidad</label>
              <input v-model="eventForm.capacity" type="number" id="capacity" name="capacity" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="mb-4">
              <label for="img" class="block text-sm font-medium text-gray-700">Imagen</label>
              <input @change="handleFileSelection" type="file" id="img" name="img" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="flex justify-end">
              <button type="button" @click="cancel()" class="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancelar</button>
              <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">{{ showAddEventForm ? 'Agregar' : 'Actualizar' }}</button>
            </div>
          </form>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center text-xl text-gray-600 py-32">
        Acceso denegado. Solo los administradores pueden ver esta sección.
      </div>
    </template>
  </div>
</template>

<script>

import { eventsService } from '../services/events.js';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../services/firebase";
import Loader from '../components/Loader.vue';
import { subscribeToAuth } from '../services/auth.js';

export default {
  name: 'EventsTable',
  components: { Loader },
  data() {
    return {
      events: [],
      showAddEventForm: false,
      showEditEventForm: false,
      eventForm: {
        id: '', // Añadido para editar eventos
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        img: ''
      },
      selectedFile: null,
      uploadProgress: 0,
      authUser: { role: null },
    };
  },
  async created() {
    subscribeToAuth(newUserData => this.authUser = newUserData);
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        this.events = await eventsService.getEvents();
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    },
    goToEventDetail(eventId) {
      this.$router.push({ name: 'EventDetail', params: { id: eventId } });
    },
    async addEvent() {
      try {
        if (this.selectedFile) {
          const imgUrl = await this.uploadImage(this.selectedFile);
          this.eventForm.img = imgUrl;
        }
        await eventsService.addEvent(this.eventForm);
        this.fetchEvents();
        this.showAddEventForm = false;
        this.cancel(); // Reset form and state
      } catch (error) {
        console.error("Error al agregar evento:", error);
      }
    },
    async updateEvent() {
      try {
        if (this.selectedFile) {
          const imgUrl = await this.uploadImage(this.selectedFile);
          this.eventForm.img = imgUrl;
        }
        await eventsService.updateEvent(this.eventForm);
        this.fetchEvents();
        this.showEditEventForm = false;
        this.cancel(); // Reset form and state
      } catch (error) {
        console.error("Error al actualizar evento:", error);
      }
    },
    async deleteEvent(eventId) {
      try {
        await eventsService.deleteEvent(eventId);
        this.fetchEvents();
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
    },
    async uploadImage(file) {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    },
    handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
    },
    cancel() {
      this.showAddEventForm = false;
      this.showEditEventForm = false;
      this.eventForm = {
        id: '',
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        img: ''
      };
      this.selectedFile = null;
      this.uploadProgress = 0;
    },
    editEvent(event) {
      this.eventForm = { ...event };
      this.showAddEventForm = false;
      this.showEditEventForm = true;
    },
    parseCapacity(capacity) {
      return capacity ? capacity : 'No definido';
    }
  }
};
</script>

<style scoped>
.main-title {
  color: #000000;
}
</style>
