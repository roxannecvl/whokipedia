<script setup lang="ts">
import WelcomePageView from "~/views/WelcomePageView.vue"
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { login, logout, signup } from "~/utilities/Auth";
import type { UserStore } from "~/model/UserModel";

// Props
const props = defineProps({
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
      @login-event-tris="(username: string, password: string) => login(username, password, true, auth, toast)"
      @signup-event-tris="(email: string, username: string, password: string) => signup(email, username, password, userModel, true, auth, toast)"
      @logout-event-bis="logout(useRoute().path, auth, toast)"
      :closeLSV="closeModal"
  />
</template>