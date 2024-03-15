<script
  setup
  lang="ts">

import LoginPresenter from "~/presenter/userFormPresenter.vue"
const isOpen = ref(false)

</script>

<template>
  <div>
    Home
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink
        to="/example">
      Go to example
    </ULink>
  </div>
  <div>
    <UButton label="Sign up / Log in" @click="isOpen = true" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <LoginPresenter />
      </div>
    </UModal>
  </div>
</template>