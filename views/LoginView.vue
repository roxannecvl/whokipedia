<script
    setup
    lang="tsx">

  const emit = defineEmits(['login-event'])
  function login() {
    emit("login-event", username.value, password.value)
  }

  const username = ref('')
  const password = ref('')
  


</script>

<template>
  <div class="flex justify-between">
    <div class="w-60 ">
      <div>
        <form @submit.prevent="login()" class="flex flex-col items-center justify-between">
          <label for="username">Username:</label>
          <input class="bg-slate-100" type="text" id="loginUsername" v-model="username" required>
          <label for="password">Password:</label>
          <input class="bg-slate-100" type="password" id="loginPassword" v-model="password" required>
          <UButton :ui="{ rounded: 'rounded-full' }" type="submit" label="Login" />
        </form>
      </div>
    </div>
  </div>

</template>