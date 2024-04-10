<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from '~/utilities/Utils'

// Emits
const emit = defineEmits(['login-event'])

// Constants
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(passwordMinimalLength, 'Must be at least '+passwordMinimalLength+' characters')
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
    <div class="w-60 ">
      <div class="m-5">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup name="email">
            <UInput v-model="state.email" placeholder="Email"/>
          </UFormGroup>

          <UFormGroup name="password">
            <UInput v-model="state.password" placeholder="Password" type="password" />
          </UFormGroup>

          <UButton type="submit">
            Log in
          </UButton>
        </UForm>
      </div>
    </div>
  </div>

</template>