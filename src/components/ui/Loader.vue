<script>
export default {
  name: 'Loader',
  props: {
    size: {
      type: String,
      default: 'md' // 'sm', 'md', 'lg'
    }
  },
  computed: {
    sizeClasses() {
      const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
      }
      return sizes[this.size] || sizes.md
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div 
      :class="sizeClasses"
      class="animate-spin rounded-full border-2 border-gray-300 border-t-black"
    ></div>
  </div>
</template> 