<script>
export default {
  name: 'MainLabel',
  props: {
    for: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <label 
    :for="for"
    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
  >
    <slot />
  </label>
</template> 