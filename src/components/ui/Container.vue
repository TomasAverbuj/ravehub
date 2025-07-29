<script>
export default {
  name: 'Container',
  props: {
    maxWidth: {
      type: String,
      default: '6xl', // '4xl', '5xl', '6xl', '7xl'
      validator: value => ['4xl', '5xl', '6xl', '7xl'].includes(value)
    },
    padding: {
      type: String,
      default: 'md', // 'sm', 'md', 'lg'
      validator: value => ['sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    containerClasses() {
      const maxWidthClasses = {
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl'
      }
      
      const paddingClasses = {
        sm: 'px-4',
        md: 'px-6',
        lg: 'px-8'
      }
      
      return `w-full mx-auto ${maxWidthClasses[this.maxWidth]} ${paddingClasses[this.padding]}`
    }
  }
}
</script>

<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template> 