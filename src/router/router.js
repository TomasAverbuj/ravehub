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
import { getUserProfileById } from '../services/user-profile.js';
import Admin from '../pages/Admin.vue';

const routes = [
    { path: '/',                    component: Home},
    { path: '/iniciar-sesion',      component: Login},
    { path: '/registro',            component: Register},
    { path: '/eventos',             component: Events},
    { path: '/evento/:id',          component: EventDetail,   name: 'EventDetail'},
    { path: '/eventos-tabla',       component: EventsTable},
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

subscribeToAuth(newUserData => authUser = newUserData);

router.beforeEach(async (to, from) => {
    if(authUser.id === null && to.meta.requiresAuth) {
        return {
            path: '/iniciar-sesion',
        };
    }
    // Protección de ruta de eventos-tabla solo para admin
    if (to.path === '/eventos-tabla') {
        if (!authUser.id) {
            return { path: '/iniciar-sesion' };
        }
        // Si el rol no está cargado aún, cargarlo
        if (!authUser.role) {
            try {
                const profile = await getUserProfileById(authUser.id);
                if (profile.role !== 'admin') {
                    return { path: '/' };
                }
            } catch (e) {
                return { path: '/' };
            }
        } else if (authUser.role !== 'admin') {
            return { path: '/' };
        }
    }
});

export default router;
