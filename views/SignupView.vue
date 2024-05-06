<script setup lang="ts">

import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'
import { getAllUsernamesFromFirebase } from "~/model/FirebaseModel";
import { passwordMinimalLength } from '~/utilities/Utils'

// Props
defineProps({
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
  password: z.string().min(passwordMinimalLength, 'Must be at least '+ passwordMinimalLength + ' characters')
})
const usernames: string[] = await getAllUsernamesFromFirebase()

// Types
type Schema = z.output<typeof schema>

// Refs
const state = reactive({
  email: undefined,
  username: undefined,
  password: undefined
})

// Functions

/**
 * This function emits an event when the form is submitted.
 * @param event - The form submit event containing data
 */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("signup-event", event.data.username, event.data.email, event.data.password)
}

/**
 * This function validates the form data.
 * @param state - The form state
 * @returns FormError[] - An array of form errors
 */
function validate(state: any): FormError[] {
  return usernames.includes(state.username.toLowerCase()) ? [{ path: 'username', message: 'This username is already in use.' }] : []
}

</script>

<template>
  <div class="flex justify-between">
    <UForm :validate="validate" :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" icon="i-heroicons-user" placeholder="ChuckNorris18" />
      </UFormGroup>
      <UFormGroup name="email" label="Email">
        <UInput v-model="state.email" icon="i-heroicons-envelope" placeholder="you@example.com"/>
      </UFormGroup>
      <UFormGroup name="password" label="Password" :description="'It must contain at least ' + passwordMinimalLength + ' characters.'">
        <UInput v-model="state.password" icon="i-heroicons-lock-closed" type="password" />
      </UFormGroup>
      <div class="flex justify-between w-full items-center">
        <UButton type="submit">Sign up</UButton>
        <UButton v-if="welcome" href="/solo-mode" color="primary" variant="soft">Skip to solo mode</UButton>
      </div>
    </UForm>
  </div>
</template>