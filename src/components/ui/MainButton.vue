<script>
export default {
  name: 'MainButton',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'md'
    }
  }
}
</script>

<template>
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    <slot />
  </button>
</template> 