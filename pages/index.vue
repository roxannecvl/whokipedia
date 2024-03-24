<script
  setup
  lang="ts">

import SignupLoginPresenter from "~/presenter/signupLoginPresenter.vue"

const isOpen = ref(false)

import { ref } from 'vue';

</script>

<template>
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
  <div>
    <UButton label="Sign up / Log in" @click="isOpen = true" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <SignupLoginPresenter />
      </div>
    </UModal>
  </div>
</template>
