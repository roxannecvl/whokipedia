<script setup lang="ts">

import WelcomePageView from "~/views/WelcomePageView.vue"
import { useCurrentUser, useFirebaseAuth } from "vuefire"
import { login, logout, resetPassword, signup } from "~/utilities/Auth"
import { useUserStore, type UserStore } from "~/model/UserModel"

// Model
const userModel: UserStore = useUserStore()

// Refs
const closeModal = ref(false)
const user = useCurrentUser()
const auth = useFirebaseAuth()!
const toast = useToast()

watch(user, (user) => {
  if (user) {
    closeModal.value = true
    setTimeout(() => {
      closeModal.value = false
    }, 1000)
  }
})
</script>

<template>
  <WelcomePageView
      @login-event-tris="async (username: string, password: string) => {
        await login(username, password, auth, toast)
        await useRouter().push('/daily-challenge')
      }"
      @signup-event-tris="async (username: string, email: string, password: string) => {
        await signup(username, email, password, userModel, auth, toast)
        await useRouter().push('/daily-challenge')
      }"
      @logout-event-bis="async () => {
        await logout(auth, toast)
        if (useRoute().path === '/daily-challenge') await useRouter().push('/')
      }"
      @reset-password-event-bis="async (email: string) => await resetPassword(email, auth, toast)"
      :closeLSV="closeModal"></WelcomePageView>
</template>