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
  <div
      v-if="over"
      class="md:mb-2 p-1">
    <!--      <div class="h-full flex flex-row gap-2 text-xl font-medium lg:flex-col">-->
    <!--        Play Again :-->
    <!--        &lt;!&ndash; first button goes to /solo-mode or if already there emits 'new-game' &ndash;&gt;-->
    <!--        <UButton variant="outline" size="md" to="/solo-mode" @click="emit('new-game')"> Solo Mode</UButton>-->
    <!--        <UButton v-if="!challenge" variant="outline" size="md" to="/daily-challenge"> Daily Challenge </UButton>-->
    <!--      </div>-->

    <UAlert
        v-if="!challenge"
        :actions="[
          { variant: 'solid', color: 'primary', label: 'SOLO', click: () => { emit('new-game') }},
          { variant: 'soft', color: 'primary', label: 'TRY DAILY CHALLENGE', click: () => { navigateTo('/daily-challenge') }},
        ]"
        title="Play again ?"
        :ui="{
          shadow: 'shadow-lg',
        }"
    />
    <UAlert
        v-else
        :actions="[
          { variant: 'solid', color: 'primary', label: 'SOLO MODE', click: () => { navigateTo('/solo-mode') }},
        ]"
        title="Play again ?"
        :ui="{
          shadow: 'shadow-lg',
        }"
    />

  </div>
</template>