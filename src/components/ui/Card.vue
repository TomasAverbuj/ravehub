<script>
export default {
  name: 'Card',
  props: {
    padding: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    hover: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    cardClasses() {
      const baseClasses = 'bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200';
      const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      };
      const hoverClasses = this.hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600' : '';
      
      return `${baseClasses} ${paddingClasses[this.padding]} ${hoverClasses}`;
    }
  }
}
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template> 