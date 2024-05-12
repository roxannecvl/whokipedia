<script setup lang="ts">

import SignupView from "~/views/SignupView.vue"
import LoginView from "~/views/LoginView.vue"

// Props
const props = defineProps({
  close: {
    type : Boolean,
    required : true,
  },
  welcome:{
    type : Boolean
  },
})

// Emits
const emit = defineEmits(['login-event-bis', 'signup-event-bis', 'logout-event', 'reset-password-event-bis'])

// Refs
const isModalOpen = ref(false)

// Constants
const user = useCurrentUser()

watch(() => props.close, () => {
  if(props.close) isModalOpen.value = false
})

</script>

<template>
  <div v-if="welcome">
    <div  v-if="user" class="p-2">
      <UButton to="/daily-challenge" size="xl" class="text-xl" label="Play">
        Daily Challenge
      </UButton>
    </div>
    <div v-else class="p-2">
      <UButton @click="isModalOpen = true" size="xl" class="text-xl" label="Play">
        Daily Challenge
      </UButton>
    </div>
  </div>
  <div v-else>
    <UButton v-if="user" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" @click="emit('logout-event')">
      <span class="hidden md:inline">Log out</span>
    </UButton>
    <UButton v-else icon="i-heroicons-arrow-right-end-on-rectangle-16-solid" @click="isModalOpen = true">
      <span class="hidden md:inline">Log in</span>
    </UButton>
  </div>
  <UModal v-model="isModalOpen">
    <UCard :ui="{ ring: '' }">
      <div v-if="welcome" class="flex items-center justify-between mb-5">
        <UAlert color="primary" variant="subtle" title="Heads up !" description="Sign in to unlock the Daily Challenge." />
      </div>
      <div class="flex">
        <div class="w-full ">
          <UTabs :items="[{ key: 'login', label: 'Log in' },  { key: 'signup', label: 'Sign up' }]">
            <template #item="{ item }">
              <div v-if="item.key === 'login'" class="pt-4">
                <LoginView
                  @login-event="(email: string, password: string) => emit('login-event-bis', email, password)"
                  @reset-password-event="(email: string) => emit('reset-password-event-bis', email)"
                  :welcome="welcome"/>
              </div>
              <div v-else-if="item.key === 'signup'" class="pt-4">
                <SignupView
                  @signup-event="(username: string, email: string, password: string) =>  {
                    emit('signup-event-bis', username, email, password)
                  }"
                  :welcome="welcome"/>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </UCard>
  </UModal>
</template>