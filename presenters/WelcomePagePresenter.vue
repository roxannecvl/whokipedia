<script setup lang="ts">
import WelcomePageView from "~/views/WelcomePageView.vue"
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { login, logout, signup } from "~/utilities/auth";
import type { UserStore } from "~/model/UserModel";

// Props
defineProps({
  userModel: {
    type: Object as () => UserStore,
    required: true,
  },
})

// Refs
const closeModal = ref(false)
const user = useCurrentUser()
const auth = useFirebaseAuth()!
const toast = useToast()

// Lifecycle hooks
onMounted(async () => {
  watch(user, (user) => {
    if (user) {
      closeModal.value = true
      setTimeout(() => {
        closeModal.value = false
      }, 1000)
    }
  })
})
</script>

<template>
  <WelcomePageView
      @login-event-tris="(username: string, password: string) => login(username, password, auth, toast, true)"
      @signup-event-tris="(username: string, email: string, password: string) => signup(username, email, password, userModel, auth, toast, true)"
      @logout-event-bis="logout(auth, toast, useRoute().path)"
      :closeLSV="closeModal"
  />
</template>