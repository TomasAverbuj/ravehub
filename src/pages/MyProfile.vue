<template>
  <section class="container mx-auto px-4 py-32">
    <MainH1>Perfil</MainH1>
    <div class="bg-white shadow-lg rounded-lg p-8" v-if="currentUser">
      <!-- Información del Usuario -->
      <div class="mb-8 flex flex-col items-center">
        <img :src="currentUser.profileImage || 'default-profile.png'" alt="Profile Image" class="w-32 h-32 rounded-full mb-4">
        <h2 class="text-2xl font-bold mb-4">{{ currentUser.nombre }}</h2>
        <p class="text-gray-700 mb-4"><strong>Email:</strong> {{ currentUser.email }}</p>
        <button @click="editing = true" class="bg-black text-white font-bold py-2 px-4 rounded-[30px]">
          Editar Perfil
        </button>
      </div>

      <!-- Componente de Suscripción -->
      <Subscription v-if="currentUser" />

      <!-- Mostrar CommentsByUser -->
      <CommentsByUser v-if="currentUser" :userId="currentUser.id" />
    </div>

    <!-- Modal para editar perfil -->
    <div v-if="editing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 class="text-2xl font-bold mb-4">Editar Perfil</h2>
        <div class="mb-4">
          <label for="newName" class="block text-gray-700">Nombre</label>
          <input id="newName" v-model="newName" type="text" class="border border-gray-300 rounded p-2 mt-1 w-full">
        </div>
        <div class="mb-4">
          <label for="newPassword" class="block text-gray-700">Nueva Contraseña</label>
          <input id="newPassword" v-model="newPassword" type="password" class="border border-gray-300 rounded p-2 mt-1 w-full">
        </div>
        <div class="mb-4">
          <label for="photo" class="block text-gray-700">Foto de Perfil</label>
          <input id="photo" type="file" @change="handlePhotoUpload" class="border border-gray-300 rounded p-2 mt-1 w-full">
        </div>
        <div class="flex justify-end">
          <button @click="editing = false" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-[20px] mr-2">
            Cancelar
          </button>
          <button @click="saveProfile" class="bg-black text-white font-bold py-2 px-4 rounded-[20px]">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MainH1 from '../components/MainH1.vue';
import CommentsByUser from '../components/CommentsByUser.vue';
import Subscription from '../components/Subscription.vue';
import { ref } from 'vue';
import { auth } from '../services/firebase';
import { getUserProfileById, updateUserName, updateUserPassword, updateUserProfile, updateUserProfileImage } from '../services/user-profile';
import { uploadFile } from '../services/file-storage';

export default {
  name: 'MyProfile',
  components: { MainH1, CommentsByUser, Subscription },
  setup() {
    const currentUser = ref(null);
    const editing = ref(false);
    const newName = ref('');
    const newPassword = ref('');
    const selectedPhoto = ref(null);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          currentUser.value = await getUserProfileById(user.uid);
          console.log('Perfil del usuario:', currentUser.value);
        } catch (error) {
          console.error('Error al cargar datos del perfil:', error);
        }
      } else {
        currentUser.value = null;
      }
    });

    const handlePhotoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedPhoto.value = file;
      }
    };

    const saveProfile = async () => {
      try {
        if (newName.value) {
          const resultName = await updateUserName(currentUser.value.id, newName.value);
          if (resultName && resultName.success) {
            currentUser.value.nombre = newName.value;
          } else {
            console.error('Error al actualizar el nombre:', resultName?.error);
            alert('Error al actualizar el nombre.');
          }
        }

        if (newPassword.value) {
          const resultPassword = await updateUserPassword(newPassword.value);
          if (resultPassword && resultPassword.success) {
            // Se puede agregar un mensaje de éxito si se desea
          } else {
            console.error('Error al actualizar la contraseña:', resultPassword?.error);
            alert('Error al actualizar la contraseña.');
          }
        }

        if (selectedPhoto.value) {
          const path = `profilePictures/${currentUser.value.id}/${selectedPhoto.value.name}`;
          const uploadResult = await uploadFile(path, selectedPhoto.value);
          if (uploadResult && uploadResult.success) {
            const photoURL = uploadResult.downloadURL;
            const resultProfile = await updateUserProfileImage(currentUser.value.id, photoURL);
            if (resultProfile && resultProfile.success) {
              currentUser.value.profileImage = photoURL;
            } else {
              console.error('Error al actualizar la foto de perfil:', resultProfile?.error);
              alert('Error al actualizar la foto de perfil.');
            }
          } else {
            console.error('Error al subir la foto:', uploadResult?.error);
            alert('Error al subir la foto.');
          }
        }

        editing.value = false;
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios.');
      }
    };

    return { currentUser, editing, newName, newPassword, saveProfile, handlePhotoUpload };
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
