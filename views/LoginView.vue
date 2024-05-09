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
const emit = defineEmits(['login-event', 'reset-password-event'])

// Constants
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(passwordMinimalLength, 'Must be at least ' + passwordMinimalLength + ' characters')
})
const emailSchema = z.object({
  resetEmail: z.string().email('Invalid email')
})

// Types
type Schema = z.output<typeof schema>
type EmailSchema = z.output<typeof emailSchema>

// Refs
const state = reactive({
  email: undefined,
  password: undefined
})
const emailState = reactive({
  resetEmail: undefined
})
const isPasswordForgottenModalOpen = ref(false)

// Functions

/**
 * This function emits an event when the login form is submitted.
 * @param event - The form submit event containing data
 */
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit("login-event", event.data.email, event.data.password)
}

/**
 * This function emits an event when the form containing email for password rest is submitted.
 * @param event - The email form submit event containing data
 */
async function onSubmitEmail (event: FormSubmitEvent<EmailSchema>) {
  isPasswordForgottenModalOpen.value = false
  emit('reset-password-event',  event.data.resetEmail)
}

</script>

<template>
  <div class="flex justify-between">
    <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" icon="i-heroicons-envelope" placeholder="you@example.com"/>
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <template #hint>
          <p class="text-primary hover:text-primary-600 text-xs cursor-pointer" @click="isPasswordForgottenModalOpen = true">
            Forgot your password ?
          </p>
        </template>
        <template #default>
          <UInput v-model="state.password" placeholder="Your password" icon="i-heroicons-lock-closed" type="password" />
        </template>
      </UFormGroup>
      <div class="flex justify-between w-full items-center">
        <UButton type="submit">Log in</UButton>
        <UButton v-if="welcome" to="/solo-mode" color="primary" variant="soft">Skip to solo mode</UButton>
      </div>
    </UForm>
    <UModal v-model="isPasswordForgottenModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Reset your password</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                     @click="isPasswordForgottenModalOpen = false"/>
          </div>
        </template>
        <UForm :schema="emailSchema" :state="emailState" @submit="onSubmitEmail">
          <UFormGroup class="mb-4" name="resetEmail" description='Type your email below. If it is associated with an
                      existing account, you will receive an email with instructions to reset your password.'>
            <UInput class="mt-2" v-model="emailState.resetEmail"
                    icon="i-heroicons-envelope" placeholder="you@example.com"/>
          </UFormGroup>
          <UButton variant="soft" type="submit">Send me a reset link <UIcon name="i-heroicons-link"/></UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>