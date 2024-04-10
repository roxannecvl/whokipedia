<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

  const emit = defineEmits(['signup-event'])

  const schema = z.object({
    email: z.string().email('Invalid email'),
    username: z.string(),
    password: z.string().min(6, 'Must be at least 6 characters')
  })

  type Schema = z.output<typeof schema>

  const state = reactive({
    email: undefined,
    username: undefined,
    password: undefined
  })

  async function onSubmit (event: FormSubmitEvent<Schema>) {
    emit("signup-event", event.data.email, event.data.username, event.data.password)
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

          <UFormGroup name="username">
            <UInput v-model="state.username" placeholder="Username" />
          </UFormGroup>

          <UFormGroup name="password">
            <UInput v-model="state.password" placeholder="Password" type="password" />
          </UFormGroup>

          <UButton type="submit">
            Sign up
          </UButton>
        </UForm>
      </div>
    </div>
  </div>

</template>