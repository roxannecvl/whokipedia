<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from '~/utilities/Utils'

// Props
const props = defineProps({
  username: {
    type : String,
    required: true
  },
})

// Emits
const emit = defineEmits(['change-info-event', 'delete-account-event'])

// Refs
const isConfirmDeleteModalOpen = ref(false)

// Constants
const schema = z.object({
  username: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  password: z.string().min(passwordMinimalLength, 'Must be at least ' + passwordMinimalLength + ' characters').optional(),
})
type Schema = z.output<typeof schema>
const user = useCurrentUser()!

// Refs
const state = reactive({
  username: props.username,
  email: user?.value?.email ?? '',
  password: undefined,
})

// Functions
async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("change-info-event", event.data.username, event.data.email, event.data.password)
}

function deleteAccount () {
  isConfirmDeleteModalOpen.value = false
  emit('delete-account-event')
}

</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4 w-full pb-4" @submit="onSubmit">
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
        <UButton type="submit">Save changes</UButton>
        <UButton  icon="i-heroicons-trash-16-solid" color="red" variant="soft" @click="isConfirmDeleteModalOpen = true">Delete account</UButton>
      </div>
    </UForm>
    <UModal v-model="isConfirmDeleteModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Delete your account</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isConfirmDeleteModalOpen = false" />
          </div>
        </template>
        <p class="mb-4">Are you sure you want to say goodbye to us, <span class="text-primary">{{ username }}</span> ?</p>
        <UButton color="red" @click="deleteAccount()">Yes, delete my account</UButton>
      </UCard>
    </UModal>
</template>