<script setup lang="ts">

defineProps({
  hintCount: Number,
  over: Boolean,
  //TODO : add the time
})

const logoFilledPath = '/img/logo-filled.svg';
const logoTransparentPath = '/img/logo-transparent.svg';

const mode = useColorMode();
const logoPath = computed(() => mode.value === 'dark' ? logoFilledPath : logoTransparentPath);

</script>

<template>

  <div>
    <img
        :src="logoPath"
        alt="logo"
        class="w-40 h-40 mx-auto"
    />
  </div>


  <UAlert
      :title="'Guess number ' + hintCount"
      color="primary"
      :variant="over ? 'subtle': 'outline'"
      :description="'0 min 17 sec'"
      class="my-4"
  />

  <UDivider
      label="How to play"
      :ui="{ label: 'text-xl font-bold' }"
  />

  <p class="py-3 font-semibold">
  Guess the celebrity <span class="text-primary">in as few hints as possible</span>
  </p>
  <ul class="list-disc list-inside m-2">
    <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
    <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
    <li><span class="text-primary">Guess until you find the celebrity</span> or until <span class="text-primary">all hints are consumed</span>.</li>
  </ul>
</template>