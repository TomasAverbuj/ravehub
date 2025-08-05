<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { db, storage, auth, handleNetworkError } from '../services/firebase';
import { eventsService } from '../services/events';
import { ticketsService } from '../services/tickets';
import { subscribeToAuth } from '../services/auth.js';
import { getAllUsers, updateUser, deleteUser, createUser as createUserDoc } from '../services/users';
import Container from '../components/ui/Container.vue';
import Button from '../components/ui/Button.vue';
import Card from '../components/ui/Card.vue';
import Loader from '../components/ui/Loader.vue';
import NetworkError from '../components/ui/NetworkError.vue';
import AdminNotification from '../components/ui/AdminNotification.vue';

export default {
  name: 'Admin',
  components: { Container, Button, Card, Loader, NetworkError, AdminNotification },
  setup() {
    const router = useRouter();
    const users = ref([]);
    const events = ref([]);
    const tickets = ref([]);
    const eventsCount = ref(0);
    const usersCount = ref(0);
    const authUser = ref({ role: null });
    const activeTab = ref('overview'); // 'overview', 'users', 'events', 'tickets'
    const loading = ref(false);
    const networkError = ref({ show: false, message: '' });
    
    // Notificaciones administrativas
    const adminNotification = ref({
      show: false,
      type: 'success',
      title: '',
      message: '',
      details: null,
      primaryAction: ''
    });
    
    // User management
    const showCreateUserForm = ref(false);
    const showDeleteUserModal = ref(false);
    const showBlockUserModal = ref(false);
    const selectedUser = ref(null);
    const userForm = ref({
      email: '',
      password: '',
      nombre: '',
      role: 'user'
    });
    const userFormLoading = ref(false);
    
    // Ticket statistics
    const ticketStats = ref({
      totalTickets: 0,
      totalRevenue: 0,
      ticketsByEvent: [],
      revenueByEvent: []
    });
    
    // Eventos management
    const showAddEventForm = ref(false);
    const showEditEventForm = ref(false);
    const eventForm = ref({
      id: '',
      title: '',
      description: '',
      date: '',
      location: '',
      capacity: '',
      price: '',
      img: ''
    });
    const selectedFile = ref(null);
    const uploadProgress = ref(0);

    const fetchUsers = async () => {
      try {
        const retryFunction = async () => {
          const usersData = await getAllUsers();
          users.value = usersData;
          usersCount.value = usersData.length;
        };

        await retryFunction();
      } catch (error) {
        console.error('Error fetching users:', error);
        // Mostrar mensaje de error más descriptivo
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          showNetworkError('Las peticiones están siendo bloqueadas. Verifica tu conexión a internet o desactiva bloqueadores de anuncios.');
        } else {
          showNetworkError(`Error al cargar usuarios: ${error.message}`);
        }
      }
    };

    const fetchEvents = async () => {
      const eventsData = await eventsService.getEvents();
      events.value = eventsData;
      eventsCount.value = eventsData.length;
    };

    const fetchTickets = async () => {
      try {
        loading.value = true;
        const allTickets = await ticketsService.getAllTickets();
        tickets.value = allTickets;
        calculateTicketStats();
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        loading.value = false;
      }
    };

    const calculateTicketStats = () => {
      const stats = {
        totalTickets: tickets.value.length,
        totalRevenue: 0,
        ticketsByEvent: [],
        revenueByEvent: []
      };

      // Group tickets by event
      const eventStats = {};
      
      tickets.value.forEach(ticket => {
        const eventId = ticket.eventId;
        const eventTitle = ticket.event?.title || 'Evento no disponible';
        const ticketPrice = ticket.totalPrice || 0;
        
        if (!eventStats[eventId]) {
          eventStats[eventId] = {
            eventId,
            eventTitle,
            ticketsSold: 0,
            revenue: 0
          };
        }
        
        eventStats[eventId].ticketsSold++;
        eventStats[eventId].revenue += ticketPrice;
        stats.totalRevenue += ticketPrice;
      });

      // Convert to arrays for display
      stats.ticketsByEvent = Object.values(eventStats).sort((a, b) => b.ticketsSold - a.ticketsSold);
      stats.revenueByEvent = Object.values(eventStats).sort((a, b) => b.revenue - a.revenue);

      ticketStats.value = stats;
    };

    const refreshTicketStats = async () => {
      if (activeTab.value === 'tickets') {
        await fetchTickets();
      }
    };

    const changeUserRole = async (user) => {
      try {
        if (!checkAdminPermissions()) return;
        
        if (!user || !user.id) {
          alert('Usuario no válido para actualizar');
          return;
        }
        
        loading.value = true;
        
        const retryFunction = async () => {
          await updateUser(user.id, { role: user.role });
          await fetchUsers();
        };

        await retryFunction();
        showAdminNotification('success', 'Rol Actualizado', `El rol del usuario ha sido actualizado exitosamente a: ${user.role}`, {
          'Usuario': user.email,
          'Nuevo Rol': user.role
        });
      } catch (error) {
        console.error('Error updating user role:', error);
        let errorMessage = 'Error al actualizar rol de usuario';
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Error de conexión: Las peticiones están siendo bloqueadas. Verifica tu conexión a internet.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para actualizar usuarios';
        } else {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        // Revertir el cambio en la UI
        await fetchUsers();
      } finally {
        loading.value = false;
      }
    };

    // User management methods
    const createUser = async () => {
      try {
        if (!checkAdminPermissions()) return;
        
        userFormLoading.value = true;
        
        // Validar campos requeridos
        if (!userForm.value.email || !userForm.value.password || !userForm.value.nombre) {
          alert('Por favor completa todos los campos requeridos');
          return;
        }
        
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userForm.value.email, 
          userForm.value.password
        );
        
        // Crear documento en Firestore
        await createUserDoc(userCredential.user.uid, {
          email: userForm.value.email,
          nombre: userForm.value.nombre,
          role: userForm.value.role,
          createdAt: new Date().toISOString(),
          blocked: false
        });
        
        // Recargar usuarios y cerrar formulario
        await fetchUsers();
        cancelUserForm();
        showAdminNotification('success', 'Usuario Creado', 'El usuario ha sido creado exitosamente en el sistema', {
          'Email': userForm.value.email,
          'Nombre': userForm.value.nombre,
          'Rol': userForm.value.role
        });
      } catch (error) {
        console.error('Error creating user:', error);
        let errorMessage = 'Error al crear usuario';
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'El email ya está registrado';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña es demasiado débil';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'El email no es válido';
        } else {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      } finally {
        userFormLoading.value = false;
      }
    };

    const deleteUserFromSystem = async (user) => {
      try {
        if (!checkAdminPermissions()) return;
        
        if (!user || !user.id) {
          alert('Usuario no válido para eliminar');
          return;
        }
        
        // Verificar que no se esté eliminando a sí mismo
        if (user.id === authUser.value.uid) {
          alert('No puedes eliminar tu propia cuenta');
          return;
        }
        
        // Confirmación adicional
        if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.email}"? Esta acción es irreversible.`)) {
          return;
        }
        
        loading.value = true;
        
        const retryFunction = async () => {
          // Eliminar de Firestore
          await deleteUser(user.id);
          
          // Nota: No podemos eliminar usuarios de Firebase Auth desde el cliente
          // por razones de seguridad. Esto se debe hacer desde el backend.
          // El usuario seguirá existiendo en Auth pero sin datos en Firestore
          
          await fetchUsers();
        };

        await retryFunction();
        showDeleteUserModal.value = false;
        selectedUser.value = null;
        showAdminNotification('success', 'Usuario Eliminado', 'El usuario ha sido eliminado exitosamente de la base de datos', {
          'Usuario': selectedUser.value?.email || 'N/A'
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        let errorMessage = 'Error al eliminar usuario';
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Error de conexión: Las peticiones están siendo bloqueadas. Verifica tu conexión a internet.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para eliminar usuarios. Verifica las reglas de Firestore.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Servicio no disponible. Intenta nuevamente en unos momentos.';
        } else {
          errorMessage = error.message;
        }
        
        showNetworkError(errorMessage);
      } finally {
        loading.value = false;
      }
    };

    const blockUser = async (user) => {
      try {
        if (!checkAdminPermissions()) return;
        
        if (!user || !user.id) {
          alert('Usuario no válido para bloquear');
          return;
        }
        
        // Verificar que no se esté bloqueando a sí mismo
        if (user.id === authUser.value.uid) {
          alert('No puedes bloquear tu propia cuenta');
          return;
        }
        
        // Confirmación adicional
        if (!confirm(`¿Estás seguro de que quieres bloquear al usuario "${user.email}"?`)) {
          return;
        }
        
        loading.value = true;
        
        const retryFunction = async () => {
          await updateUser(user.id, { 
            blocked: true,
            blockedAt: new Date().toISOString()
          });
          
          await fetchUsers();
        };

        await retryFunction();
        showBlockUserModal.value = false;
        selectedUser.value = null;
        showAdminNotification('warning', 'Usuario Bloqueado', 'El usuario ha sido bloqueado exitosamente', {
          'Usuario': selectedUser.value?.email || 'N/A',
          'Estado': 'Bloqueado'
        });
      } catch (error) {
        console.error('Error blocking user:', error);
        let errorMessage = 'Error al bloquear usuario';
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Error de conexión: Las peticiones están siendo bloqueadas. Verifica tu conexión a internet.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para bloquear usuarios. Verifica las reglas de Firestore.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Servicio no disponible. Intenta nuevamente en unos momentos.';
        } else {
          errorMessage = error.message;
        }
        
        showNetworkError(errorMessage);
      } finally {
        loading.value = false;
      }
    };

    const unblockUser = async (user) => {
      try {
        if (!checkAdminPermissions()) return;
        
        if (!user || !user.id) {
          alert('Usuario no válido para desbloquear');
          return;
        }
        
        // Confirmación adicional
        if (!confirm(`¿Estás seguro de que quieres desbloquear al usuario "${user.email}"?`)) {
          return;
        }
        
        loading.value = true;
        
        const retryFunction = async () => {
          await updateUser(user.id, { 
            blocked: false,
            blockedAt: null
          });
          
          await fetchUsers();
        };

        await retryFunction();
        showAdminNotification('success', 'Usuario Desbloqueado', 'El usuario ha sido desbloqueado exitosamente', {
          'Usuario': user.email,
          'Estado': 'Activo'
        });
      } catch (error) {
        console.error('Error unblocking user:', error);
        let errorMessage = 'Error al desbloquear usuario';
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Error de conexión: Las peticiones están siendo bloqueadas. Verifica tu conexión a internet.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para desbloquear usuarios. Verifica las reglas de Firestore.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Servicio no disponible. Intenta nuevamente en unos momentos.';
        } else {
          errorMessage = error.message;
        }
        
        showNetworkError(errorMessage);
      } finally {
        loading.value = false;
      }
    };

    const openDeleteModal = (user) => {
      if (!user || !user.id) {
        alert('Usuario no válido');
        return;
      }
      selectedUser.value = { ...user }; // Crear una copia del usuario
      showDeleteUserModal.value = true;
    };

    const openBlockModal = (user) => {
      if (!user || !user.id) {
        alert('Usuario no válido');
        return;
      }
      selectedUser.value = { ...user }; // Crear una copia del usuario
      showBlockUserModal.value = true;
    };

    const cancelUserForm = () => {
      showCreateUserForm.value = false;
      userForm.value = {
        email: '',
        password: '',
        nombre: '',
        role: 'user'
      };
      userFormLoading.value = false;
    };

    // Eventos management methods
    const goToEventDetail = (eventId) => {
      router.push(`/evento/${eventId}`);
    };

    const addEvent = async () => {
      try {
        if (selectedFile.value) {
          const imgUrl = await uploadImage(selectedFile.value);
          eventForm.value.img = imgUrl;
        }
        await eventsService.addEvent(eventForm.value);
        await fetchEvents();
        showAddEventForm.value = false;
        cancelEventForm();
        showAdminNotification('success', 'Evento Creado', 'El evento ha sido creado exitosamente', {
          'Título': eventForm.value.title,
          'Fecha': eventForm.value.date,
          'Ubicación': eventForm.value.location
        });
      } catch (error) {
        console.error("Error al agregar evento:", error);
      }
    };

    const updateEvent = async () => {
      try {
        if (selectedFile.value) {
          const imgUrl = await uploadImage(selectedFile.value);
          eventForm.value.img = imgUrl;
        }
        await eventsService.updateEvent(eventForm.value);
        await fetchEvents();
        showEditEventForm.value = false;
        cancelEventForm();
        showAdminNotification('success', 'Evento Actualizado', 'El evento ha sido actualizado exitosamente', {
          'Título': eventForm.value.title,
          'Fecha': eventForm.value.date,
          'Ubicación': eventForm.value.location
        });
      } catch (error) {
        console.error("Error al actualizar evento:", error);
      }
    };

    const deleteEvent = async (eventId) => {
      try {
        await eventsService.deleteEvent(eventId);
        await fetchEvents();
        showAdminNotification('warning', 'Evento Eliminado', 'El evento ha sido eliminado exitosamente del sistema');
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
    };

    const uploadImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storageRefInstance = storageRef(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRefInstance, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            uploadProgress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    };

    const handleFileSelection = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const cancelEventForm = () => {
      showAddEventForm.value = false;
      showEditEventForm.value = false;
      eventForm.value = {
        id: '',
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        price: '',
        img: ''
      };
      selectedFile.value = null;
      uploadProgress.value = 0;
    };

    const editEvent = (event) => {
      eventForm.value = { ...event };
      showAddEventForm.value = false;
      showEditEventForm.value = true;
    };

    const parseCapacity = (capacity) => {
      return capacity ? capacity : 'No definido';
    };

    const updateEventsWithoutPrice = async () => {
      try {
        loading.value = true;
        await eventsService.updateEventsWithoutPrice(0);
        await fetchEvents();
        showAdminNotification('success', 'Precios Actualizados', 'Los precios de los eventos han sido actualizados correctamente');
      } catch (error) {
        console.error('Error al actualizar eventos:', error);
        alert('Error al actualizar eventos');
      } finally {
        loading.value = false;
      }
    };

    const checkAdminPermissions = () => {
      if (!authUser.value || authUser.value.role !== 'admin') {
        alert('Solo los administradores pueden realizar estas acciones');
        return false;
      }
      return true;
    };

    const showNetworkError = (message) => {
      networkError.value = { show: true, message };
    };

    const hideNetworkError = () => {
      networkError.value = { show: false, message: '' };
    };

    const showAdminNotification = (type, title, message, details = null, primaryAction = '') => {
      adminNotification.value = {
        show: true,
        type,
        title,
        message,
        details,
        primaryAction
      };
    };

    const hideAdminNotification = () => {
      adminNotification.value.show = false;
    };

    const handleRetry = async () => {
      hideNetworkError();
      await fetchUsers();
    };



    onMounted(() => {
      subscribeToAuth(newUserData => authUser.value = newUserData);
      fetchUsers();
      fetchEvents();
      fetchTickets(); // Fetch tickets on mount
    });

    watch(activeTab, () => {
      refreshTicketStats();
    });

    return { 
      users, 
      events, 
      eventsCount, 
      usersCount, 
      authUser, 
      changeUserRole, 
      activeTab,
      loading,
      showAddEventForm,
      showEditEventForm,
      eventForm,
      selectedFile,
      uploadProgress,
      goToEventDetail,
      addEvent,
      updateEvent,
      deleteEvent,
      handleFileSelection,
      cancelEventForm,
      editEvent,
      parseCapacity,
      updateEventsWithoutPrice,
      ticketStats, // Expose ticketStats to the template
      refreshTicketStats, // Expose refreshTicketStats to the template
      showCreateUserForm,
      userForm,
      userFormLoading,
      createUser,
      showDeleteUserModal,
      openDeleteModal,
      deleteUserFromSystem,
      showBlockUserModal,
      openBlockModal,
      blockUser,
      unblockUser,
      cancelUserForm,
      checkAdminPermissions,
      networkError,
      showNetworkError,
      hideNetworkError,
      handleRetry,
      selectedUser,
      adminNotification,
      showAdminNotification,
      hideAdminNotification
    };
  }
};
</script>

<template>
     <div class="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 min-h-screen">
       <!-- Componente de error de red -->
       <NetworkError 
         :show="networkError.show" 
         :message="networkError.message"
         @retry="handleRetry"
         @close="hideNetworkError"
       />
     <Container class="py-20 max-w-full px-4">
    <div v-if="authUser.role === 'admin'">
        <!-- Header del Panel -->
        <div class="text-center mb-16">
          <div class="flex justify-center mb-8">
            <div class="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
            Panel de Administración
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Gestiona usuarios y eventos de RaveHub
          </p>
        </div>

        <!-- Navegación por pestañas -->
        <div class="flex justify-center mb-12">
          <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button 
              @click="activeTab = 'overview'"
              :class="[
                'px-6 py-3 rounded-md font-semibold transition-all',
                activeTab === 'overview' 
                  ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              ]"
            >
              Resumen
            </button>
            <button 
              @click="activeTab = 'users'"
              :class="[
                'px-6 py-3 rounded-md font-semibold transition-all',
                activeTab === 'users' 
                  ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              ]"
            >
              Usuarios
            </button>
            <button 
              @click="activeTab = 'events'"
              :class="[
                'px-6 py-3 rounded-md font-semibold transition-all',
                activeTab === 'events' 
                  ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              ]"
            >
              Eventos
            </button>
            <button 
              @click="activeTab = 'tickets'"
              :class="[
                'px-6 py-3 rounded-md font-semibold transition-all',
                activeTab === 'tickets' 
                  ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              ]"
            >
              Ventas
            </button>
          </div>
        </div>

        <!-- Contenido de las pestañas -->
        
        <!-- Pestaña Resumen -->
        <div v-if="activeTab === 'overview'" class="space-y-8">
          <!-- Contadores -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card class="text-center p-8">
                              <div class="w-16 h-16 bg-neutral-100 dark:bg-neutral-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-3xl font-black text-black dark:text-white mb-2">{{ usersCount }}</h3>
              <p class="text-gray-600 dark:text-gray-300 font-medium">Usuarios Registrados</p>
            </Card>
            
            <Card class="text-center p-8">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-3xl font-black text-black dark:text-white mb-2">{{ eventsCount }}</h3>
              <p class="text-gray-600 dark:text-gray-300 font-medium">Eventos Creados</p>
            </Card>

            <Card class="text-center p-8">
                      <div class="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 class="text-3xl font-black text-black dark:text-white mb-2">{{ ticketStats.totalTickets }}</h3>
              <p class="text-gray-600 dark:text-gray-300 font-medium">Entradas Vendidas</p>
              <p class="text-lg font-bold text-green-600 dark:text-green-400 mt-2">${{ ticketStats.totalRevenue.toFixed(2) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Ingreso Total</p>
            </Card>
          </div>

          <!-- Estadísticas rápidas -->
          <Card class="p-8">
            <h3 class="text-2xl font-bold text-black dark:text-white mb-6">Estadísticas Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center p-4 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                <div class="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{{ users.filter(u => u.role === 'admin').length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Administradores</div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ users.filter(u => u.role === 'user').length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Usuarios Regulares</div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                <div class="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{{ events.filter(e => new Date(e.fecha) > new Date()).length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Eventos Futuros</div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ ticketStats.ticketsByEvent.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Eventos con Ventas</div>
              </div>
            </div>
          </Card>
        </div>

                           <!-- Pestaña Usuarios -->
          <div v-if="activeTab === 'users'" class="space-y-8">
            <Card class="p-8 max-w-none">
             <div class="flex justify-between items-center mb-6">
               <h3 class="text-2xl font-bold text-black dark:text-white">Gestión de Usuarios</h3>
               <Button @click="showCreateUserForm = true" variant="primary">
                 <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                 </svg>
                 Crear Usuario
               </Button>
             </div>
             
             <!-- Vista de tarjetas para móviles -->
             <div class="grid grid-cols-1 md:hidden gap-4">
               <div v-for="user in users" :key="user.id" class="bg-white dark:bg-neutral-950 rounded-lg shadow-sm p-4">
                 <div class="flex items-center justify-between">
                   <div class="flex-1 min-w-0">
                     <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ user.email }}</h4>
                     <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ user.nombre }}</p>
                     <div class="flex items-center mt-2 space-x-2">
                       <span :class="[
                         'inline-block px-2 py-1 text-xs font-medium rounded-full',
                         user.role === 'admin' 
                           ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                           : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                       ]">
                         {{ user.role }}
                       </span>
                       <span v-if="user.blocked" class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                         Bloqueado
                       </span>
                     </div>
                   </div>
                   <div class="ml-4 flex flex-col space-y-2">
                     <select 
                       v-model="user.role" 
                       @change="changeUserRole(user)" 
                                                     class="rounded-md px-2 py-1 text-xs bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-neutral-500"
                     >
                       <option value="user">Usuario</option>
                       <option value="admin">Administrador</option>
                     </select>
                     <div class="flex space-x-1">
                       <button 
                         @click="user.blocked ? unblockUser(user) : openBlockModal(user)"
                         :class="[
                           'px-2 py-1 text-xs rounded',
                           user.blocked 
                             ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                             : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                         ]"
                       >
                         {{ user.blocked ? 'Desbloquear' : 'Bloquear' }}
                       </button>
                       <button 
                         @click="openDeleteModal(user)"
                         class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                       >
                         Eliminar
                       </button>
                     </div>
                   </div>
                 </div>
        </div>
      </div>

                           <!-- Vista de tabla para desktop -->
              <div class="hidden md:block overflow-x-auto">
                <div class="min-w-full inline-block align-middle">
                  <div class="overflow-hidden rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-neutral-950">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-64">Email</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">Nombre</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Rol</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Estado</th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                          <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 truncate max-w-64">{{ user.email }}</td>
                          <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 truncate max-w-48">{{ user.nombre }}</td>
                          <td class="px-4 py-4">
                            <select 
                              v-model="user.role" 
                              @change="changeUserRole(user)" 
                              class="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="user">Usuario</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td class="px-4 py-4">
                            <span v-if="user.blocked" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Bloqueado
                            </span>
                            <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Activo
                            </span>
                          </td>
                          <td class="px-4 py-4 text-sm">
                            <div class="flex space-x-2">
                              <button 
                                @click="user.blocked ? unblockUser(user) : openBlockModal(user)"
                                :class="[
                                  'px-3 py-1 text-xs rounded font-medium',
                                  user.blocked 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                ]"
                              >
                                {{ user.blocked ? 'Desbloquear' : 'Bloquear' }}
                              </button>
                              <button 
                                @click="openDeleteModal(user)"
                                class="px-3 py-1 text-xs bg-red-100 text-red-800 rounded font-medium hover:bg-red-200"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
           </Card>
         </div>

                 <!-- Pestaña Eventos -->
         <div v-if="activeTab === 'events'" class="space-y-8">
           <Card class="p-8 max-w-none">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-black dark:text-white">Gestión Completa de Eventos</h3>
              <div class="flex space-x-3">
                <Button @click="updateEventsWithoutPrice" variant="outline" class="text-sm">
                  Actualizar Precios
                </Button>
                <Button @click="showAddEventForm = true" variant="primary">
                  Agregar Evento
                </Button>
              </div>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-8">
              <Loader />
            </div>

                         <div v-else class="space-y-4">
                               <!-- Vista de tarjetas para móviles -->
                <div class="grid grid-cols-1 md:hidden gap-4">
                  <div 
                    v-for="event in events" 
                    :key="event.id" 
                    class="bg-white dark:bg-neutral-950 rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 relative group"
                    @click="goToEventDetail(event.id)"
                  >
                   <div class="flex items-start space-x-3">
                     <div class="flex-shrink-0">
                       <img v-if="event.img" :src="event.img" alt="Imagen del evento" class="w-12 h-12 object-cover rounded-full"/>
                       <div v-else class="w-12 h-1 rounded-full flex items-center justify-center">
                         <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                       </div>
                     </div>
                     <div class="flex-1 min-w-0">
                                               <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ event.title || event.titulo }}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ new Date(event.date || event.fecha).toLocaleDateString() }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ event.location || event.ubicacion }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ parseCapacity(event.capacity || event.capacidad) }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${{ event.price || 0 }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ (event.description || event.descripcion || '').substring(0, 50) }}{{ (event.description || event.descripcion || '').length > 50 ? '...' : '' }}</p>
                     </div>
                     <div class="flex flex-col space-y-1" @click.stop>
                       <Button @click="editEvent(event)" variant="outline" size="sm" class="text-xs px-2 py-1">
                         Editar
                       </Button>
                       <Button @click="deleteEvent(event.id)" variant="outline" size="sm" class="text-xs px-2 py-1 text-red-600 hover:text-red-700">
                         Eliminar
                       </Button>
                     </div>
                     <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     </div>
                   </div>
                 </div>
               </div>

                               <!-- Vista de tabla para desktop -->
                <div class="hidden md:block overflow-x-auto">
                  <div class="min-w-full inline-block align-middle">
                    <div class="overflow-hidden rounded-lg">
                      <table class="min-w-full divide-y">
                        <thead class="bg-gray-50 dark:bg-neutral-950">
                          <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">IMG</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">TÍTULO</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-64">DESCRIPCIÓN</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">FECHA</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">UBICACIÓN</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">CAPACIDAD</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">PRECIO</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr 
                            v-for="event in events" 
                            :key="event.id" 
                            class="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer group"
                            @click="goToEventDetail(event.id)"
                          >
                            <td class="px-4 py-4">
                              <img v-if="event.img" :src="event.img" alt="Imagen del evento" class="w-10 h-10 object-cover rounded-full"/>
                              <div v-else class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors max-w-48">{{ event.title || event.titulo }}</td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 truncate max-w-64">{{ (event.description || event.descripcion || '').substring(0, 50) }}{{ (event.description || event.descripcion || '').length > 50 ? '...' : '' }}</td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ new Date(event.date || event.fecha).toLocaleDateString() }}</td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 truncate max-w-48">{{ event.location || event.ubicacion }}</td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ parseCapacity(event.capacity || event.capacidad) }}</td>
                            <td class="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">${{ event.price || 0 }}</td>
                            <td class="px-4 py-4 text-sm">
                              <div class="flex flex-col space-y-1" @click.stop>
                                <Button @click="editEvent(event)" variant="outline" size="sm" class="text-xs px-2 py-1">
                                  Editar
                                </Button>
                                <Button @click="deleteEvent(event.id)" variant="outline" size="sm" class="text-xs px-2 py-1 text-red-600 hover:text-red-700">
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
             </div>
          </Card>
        </div>

        <!-- Pestaña Ventas -->
        <div v-if="activeTab === 'tickets'" class="space-y-8">
          <Card class="p-8 max-w-none">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-black dark:text-white">Estadísticas de Ventas de Entradas</h3>
              <Button @click="refreshTicketStats" variant="outline" class="text-sm">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </Button>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-8">
              <Loader />
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h4 class="text-xl font-bold text-black dark:text-white mb-4">Resumen General</h4>
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>Entradas Vendidas:</div>
                  <div>{{ ticketStats.totalTickets }}</div>
                  <div>Ingreso Total:</div>
                  <div>${{ ticketStats.totalRevenue.toFixed(2) }}</div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h4 class="text-xl font-bold text-black dark:text-white mb-4">Entradas por Evento</h4>
                <div class="overflow-x-auto">
                  <div class="min-w-full inline-block align-middle">
                    <div class="overflow-hidden rounded-lg">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-neutral-950">
                          <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/3">Evento</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">Entradas Vendidas</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">Ingreso</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr v-for="event in ticketStats.ticketsByEvent" :key="event.eventId">
                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-64">{{ event.eventTitle }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ event.ticketsSold }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">${{ event.revenue.toFixed(2) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                <h4 class="text-xl font-bold text-black dark:text-white mb-4">Ingreso por Evento</h4>
                <div class="overflow-x-auto">
                  <div class="min-w-full inline-block align-middle">
                    <div class="overflow-hidden rounded-lg">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/3">Evento</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">Ingreso</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr v-for="event in ticketStats.revenueByEvent" :key="event.eventId">
                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate max-w-64">{{ event.eventTitle }}</td>
                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">${{ event.revenue.toFixed(2) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Modal para agregar/editar eventos -->
        <div v-if="showAddEventForm || showEditEventForm" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-neutral-950 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 v-if="showAddEventForm" class="text-2xl font-bold text-black dark:text-white mb-6">Agregar Evento</h2>
            <h2 v-else class="text-2xl font-bold text-black dark:text-white mb-6">Editar Evento</h2>
            
            <form @submit.prevent="showAddEventForm ? addEvent() : updateEvent()" class="space-y-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input 
                  v-model="eventForm.title" 
                  type="text" 
                  id="title" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea 
                  v-model="eventForm.description" 
                  id="description" 
                  required 
                  rows="3"
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                <input 
                  v-model="eventForm.date" 
                  type="date" 
                  id="date" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
                <input 
                  v-model="eventForm.location" 
                  type="text" 
                  id="location" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacidad</label>
                <input 
                  v-model="eventForm.capacity" 
                  type="number" 
                  id="capacity" 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de Entrada</label>
                <input 
                  v-model="eventForm.price" 
                  type="number" 
                  id="price" 
                  min="0"
                  step="100"
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                >
              </div>
              
              <div>
                <label for="img" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen</label>
                <input 
                  @change="handleFileSelection" 
                  type="file" 
                  id="img" 
                  accept="image/*"
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>

              <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-neutral-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              
              <div class="flex justify-end space-x-3 pt-4">
                <Button @click="cancelEventForm()" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  {{ showAddEventForm ? 'Agregar' : 'Actualizar' }}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal para crear usuario -->
        <div v-if="showCreateUserForm" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-neutral-950 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-black dark:text-white mb-6">Crear Nuevo Usuario</h2>
            
            <form @submit.prevent="createUser" class="space-y-4">
              <div>
                <label for="new-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  v-model="userForm.email" 
                  type="email" 
                  id="new-email" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <input 
                  v-model="userForm.password" 
                  type="password" 
                  id="new-password" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="new-nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                  v-model="userForm.nombre" 
                  type="text" 
                  id="new-nombre" 
                  required 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              
              <div>
                <label for="new-role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                <select 
                  v-model="userForm.role" 
                  id="new-role" 
                  class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div v-if="userFormLoading" class="flex justify-center items-center py-4">
                <Loader />
              </div>
              
              <div class="flex justify-end space-x-3 pt-4">
                <Button @click="cancelUserForm" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" :disabled="userFormLoading">
                  {{ userFormLoading ? 'Creando...' : 'Crear Usuario' }}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal para eliminar usuario -->
        <div v-if="showDeleteUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-neutral-950 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-black dark:text-white mb-6">Eliminar Usuario</h2>
            <p v-if="selectedUser" class="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar al usuario "{{ selectedUser.email }}"? Esta acción es irreversible.
            </p>
            <p v-else class="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.
            </p>
            <div class="flex justify-end space-x-3">
              <Button @click="showDeleteUserModal = false; selectedUser = null" variant="outline">
                Cancelar
              </Button>
              <Button @click="selectedUser ? deleteUserFromSystem(selectedUser) : null" variant="danger">
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        <!-- Modal para bloquear usuario -->
        <div v-if="showBlockUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-neutral-950 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-black dark:text-white mb-6">
              {{ selectedUser && selectedUser.blocked ? 'Desbloquear' : 'Bloquear' }} Usuario
            </h2>
            <p v-if="selectedUser" class="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que quieres {{ selectedUser.blocked ? 'desbloquear' : 'bloquear' }} al usuario "{{ selectedUser.email }}"?
              {{ selectedUser.blocked ? 'Esto permitirá su acceso al sistema.' : 'Esto inhabilitará su acceso al sistema.' }}
            </p>
            <p v-else class="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro de que quieres bloquear este usuario? Esto inhabilitará su acceso al sistema.
            </p>
            <div class="flex justify-end space-x-3">
              <Button @click="showBlockUserModal = false; selectedUser = null" variant="outline">
                Cancelar
              </Button>
              <Button 
                v-if="selectedUser && selectedUser.blocked"
                @click="selectedUser ? unblockUser(selectedUser) : null" 
                variant="success"
              >
                Desbloquear
              </Button>
              <Button 
                v-else
                @click="selectedUser ? blockUser(selectedUser) : null" 
                variant="danger"
              >
                Bloquear
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Acceso denegado -->
      <div v-else class="text-center py-32">
        <div class="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
    </div>
        <h2 class="text-2xl font-bold text-black dark:text-white mb-4">Acceso Denegado</h2>
        <p class="text-gray-600 dark:text-gray-300 text-lg">
          Solo los administradores pueden acceder a esta sección.
        </p>
    </div>
    </Container>

    <!-- Notificación administrativa -->
    <AdminNotification
      :show="adminNotification.show"
      :type="adminNotification.type"
      :title="adminNotification.title"
      :message="adminNotification.message"
      :details="adminNotification.details"
      :primaryAction="adminNotification.primaryAction"
      @close="hideAdminNotification"
      @primary-action="hideAdminNotification"
    />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Animaciones para las pestañas */
.tab-enter-active, .tab-leave-active {
  transition: opacity 0.3s ease;
}

.tab-enter-from, .tab-leave-to {
  opacity: 0;
}
</style>

