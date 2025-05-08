import { subscribeToAuth } from '../services/auth.js';
import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../pages/Home.vue';
import Chat from '../pages/Chat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Events from '../pages/Events.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEditPhoto from '../pages/MyProfileEditPhoto.vue'; // Nueva importación
import UserProfile from '../pages/UserProfile.vue';
import PrivateChat from '../pages/PrivateChat.vue';
import EventDetail from '../pages/EventDetail.vue';
import EventsTable from '../pages/EventsTable.vue';

const routes = [
    { path: '/',                    component: Home},
    { path: '/iniciar-sesion',      component: Login},
    { path: '/registro',            component: Register},
    { path: '/eventos',             component: Events},
    { path: '/evento/:id',          component: EventDetail,   name: 'EventDetail'},
    { path: '/eventos-tabla',       component: EventsTable},
    { path: '/chat',                component: Chat,          meta: { requiresAuth: true } },
    { path: '/perfil',              component: MyProfile,     meta: { requiresAuth: true } },
    { path: '/perfil/editar-foto',  component: MyProfileEditPhoto,  meta: { requiresAuth: true } }, // Nueva ruta
/*     { path: '/admin',               component: Admin,         meta: { requiresAuth: true } }, */
    { path: '/usuario/:id',         component: UserProfile,   meta: { requiresAuth: true } },
    { path: '/usuario/:id/chat',    component: PrivateChat,   meta: { requiresAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let authUser = {
    id: null,
    email: null,
}

subscribeToAuth(newUserData => authUser = newUserData);

router.beforeEach((to, from) => {
    // if(authUser.id === null && to.path === '/chat') {
    // if(authUser.id === null && ['/chat', '/perfil'].includes(to.path)) {
    if(authUser.id === null && to.meta.requiresAuth) {
        // Prohibimos el acceso a la ruta.
        // Para esto, podemos o retornar "false", con lo que la navegación se cancela, o 
        // retornar un nuevo objeto de ruta a donde queremos redireccionar al usuario.
        // return false;
        return {
            path: '/iniciar-sesion',
        };
    }
});

export default router;
