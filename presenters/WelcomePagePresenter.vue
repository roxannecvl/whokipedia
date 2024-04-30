<script setup lang="ts">
import WelcomePageView from "~/views/WelcomePageView.vue"
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { login, logout, signup } from "~/utilities/Auth";
import { useUserStore, type UserStore } from "~/model/UserModel";

// Model
const userModel: UserStore = useUserStore()

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
      @signup-event-tris="(email: string, username: string, password: string) => signup(email, username, password, userModel,  auth, toast, true)"
      @logout-event-bis="logout(auth, toast, useRoute().path)"
      :closeLSV="closeModal"
  />
</template>