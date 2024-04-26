<script setup lang="ts">

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from '~/utilities/Utils'

// Props
const props = defineProps({
  welcome:{
    type : Boolean
  },
})

// Emits
const emit = defineEmits(['signup-event'])

// Constants
const schema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string(),
  password: z.string().min(passwordMinimalLength, 'Must be at least '+passwordMinimalLength+' characters')
})
type Schema = z.output<typeof schema>

// Refs
const state = reactive({
  email: undefined,
  username: undefined,
  password: undefined
})

// Functions
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit("signup-event", event.data.email, event.data.username, event.data.password)
}

</script>

<template>
  <div class="flex justify-between">
    <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
      <UFormGroup name="email">
        <UInput v-model="state.email" placeholder="Email"/>
      </UFormGroup>

      <UFormGroup name="username">
        <UInput v-model="state.username" placeholder="Username" />
      </UFormGroup>

      <UFormGroup name="password">
        <UInput v-model="state.password" placeholder="Password" type="password" />
      </UFormGroup>

      <div class="flex justify-between w-full items-center">
        <UButton type="submit">Sign up</UButton>
        <a v-if="welcome" href="/solo-mode" class="text-right text-sm text-blue-500 hover:underline">Skip to solo mode</a>
      </div>
    </UForm>
  </div>

</template>