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

import { getUserProfileById } from '../services/user-profile.js';
import Admin from '../pages/Admin.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import PurchaseTicket from '../pages/PurchaseTicket.vue';
import MyTickets from '../pages/MyTickets.vue';

const routes = [
    { path: '/',                    component: Home},
    { path: '/iniciar-sesion',      component: Login},
    { path: '/registro',            component: Register},
    { path: '/recuperar-contrasena', component: ForgotPassword},
    { path: '/eventos',             component: Events},
    { path: '/evento/:id',          component: EventDetail,   name: 'EventDetail'},
    { path: '/evento/:id/comprar',  component: PurchaseTicket, name: 'PurchaseTicket'},
    { path: '/mis-entradas',        component: MyTickets,      meta: { requiresAuth: true } },

    { path: '/admin',               component: Admin,         meta: { requiresAuth: true } },
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

let authLoading = true;

subscribeToAuth(newUserData => {
    authUser = newUserData;
    authLoading = false;
});

router.beforeEach(async (to, from) => {
    // Esperar a que se complete la verificación de autenticación
    if (authLoading) {
        return false; // No navegar hasta que se complete la carga
    }
    
    // Si el usuario está autenticado y trata de acceder a login/registro, redirigir a Home
    if (authUser.id !== null && (to.path === '/iniciar-sesion' || to.path === '/registro' || to.path === '/recuperar-contrasena')) {
        return { path: '/' };
    }
    
    // Si el usuario no está autenticado y trata de acceder a rutas protegidas
    if(authUser.id === null && to.meta.requiresAuth) {
        return {
            path: '/iniciar-sesion',
        };
    }
});

export default router;
