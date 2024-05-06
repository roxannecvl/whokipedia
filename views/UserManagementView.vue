<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from '~/utilities/Utils'
import { getAllUsernamesFromFirebase } from "~/model/FirebaseModel";

// Props
const props = defineProps({
  username: {
    type : String,
    required: true
  },
})

// Emits
const emit = defineEmits(['change-info-event', 'delete-account-event'])

// Constants
const schema = z.object({
  newUsername: z.string().optional(),
  newEmail: z.string().email('Invalid email').optional(),
  newPassword: z.string().min(passwordMinimalLength, 'Must be at least ' + passwordMinimalLength + ' characters.').optional(),
  password: z.string()
})
const user = useCurrentUser()!
let usernames: string[] = await getAllUsernamesFromFirebase()

// Types
type Schema = z.output<typeof schema>

// Refs
const state = reactive({
  newUsername: props.username,
  newEmail: user.value?.email ?? '',
  newPassword: undefined,
  password: ''
})
const isConfirmModalOpen = ref(false)

// Functions

/**
 * This function emits an event when the form is submitted.
 * @param event - The form submit event containing data
 */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('change-info-event', event.data.newUsername, event.data.newEmail, event.data.newPassword, user.value?.email ?? '', event.data.password)
  state.newPassword = undefined
  state.password = ''
  setTimeout(async () => {
    usernames = await getAllUsernamesFromFirebase()
  }, 1000)
}

/**
 * This function validates the form data.
 * @param state - The form state
 * @returns FormError[] - An array of form errors
 */
function validate(state: any): FormError[] {
  return usernames.filter(item => item !== props.username?.toLowerCase()).includes(state.newUsername.toLowerCase()) ? [{ path: 'newUsername', message: 'This username is already in use.' }] : []
}

</script>

<template>
  <UForm :validate="validate" :schema="schema" :state="state" class="space-y-4 w-full pb-4" @submit="onSubmit">
    <UFormGroup size="lg" label="Update your username" name="newUsername">
      <UInput v-model="state.newUsername" icon="i-heroicons-user"/>
    </UFormGroup>
    <UFormGroup size="lg" label="Update your email" name="newEmail">
      <UInput v-model="state.newEmail" icon="i-heroicons-envelope"/>
    </UFormGroup>
    <UFormGroup size="lg" label="Update your password" name="newPassword">
      <UInput v-model="state.newPassword" icon="i-heroicons-lock-closed" placeholder="New password" type="password"/>
    </UFormGroup>
    <UFormGroup size="lg" label="Enter your password to confirm your changes" name="password" required>
      <UInput v-model="state.password" icon="i-heroicons-lock-closed-20-solid" placeholder="Current password" type="password"/>
    </UFormGroup>
    <div class="flex justify-between w-full items-center">
      <UButton type="submit" :disabled="state.password.length < passwordMinimalLength ||
      (state.newPassword === undefined && state.newEmail === user?.email && state.newUsername === username)">
        Save changes
      </UButton>
      <UButton :disabled="state.password.length < passwordMinimalLength" icon="i-heroicons-trash-16-solid" color="red" variant="soft" @click="isConfirmModalOpen = true">
        Delete account
      </UButton>
    </div>
  </UForm>
  <UModal v-model="isConfirmModalOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Confirm your changes</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isConfirmModalOpen = false"/>
        </div>
      </template>
      <p class="mb-4">Are you sure you want to say goodbye, <span class="text-primary">{{ username }}</span> ?</p>
      <UButton color="red" @click="() => {
           isConfirmModalOpen = false
           emit('delete-account-event', user?.email ?? '', state.password)
        }">Yes, delete my account</UButton>
    </UCard>
  </UModal>
</template>