<script setup lang="ts">

import { displayErrorNotification } from "~/utilities/Utils"
import ResetPasswordPresenter from "~/presenters/ResetPasswordPresenter.vue";

// Constants
const route = useRoute()
const toast = useToast()

// Refs
const mode = ref(route.query.mode as string)
const actionCode = ref(route.query.oobCode as string)

onMounted(async () => {
  if (mode.value !== 'resetPassword') {
    displayErrorNotification(toast, 'Invalid request.')
    await useRouter().push('/')
  }
})

</script>

<template>
  <ResetPasswordPresenter :actionCode="actionCode"/>
</template>
