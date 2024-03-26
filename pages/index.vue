<script
  setup
  lang="ts">

const isOpen = ref(false)

import { ref } from 'vue';

console.log(useAttrs().userModel)

</script>

<template>
  <div>
    <div>
      Home
    </div>
    <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <ULink to="/example">Go to example</ULink>
    </div>
    <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <ULink to="/test">Test the API</ULink>
    </div>
    <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <ULink to="/statistics">Test the statistics</ULink>
    </div>
  </div>
</template>
