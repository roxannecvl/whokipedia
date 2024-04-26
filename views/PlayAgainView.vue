<script setup lang="ts">

// Props
const props = defineProps({
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
const toast = useToast()

// Functions
function alertLogin(){
  toast.remove('any')
  toast.add({ id:'any', title: 'Sign in to unlock Daily Challenge', icon: 'i-heroicons-x-circle', color:'red'})
}

</script>

<template>
  <transition
      enter-active-class="transform ease-in-out duration-500 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
  >
    <div v-if="over" class="px-2.5 py-1 sm:pl-1 lg:pb-3 lg:py-0">
      <UAlert
          v-if="!challenge"
          :actions="
          connected ? [
            { variant: 'solid', color: 'primary', label: 'PLAY AGAIN', click: () => { emit('new-game') }},
            { variant: 'soft', color: 'primary', label: 'DAILY CHALLENGE', click: () => { navigateTo('/daily-challenge')}},
          ] : [
            { variant: 'solid', color: 'primary', label: 'PLAY AGAIN', click: () => { emit('new-game') }},
            { variant: 'soft', color: 'primary', label: 'DAILY CHALLENGE', click: alertLogin},
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