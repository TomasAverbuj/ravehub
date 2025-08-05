<script>
import { ref, onMounted, computed } from 'vue';
import { getUserProfileById } from '../../services/user-profile.js';

export default {
  name: 'Avatar',
  props: {
    userId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg, xl
      validator: value => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    skipFirestore: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const profileImage = ref('');
    const loading = ref(true);
    const error = ref(false);

    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    const getInitial = computed(() => {
      // Si tenemos email, usar la primera letra
      if (props.email && props.email.length > 0 && props.email !== 'Usuario') {
        return props.email.charAt(0).toUpperCase();
      }
      
      // Si tenemos userId válido, usar la primera letra
      if (props.userId && props.userId !== 'unknown' && props.userId !== 'null' && props.userId !== 'Usuario') {
        return props.userId.charAt(0).toUpperCase();
      }
      
      // Fallback
      return '?';
    });

    const getAvatarColor = computed(() => {
      // Generar un color basado en el email o userId para consistencia
      const text = props.email || props.userId || '';
      let hash = 0;
      
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Array de colores atractivos para avatares
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500'
      ];
      
      return colors[Math.abs(hash) % colors.length];
    });

    const loadUserProfile = async () => {
      // Si skipFirestore es true, no intentar cargar de Firestore
      if (props.skipFirestore) {
        loading.value = false;
        return;
      }

      try {
        loading.value = true;
        // Solo intentar cargar si el userId es válido
        if (props.userId && props.userId !== 'unknown' && props.userId !== 'null' && props.userId.length > 5) {
          const profile = await getUserProfileById(props.userId);
          if (profile && profile.profileImage) {
            profileImage.value = profile.profileImage;
          }
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        error.value = true;
        // No lanzar el error, solo manejarlo silenciosamente
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // Solo cargar si tenemos un userId válido y no estamos saltando Firestore
      if (!props.skipFirestore && props.userId && props.userId !== 'unknown' && props.userId !== 'null' && props.userId.length > 5) {
        loadUserProfile();
      } else {
        loading.value = false;
      }
    });

    return {
      profileImage,
      loading,
      error,
      sizeClasses,
      getInitial,
      getAvatarColor
    };
  }
};
</script>

<template>
  <div 
    :class="[
      sizeClasses[size],
      'rounded-full flex items-center justify-center font-bold text-white transition-all duration-200',
      showBorder ? 'border-2 border-white dark:border-gray-800 shadow-lg' : '',
      profileImage ? 'bg-cover bg-center' : getAvatarColor
    ]"
    :style="profileImage ? { backgroundImage: `url(${profileImage})` } : {}"
  >
    <!-- Loading state -->
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    
    <!-- Fallback to initials -->
    <span v-else-if="!profileImage || error" class="flex items-center justify-center w-full h-full" :class="{
      'text-lg': size === 'lg',
      'text-xl': size === 'xl',
      'text-base': size === 'md',
      'text-xs': size === 'sm'
    }">
      {{ getInitial }}
    </span>
  </div>
</template> 