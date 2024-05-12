<script setup lang="ts">

import { displayErrorNotification } from "~/utilities/Utils"

// Props
defineProps({
  over: {
    type: Boolean,
    required: true,
  },
  challenge: {
    type: Boolean,
    required: true,
  },
  connected: {
    type: Boolean,
    required: true,
  },
})

// Emits
const emit = defineEmits(['new-game'])

// Constants
const toast = useToast()

</script>

<template>
  <transition
      enter-active-class="transform ease-in-out duration-500 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0">
    <div v-if="over" class="px-2.5 py-1 sm:pl-1 lg:pb-3 lg:py-0">
      <UAlert
        v-if="!challenge"
        :actions="
        connected ? [
          { variant: 'solid', color: 'primary', label: 'PLAY AGAIN', click: () => emit('new-game') },
          { variant: 'outline', color: 'primary', label: 'DAILY CHALLENGE',
          click: () => navigateTo('/daily-challenge') },
        ] : [
          { variant: 'solid', color: 'primary', label: 'PLAY AGAIN', click: () => emit('new-game') },
          { variant: 'outline', color: 'primary', label: 'DAILY CHALLENGE', click: () => {
            displayErrorNotification(toast, 'You must sign in to play the Daily Challenge.')
          }},
        ]"
        title="More ?"
        :ui="{
          shadow: 'shadow-md',
        }"
      />
      <UAlert
          v-else
          :actions="[
            { variant: 'solid', color: 'primary', label: 'TRY SOLO MODE', click: () => { navigateTo('/solo-mode') }},
          ]"
          title="Play again ?"
          :ui="{
            shadow: 'shadow-md',
          }"
      />
    </div>
  </transition>
</template>