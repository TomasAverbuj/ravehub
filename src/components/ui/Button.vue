<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'outline', 'ghost', 'danger', 'success'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
      
      const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      };
      
      const variantClasses = {
        primary: 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-black dark:focus:ring-white shadow-sm',
        outline: 'border-2 border-black dark:border-white text-black dark:text-white bg-white dark:bg-neutral-950 hover:bg-gray-50 dark:hover:bg-neutral-900 focus:ring-black dark:focus:ring-white',
        ghost: 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 focus:ring-gray-500 dark:focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm'
      };
      
      return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
    }
  }
}
</script>

<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template> 