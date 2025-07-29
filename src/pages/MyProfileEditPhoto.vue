<template>
    <MainH1>Editar mi Foto de Perfil</MainH1>
    <form action="#" @submit.prevent="handleUpload">
        <div class="flex gap-4 mb-3">
            <div class="w-1/2">
                <MainLabel for="photoURL">Foto</MainLabel>
                <input
                    type="file"
                    class="w-full p-2 border border-gray-500 rounded read-only:bg-gray-200"
                    id="photoURL"
                    :read-only="loading"
                    @change="handleFileSelection"
                />
            </div>
            <div class="w-1/2">
                <p class="mb-3">Previsualización</p>
                <img v-if="photoPreview" :src="photoPreview" alt="" class="max-w-full" />
            </div>
        </div>
        <MainButton :loading="loading">Actualizar mi Foto</MainButton>
    </form>
</template>

<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/ui/MainLabel.vue';
import MainButton from '../components/ui/MainButton.vue';
import { subscribeToAuth, updateUserPhoto } from '../services/auth';

export default {
    name: 'MyProfileEditPhoto',
    components: { MainH1, MainLabel, MainButton },
    data() {
        return {
            photo: null,
            loading: false,
            photoPreview: null,

            authUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        handleFileSelection(event) {
            this.photo = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.photoPreview = reader.result;
            });
            reader.readAsDataURL(this.photo);
        },

        async handleUpload() {
            this.loading = true;
            try {
                const photoURL = await updateUserPhoto(this.photo);
                this.authUser.photoURL = photoURL;
            } catch (error) {
                console.error('[MyProfileEditPhoto handleUpload] Error al subir la imagen: ', error);
            }
            this.loading = false;
        }
    },
    mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {
        this.unsubscribeFromAuth();
    }
}
</script>