<script>
import { ref, onMounted } from 'vue';
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

    const getInitial = (email) => {
      return email ? email.charAt(0).toUpperCase() : '?';
    };

    const loadUserProfile = async () => {
      try {
        loading.value = true;
        const profile = await getUserProfileById(props.userId);
        profileImage.value = profile.profileImage || '';
      } catch (err) {
        console.error('Error loading user profile:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      if (props.userId && props.userId !== 'unknown' && props.userId !== 'null') {
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
      getInitial
    };
  }
};
</script>

<template>
  <div 
    :class="[
      sizeClasses[size],
      'rounded-full flex items-center justify-center font-bold text-white dark:text-black transition-all duration-200',
      showBorder ? 'border-2 border-white dark:border-gray-800 shadow-lg' : '',
      profileImage ? 'bg-cover bg-center' : 'bg-black dark:bg-white'
    ]"
    :style="profileImage ? { backgroundImage: `url(${profileImage})` } : {}"
  >
    <!-- Loading state -->
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    
    <!-- Fallback to initials -->
    <span v-else-if="!profileImage || error" class="text-sm" :class="{
      'text-lg': size === 'lg',
      'text-xl': size === 'xl',
      'text-base': size === 'md',
      'text-xs': size === 'sm'
    }">
      {{ getInitial(email) }}
    </span>
  </div>
</template> 