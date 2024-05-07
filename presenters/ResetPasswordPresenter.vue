<script setup lang="ts">

import { handleResetPassword } from "~/utilities/Auth"
import ResetPasswordView from "~/views/ResetPasswordView.vue"

// Props
defineProps({
  actionCode: {
    type: String,
    required: true
  }
})

// Constants
const auth = useFirebaseAuth()!
const toast = useToast()

</script>

<template>
  <ResetPasswordView :actionCode="actionCode"
                     @reset-password-event="async (newPassword: string) => {
                       await handleResetPassword(auth, actionCode, newPassword, toast)
                       await useRouter().push('/')
                     }"/>
</template>