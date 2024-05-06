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
  username: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(passwordMinimalLength, 'Must be at least ' + passwordMinimalLength + ' characters').optional(),
})
const confirmSchema = z.object({
  password: z.string()
})
const user = useCurrentUser()!
const usernames: string[] = await getAllUsernamesFromFirebase()
type Schema = z.output<typeof schema>

// Refs
const state = reactive({
  username: props.username,
  email: user?.value?.email ?? '',
  password: undefined,
})
const confirmState = reactive({
  password: undefined
})
const isConfirmModalOpen = ref(false)

// Functions
async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("change-info-event", event.data.username, event.data.email, event.data.password)
}
function validate(state: any): FormError[] {
  return usernames.includes(state.username) ? [{ path: 'username', message: 'This username is already in use' }] : []
}

</script>

<template>
    <UForm :validate="validate" :schema="schema" :state="state" class="space-y-4 w-full pb-4">
      <UFormGroup size="lg" label="Update your username" name="username">
        <UInput v-model="state.username" icon="i-heroicons-user"/>
      </UFormGroup>
      <UFormGroup size="lg" label="Update your email" name="email">
        <UInput v-model="state.email" icon="i-heroicons-envelope"/>
      </UFormGroup>
      <UFormGroup size="lg" label="Update your password" name="password">
        <UInput v-model="state.password" icon="i-heroicons-lock-closed" placeholder="New password" type="password" />
      </UFormGroup>
      <div class="flex justify-between w-full items-center">
        <UButton :disabled="state.password === undefined && state.email === user?.email && state.username === username" type="submit">Save changes</UButton>
        <UButton  icon="i-heroicons-trash-16-solid" color="red" variant="soft" @click="isConfirmModalOpen = true">Delete account</UButton>
      </div>
    </UForm>
    <UModal v-model="isConfirmModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Confirm your changes</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isConfirmModalOpen = false" />
          </div>
        </template>
        <p class="mb-4">Are you sure you want to say goodbye to us, <span class="text-primary">{{ username }}</span> ?</p>
        <UButton color="red" @click="() => {
           isConfirmModalOpen = false
           emit('delete-account-event')
        }">Yes, delete my account</UButton>
      </UCard>
    </UModal>
</template>