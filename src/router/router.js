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
    console.log('🔄 Router: Auth state changed:', { 
        authLoading, 
        newUserData, 
        hasId: newUserData?.id !== null,
        timestamp: new Date().toISOString()
    });
    authUser = newUserData;
    authLoading = false;
});

router.beforeEach(async (to, from) => {
    console.log('🚦 Router Guard:', {
        to: to.path,
        from: from?.path || 'initial',
        authLoading,
        authUser: { id: authUser?.id, email: authUser?.email },
        requiresAuth: to.meta?.requiresAuth,
        timestamp: new Date().toISOString()
    });

    // Si estamos cargando la autenticación y no es la navegación inicial, bloquear
    if (authLoading && from.name) {
        console.log('⏳ Router: Blocking navigation - auth still loading');
        return false;
    }
    
    // Si el usuario está autenticado y trata de acceder a login/registro/recuperar-contrasena, redirigir a Home
    // Esta verificación debe hacerse incluso durante la carga inicial
    if (authUser.id !== null && (to.path === '/iniciar-sesion' || to.path === '/registro' || to.path === '/recuperar-contrasena')) {
        console.log('🔄 Router: Redirecting authenticated user from auth pages to home');
        return { path: '/' };
    }
    
    // Si el usuario no está autenticado y trata de acceder a rutas protegidas
    if(authUser.id === null && to.meta.requiresAuth) {
        console.log('🚫 Router: Redirecting unauthenticated user to login');
        return {
            path: '/iniciar-sesion',
        };
    }

    // Si estamos cargando y el usuario intenta acceder a páginas de auth, 
    // esperar a que se complete la carga para tomar una decisión
    if (authLoading && (to.path === '/iniciar-sesion' || to.path === '/registro' || to.path === '/recuperar-contrasena')) {
        console.log('⏳ Router: Waiting for auth to complete before allowing access to auth pages');
        return false;
    }

    console.log('✅ Router: Navigation allowed');
});

export default router;
