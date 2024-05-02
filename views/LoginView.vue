<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from '~/utilities/Utils'

// Props
defineProps({
  welcome:{
    type : Boolean
  },
})

// Emits
const emit = defineEmits(['login-event'])

// Constants
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(passwordMinimalLength, 'Must be at least ' + passwordMinimalLength + ' characters')
})
type Schema = z.output<typeof schema>

// Refs
const state = reactive({
  email: undefined,
  password: undefined
})

// Functions
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit("login-event", event.data.email, event.data.password)
}

</script>

<template>
  <div class="flex justify-between">
    <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
      <UFormGroup name="email">
        <UInput v-model="state.email" icon="i-heroicons-envelope" placeholder="Email"/>
      </UFormGroup>
      <UFormGroup name="password">
        <UInput v-model="state.password" icon="i-heroicons-lock-closed" placeholder="Password" type="password" />
      </UFormGroup>
      <div class="flex justify-between w-full items-center">
        <UButton type="submit">Log in</UButton>
        <UButton v-if="welcome" href="/solo-mode" color="primary" variant="soft">Skip to solo mode</UButton>
      </div>
    </UForm>
  </div>
</template>