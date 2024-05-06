<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { handleResetPassword } from "~/utilities/Auth"
import { displayErrorNotification, passwordMinimalLength } from "~/utilities/Utils"

// Constants
const auth = useFirebaseAuth()!
const toast = useToast()
const route = useRoute()
const schema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters long')
})

// Refs
const mode = ref(route.query.mode)
const actionCode = ref(route.query.oobCode)
const state = reactive({
  newPassword: undefined
})

// Types
type Schema = z.output<typeof schema>

// Lifecycle hooks
onMounted(async () => {
  if (mode.value !== 'resetPassword') {
    displayErrorNotification(toast, 'Invalid request.')
    await useRouter().push('/')
  }
})

// Functions
async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
    await handleResetPassword(auth, actionCode.value, event.data.newPassword, toast)
    await useRouter().push('/')
}
</script>

<template>
  <div class="flex justify-center items-center">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Reset your <span class="text-primary">password</span>.</h3>
        </div>
      </template>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <UFormGroup label="New password" :description="'It must contain at least ' + passwordMinimalLength + ' characters.'" name="newPassword">
          <UInput v-model="state.newPassword" icon="i-heroicons-lock-closed" type="password" />
        </UFormGroup>
        <UButton class="mt-2" type="submit" variant="soft">Reset password</UButton>
      </UForm>
    </UCard>
  </div>

</template>
