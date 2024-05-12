<script setup lang="ts">

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { passwordMinimalLength } from "~/utilities/Utils"

// Emits
const emit = defineEmits(['reset-password-event'])

// Constants
const logoPath = '/img/logo-filled.svg'
const schema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters long')
})

// Refs
const state = reactive({
  newPassword: undefined
})

// Types
type Schema = z.output<typeof schema>

/**
 * Method to emit the event to reset the password.
 * @param event
 */
async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
  emit('reset-password-event', event.data.newPassword)
}
</script>

<template>
  <div class="w-full h-full relative">
    <div class="absolute flex items-center left-2 sm:left-auto sm:right-0 lg:right-8 h-full min-w-[32rem] aspect-square box-border p-8 pointer-events-none">
      <img :src="logoPath" class="w-full h-full object-contain opacity-60 dark:opacity-60 blur-[6px] sm:blur-[7px] md:blur-[8px]" alt="Whokipedia"/>
    </div>
    <div class="relative h-full flex flex-col justify-center gap-6 sm:gap-8 md:w-2/3 py-0 z-10">
      <div class="flex justify-center items-center">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Reset your <span class="text-primary">password</span>.</h3>
            </div>
          </template>
          <UForm :schema="schema" :state="state" @submit="onSubmit">
            <UFormGroup required label="New password" :description="'It must contain at least ' + passwordMinimalLength + ' characters.'" name="newPassword">
              <UInput v-model="state.newPassword" icon="i-heroicons-lock-closed" type="password" placeholder="Choose a new password" />
            </UFormGroup>
            <UButton class="mt-2" type="submit" variant="soft">Reset password</UButton>
          </UForm>
        </UCard>
      </div>
    </div>
  </div>
</template>
