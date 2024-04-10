<script setup lang="ts">

// Emits
const emit = defineEmits(['signup-event'])

// Refs
const username = ref('')
const password = ref('')

// Functions
function signup() {
  emit("signup-event", username.value, password.value)
}

</script>

<template>
  <div class="flex justify-between">
    <div class="w-60 ">
      <div>
        <form @submit.prevent="signup()" class="flex flex-col items-center justify-between">
          <label for="username">Username:</label>
          <input class="bg-slate-100" type="text" id="signupUsername" v-model="username" required>
          <label for="password">Password:</label>
          <input class="bg-slate-100" type="password" id="signupPassword" v-model="password" required>
          <UButton :ui="{ rounded: 'rounded-full' }" type="submit" label="Signup" />
        </form>
      </div>
    </div>
  </div>

</template>