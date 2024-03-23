<script setup lang="ts">

import { reactive } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import {
  schema,
  type Schema,
  validateForm
} from "~/utilities/FormValidation";

const state = reactive({
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  return validateForm(state)
})

const emit = defineEmits(['login-event'])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const errors = validateForm(event.data)
  console.log(event.data)
  if (errors) {
    console.log(errors)
  } else {
    emit('login-event', state.email, state.password)
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit" :disabled="isFormValid" variant="solid">
      Submit
    </UButton>
  </UForm>
</template>