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
})

// Emits
const emit = defineEmits(['new-game'])

</script>

<template>
  <div v-if="over" class="m-1">
      <div class="h-full flex flex-row gap-2 text-xl font-medium lg:flex-col">
        Play Again :
        <!-- first button goes to /solo-mode or if already there emits 'new-game' -->
        <UButton variant="outline" size="md" to="/solo-mode" @click="emit('new-game')"> Solo Mode</UButton>
        <UButton v-if="!challenge" variant="outline" size="md" to="/daily-challenge"> Daily Challenge </UButton>
      </div>
  </div>
</template>